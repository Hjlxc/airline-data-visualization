import React, { useEffect, useState, useRef, useContext } from 'react';
import * as d3 from 'd3';

import { CenteredWrapper } from '../styled';
import { StyleContext } from '../../context/StyleContext';
import { hierarchyDataParser } from '../../utils/dataParser';
import { renderBarChart } from '../../utils/barChart';

export default ({
  data,
  style = {},
  width: containerWidth,
  height: containerHeight,
}) => {
  const svgEl = useRef(null);
  const containerEl = useRef(null);
  const [width, setWidth] = useState(containerWidth);
  const [height, setHeight] = useState(containerHeight);
  const [root, setRoot] = useState(hierarchyDataParser(data));

  // Read style from StyleContext as default
  const { style: contextStyle } = useContext(StyleContext);

  // initial and update chart width and height state
  // use container width/height if not explicitly provided
  useEffect(
    () => {
      setWidth(containerWidth || containerEl.current.offsetWidth);
      setHeight(containerHeight || containerEl.current.offsetHeight);
    },
    [containerEl, containerWidth, containerHeight]
  );

  // reparse the data when input data changes
  useEffect(
    () => {
      setRoot(hierarchyDataParser(data));
    },
    [data]
  );

  // update chart when relative state/props changed
  // Hierarchical Bar Chart reference: https://observablehq.com/@d3/hierarchical-bar-chart
  useEffect(
    () => {
      if (!root) return;
      const svg = d3.select(svgEl.current);

      // new style
      const chartStyle = { ...contextStyle, ...style };
      const chartWidth =
        width - chartStyle.margin.left - chartStyle.margin.right;
      const chartHeight =
        height - chartStyle.margin.top - chartStyle.margin.bottom;

      renderBarChart(
        svg,
        root,
        {
          ...chartStyle,
          width: chartWidth,
          height: chartHeight,
        },
        {}
      );
    },
    [width, height, contextStyle, style, root]
  );

  return (
    <CenteredWrapper ref={containerEl}>
      <svg ref={svgEl} width={width} height={height} />
    </CenteredWrapper>
  );
};
