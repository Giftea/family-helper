import React from "react";
import { Item, Icon } from "semantic-ui-react";

const List = (props) => {
  const { title, description, createdAt, dispatch, id } = props;
  return (
    <Item>
      {/* <Item.Image></Item.Image> */}
      <Item.Content>
        <Item.Header>{title}</Item.Header>
        <Item.Description>{description}</Item.Description>
        <Item.Extra>
          {new Date(createdAt).toDateString()}
          <Icon
            name="edit"
            className="ml-3"
            onClick={() => dispatch({ type: "EDIT_LIST", value: props })}
          />
          <Icon
            name="trash"
            className="ml-3"
            onClick={() => dispatch({ type: "DELETE_LIST", value: id })}
          />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default List;
