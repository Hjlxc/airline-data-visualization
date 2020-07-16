import React from 'react';
import { List } from 'antd';

import { Body, CenteredWrapper } from './styled';

export default ({ visualizers, setPageState }) => {
  return (
    <Body>
      <List
        dataSource={visualizers}
        renderItem={(item) => (
          <List.Item onClick={() => setPageState(item)}>
            <CenteredWrapper>
              <a herf="">{item}</a>
            </CenteredWrapper>
          </List.Item>
        )}
      />
    </Body>
  );
};
