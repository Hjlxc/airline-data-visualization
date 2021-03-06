import React from 'react';
import * as d3 from 'd3';

import HierarchicalBarChart from '../charts/HierarchicalBarChart';
import { VisualizerBody } from '../styled';
import {
  mapNestToHierarchyStructure,
  addIndexToHierarchyData,
} from '../../utils/dataParser';

const monthMap = {
  '1': 'Jan',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Apr',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Aug',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

export const parser = (data) => {
  if (!data) return null;
  const validateData = data
    .filter(
      (data) =>
        data['CANCELLED'] !== '1' &&
        !Number.isNaN(
          Number(data.DEPARTURE_DELAY) && Number(data.DEPARTURE_DELAY) > 0
        )
    )
    .map((data) => ({ ...data, MONTH: monthMap[data.MONTH] }));

  // group the data by airline/month/day
  const nestData = d3
    .nest()
    .key((d) => d.AIRLINE)
    .key((d) => d.MONTH)
    .key((d) => d.DAY)
    .entries(validateData);
  const hierarchyData = mapNestToHierarchyStructure(
    'Delay Data',
    nestData,
    (obj) => {
      // due to the difference between nest and hierarchy structure
      // the leaf obj has a different pattern than the other (name as undefined)
      // The following code will calcualte the necessary and delete the leaf obj to make sure it match the hierarchy structure
      if (!obj.children[0].name) {
        obj.count = obj.children.length;
        obj.total = obj.children.reduce(
          (v, child) => v + Number(child.data.DEPARTURE_DELAY),
          0
        );
        delete obj.children;
      } else {
        obj.count = obj.children.reduce((v, child) => v + child.count, 0);
        obj.total = obj.children.reduce((v, child) => v + child.total, 0);
      }
      obj.value = obj.total / obj.count; // save the average data
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
