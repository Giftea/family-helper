import React from "react";
import { Button, Modal, Form } from "semantic-ui-react";
import { API, graphqlOperation } from "aws-amplify";
import { createList, updateList } from "../../graphql/mutations";

const ListModal = ({ state, dispatch }) => {
  const saveList = async () => {
    const { title, description } = state;
    const result = await API.graphql(
      graphqlOperation(createList, { input: { title, description } })
    );
    dispatch({ type: "CLOSE_MODAL" });
  };

  const editList = async () => {
    const { title, description, id } = state;
    const result = await API.graphql(
      graphqlOperation(updateList, { input: { id, title, description } })
    );
    dispatch({ type: "CLOSE_MODAL" });
  };

  return (
    <Modal open={state.isModalOpen} dimmer="blurring">
      <Modal.Header>
        {state.modalType === "add" ? "Create " : "Edit "} your list
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            error={true ? false : { content: "Please add a name to your list" }}
            label="List Title"
            placeholder="My List"
            value={state.title}
            onChange={(e) =>
              dispatch({ type: "TITLE_CHANGED", value: e.target.value })
            }
          ></Form.Input>
          <Form.TextArea
            label="Description"
            placeholder="What My List is About "
            value={state.description}
            onChange={(e) =>
              dispatch({ type: "DESCRIPTION_CHANGED", value: e.target.value })
            }
          ></Form.TextArea>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
          Cancel
        </Button>
        <Button
          positive
          onClick={state.modalType === "add" ? saveList : editList}
        >
          {state.modalType === "add" ? "Save " : "Edit "}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ListModal;
