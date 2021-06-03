import React from "react";
import List from "./List";
import { Item } from "semantic-ui-react";

const Lists = ({ list,dispatch }) => {
  return (
    <div>
      <Item.Group>
        {list.map((item) => (
          <List key={item.id} {...item} dispatch={dispatch}>
            {item.title}
          </List>
        ))}
      </Item.Group>
    </div>
  );
};

export default Lists;
