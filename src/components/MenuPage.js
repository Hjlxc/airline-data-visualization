import React from 'react';
import { List } from 'antd';

import { Body, CenteredWrapper } from './styled';

export default ({ visualizers, pageState, setPageState }) => {
  return (
    <Body
      translate={
        visualizers.includes(pageState) ? { x: -1, y: 0 } : { x: 0, y: 0 }
      }
    >
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
