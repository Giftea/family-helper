import { useEffect, useReducer } from "react";
import "./App.css";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsConfig from "./aws-exports";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listLists } from "./graphql/queries";
import { createList, deleteList, updateList } from "./graphql/mutations";
import {
  onCreateList,
  onDeleteList,
  onUpdateList,
} from "./graphql/subscriptions";
import "semantic-ui-css/semantic.min.css";
import { Container, Button, Icon, Modal, Form } from "semantic-ui-react";
import MainHeader from "./components/header/MainHeader";
import Lists from "./components/List/Lists";
import ListModal from "./components/modals/ListModal";

Amplify.configure(awsConfig);

const initialState = {
  id: "",
  title: "",
  description: "",
  lists: [],
  isModalOpen: false,
  modalType: "",
};
function listReducer(state = initialState, action) {
  switch (action.type) {
    case "DESCRIPTION_CHANGED":
      return { ...state, description: action.value };

    case "TITLE_CHANGED":
      return { ...state, title: action.value };

    case "UPDATE_LISTS":
      return { ...state, lists: [...action.value, ...state.lists] };

    case "OPEN_MODAL":
      return { ...state, isModalOpen: true, modalType: "add" };

    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        title: "",
        description: "",
        id: "",
      };

    case "DELETE_LIST":
      deleteListById(action.value);
      return { ...state };

    case "DELETE_LIST_RESULT":
      const newList = state.lists.filter((item) => item.id !== action.value);
      return { ...state, lists: newList };

    case "EDIT_LIST":
      const newValue = { ...action.value };
      delete newValue.children;
      delete newValue.listItems;
      delete newValue.dispatch;
      return {
        ...state,
        isModalOpen: true,
        modalType: "edit",
        id: newValue.id,
        title: newValue.title,
        description: newValue.description,
      };
    case "UPDATE_LISTS_RESULT":
      const index = state.lists.findIndex(
        (item) => item.id === action.value.id
      );
      const newUpdatedList = [...state.lists];
      delete action.value.children;
      delete action.value.listItems;
      newUpdatedList[index] = action.value;
      return { ...state, lists: newUpdatedList };

    default:
      console.log("Default action for: ", action);
      return state;
  }
}
const deleteListById = async (id) => {
  const result = await API.graphql(
    graphqlOperation(deleteList, { input: { id } })
  );
};

function App() {
  const [state, dispatch] = useReducer(listReducer, initialState);

  async function fetchList() {
    const { data } = await API.graphql(graphqlOperation(listLists));
    dispatch({ type: "UPDATE_LISTS", value: data.listLists.items });
  }
  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    let createListSubscription = API.graphql(
      graphqlOperation(onCreateList)
    ).subscribe({
      next: ({ provider, value }) => {
        dispatch({ type: "UPDATE_LISTS", value: [value.data.onCreateList] });
      },
    });
    let deleteListSubscription = API.graphql(
      graphqlOperation(onDeleteList)
    ).subscribe({
      next: ({ provider, value }) => {
        dispatch({
          type: "DELETE_LIST_RESULT",
          value: value.data.onDeleteList.id,
        });
      },
    });
    let editListSubscription = API.graphql(
      graphqlOperation(onUpdateList)
    ).subscribe({
      next: ({ provider, value }) => {
        dispatch({
          type: "UPDATE_LISTS_RESULT",
          value: value.data.onUpdateList,
        });
      },
    });

    return () => {
      createListSubscription.unsubscribe();
      deleteListSubscription.unsubscribe();
      editListSubscription.unsubscribe();
    };
  }, []);

  return (
    <AmplifyAuthenticator>
      <AmplifySignOut />
      <Button
        className="floating-btn"
        onClick={() => dispatch({ type: "OPEN_MODAL" })}
      >
        <Icon name="plus" className="floating-btn-icon" />
      </Button>
      <Container style={{ height: "100vh" }}>
        <div>
          <MainHeader />
          <h1>amp</h1>
          <Lists list={state.lists} dispatch={dispatch} />
        </div>
      </Container>
      <ListModal state={state} dispatch={dispatch} />
    </AmplifyAuthenticator>
  );
}

export default App;
