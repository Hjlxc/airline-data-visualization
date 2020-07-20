import React from 'react';
import * as d3 from 'd3';

import HierarchicalBarChart from '../charts/HierarchicalBarChart';
import { VisualizerBody } from '../styled';
import {
  mapNestToHierarchyStructure,
  addIndexToHierarchyData,
} from '../../utils/dataParser';

const weekdayMap = {
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '7': 'Sunday',
};

export const parser = (data) => {
  if (!data) return null;
  const validateData = data
    .filter((d) => d['CANCELLED'] !== '1')
    .map((d) => ({ ...d, WEEKDAY: weekdayMap[d.DAY_OF_WEEK] }));

  const nestData = d3
    .nest()
    .key((d) => d.WEEKDAY)
    .key((d) => d.AIRLINE)
    .entries(validateData);

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

export default (props) => {
  return (
    <VisualizerBody>
      <HierarchicalBarChart {...props} />
    </VisualizerBody>
  );
};
