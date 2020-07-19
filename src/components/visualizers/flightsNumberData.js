import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import VisualizerBase from '../charts/HierarchicalBarChart';
import { VisualizerBody } from '../styled';
import { csvParser } from '../../utils/csvParser';
import {
  mapNestToHierarchyStructure,
  addIndexToHierarchyData,
} from '../../utils/dataParser';

import dataPath from '../../assets/data/flights_2015_sample.csv';

const weekdayMap = {
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '7': 'Sunday',
};

const validateData = (data) =>
  data
    .filter((data) => data['CANCELLED'] !== '1')
    .map((data) => ({ ...data, WEEKDAY: weekdayMap[data.DAY_OF_WEEK] }));

const parseData = (data) => {
  const nestData = d3
    .nest()
    .key((d) => d.WEEKDAY)
    .key((d) => d.AIRLINE)
    .entries(data);

  const hierarchyData = mapNestToHierarchyStructure(
    'Flights Number',
    nestData,
    (obj) => {
      if (!obj.children[0].name) {
        obj.value = obj.children.length;
        delete obj.children;
      } else {
        obj.value = obj.children.reduce((v, child) => v + child.value, 0);
      }
    }
  );
  const parsedData = d3
    .hierarchy(hierarchyData)
    .sort((a, b) => b.value - a.value);

  return addIndexToHierarchyData(parsedData);
};

export default () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      const data = await csvParser(dataPath, validateData, parseData);
      setData(data);
    })();
  }, []);
  return (
    <VisualizerBody>
      <VisualizerBase data={data} />
    </VisualizerBody>
  );
};
