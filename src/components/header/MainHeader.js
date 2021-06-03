import React from "react";
import { Header, Icon } from "semantic-ui-react";

const MainHeader = () => {
  return (
    <Header as="h2" textAlign="center" className='mt-1 mb-1' icon>
      <Icon name="users" />
      <Header.Content> Family Helper</Header.Content>
    </Header>
  );
};

export default MainHeader;
