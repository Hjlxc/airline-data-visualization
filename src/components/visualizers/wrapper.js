import React from 'react';
import { Breadcrumb } from 'antd';

import { Body, VisualizerHeader } from '../styled';
import { StyleProvider } from '../../context/StyleContext';

export default (Component) => (props) => {
  return (
    <Body translate={props.translate}>
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
      <StyleProvider>
        <Component {...props} />
      </StyleProvider>
    </Body>
  );
};
