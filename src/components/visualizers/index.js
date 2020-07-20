import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import wrapper from './wrapper';
import { StyleProvider } from '../../context/StyleContext';
import flightsNumberData, {
  parser as flightsNumberDataParser,
} from './flightsNumberData';
import flightsDelayData, {
  parser as flightsDelayDataParser,
} from './flightsDelayData';

import dataPath from '../../assets/data/flights_2015_sample.csv';

export const visualizers = {
  'Flights Number Data': {
    Component: wrapper(flightsNumberData),
    parser: flightsNumberDataParser,
  },
  'Flights Delay Data': {
    Component: wrapper(flightsDelayData),
    parser: flightsDelayDataParser,
  },
};

const initialPrasedData = () =>
  Object.keys(visualizers).reduce(
    (state, name) => Object.assign(state, { [name]: null }),
    {}
  );

export default ({ pageState, setPageState }) => {
  const [data, setData] = useState();
  const [parsedData, setParsedData] = useState(initialPrasedData());

  // set data with useEffect to not block the initial render
  useEffect(() => {
    d3.csv(dataPath).then((data) => setData(data));
  }, []);

  // reset the parsed data if source data changed
  useEffect(
    () => {
      setParsedData(initialPrasedData());
    },
    [data]
  );

  // check and update parsed data if data or pageState changed
  useEffect(
    () => {
      // return if in main page or parsed data exist
      if (!visualizers[pageState] || parsedData[pageState]) return;

      setParsedData({
        ...parsedData,
        [pageState]: visualizers[pageState].parser(data),
      });
    },
    [data, pageState, parsedData]
  );

  return (
    <StyleProvider>
      {Object.entries(visualizers).map(([name, { Component }]) => (
        <Component
          key={name}
          translate={pageState === name ? { x: 0, y: 0 } : { x: 1, y: 0 }}
          data={parsedData[pageState]}
          pageState={pageState}
          setPageState={setPageState}
        />
      ))}
    </StyleProvider>
  );
};
