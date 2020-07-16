import React from 'react';
import { Breadcrumb } from 'antd';

import { Body, VisualizerHeader } from '../styled';

export default (Component) => (props) => {
  return (
    <Body>
      <VisualizerHeader>
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={() => {
              props.setPageState('menu');
            }}
          >
            <a herf="">Menu</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{props.pageState}</Breadcrumb.Item>
        </Breadcrumb>
      </VisualizerHeader>
      <Component {...props} />
    </Body>
  );
};
