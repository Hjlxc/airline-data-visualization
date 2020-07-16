import React, { useState } from 'react';
import { Root, Header } from './components/styled';
import MenuPage from './components/MenuPage';
import VisualizerPages from './components/visualizers';

import './App.css';
import 'antd/dist/antd.css';

function App() {
  const [pageState, setPageState] = useState('menu');

  const BodyComponent = VisualizerPages[pageState] || MenuPage;

  return (
    <Root>
      <Header>Airline Data Visualizer</Header>
      <BodyComponent
        pageState={pageState}
        setPageState={setPageState}
        visualizers={Object.keys(VisualizerPages)}
      />
    </Root>
  );
}

export default App;
