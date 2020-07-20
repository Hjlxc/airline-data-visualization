import React, { useState } from 'react';
import { Root, Header } from './components/styled';
import MenuPage from './components/MenuPage';
import VisualizerPages, { visualizers } from './components/visualizers';
import './App.css';
import 'antd/dist/antd.css';

function App() {
  const [pageState, setPageState] = useState('menu');
  return (
    <Root>
      <Header>Airline Data Visualizer</Header>
      <MenuPage
        pageState={pageState}
        setPageState={setPageState}
        visualizers={Object.keys(visualizers)}
      />
      <VisualizerPages pageState={pageState} setPageState={setPageState} />
    </Root>
  );
}

export default App;
