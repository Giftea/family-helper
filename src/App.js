import { useEffect, useState } from "react";
import "./App.css";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsConfig from "./aws-exports";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listLists } from "./graphql/queries";

Amplify.configure(awsConfig);

function App() {
  const [list, setList] = useState([]);
  async function fetchList() {
    const {data} = await API.graphql(graphqlOperation(listLists));
    setList(data.listLists.items)
  }
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <AmplifyAuthenticator>
      <div className="App">
        <h1>amp</h1>
        <ul>
          {list.map(item => <li key={item.id}>{item.title}</li>)}
        </ul>
        <AmplifySignOut />
      </div>
    </AmplifyAuthenticator>
  );
}

export default App;
