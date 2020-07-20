import React, { useContext } from 'react';
import { Breadcrumb, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { Body, VisualizerHeader } from '../styled';
import { StyleContext, styles } from '../../context/StyleContext';

export default (Component) => (props) => {
  const { setStyle } = useContext(StyleContext);
  const menu = (
    <Menu>
      {Object.keys(styles).map((styleName) => (
        <Menu.Item key={styleName}>
          <a
            onClick={(e) => {
              e.preventDefault();
              setStyle(styleName);
            }}
          >
            {styleName}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );

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
        <Dropdown overlay={menu}>
          <a
            className="ant-dropdown-link"
            style={{ fontSize: '15px' }}
            onClick={(e) => e.preventDefault()}
          >
            Chart Style <DownOutlined />
          </a>
        </Dropdown>
      </VisualizerHeader>
      <Component {...props} />
    </Body>
  );
};
