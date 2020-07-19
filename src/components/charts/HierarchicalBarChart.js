import React, { useEffect, useState, useRef, useContext } from 'react';
import * as d3 from 'd3';

import { CenteredWrapper } from '../styled';
import { StyleContext } from '../../context/StyleContext';
import { renderBarChart } from '../../utils/barChart';

// Base hierarchicalBarChart component
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

  // path is an array of index to track the node inside hierarchical tree the current chart display
  // it is useful when we want to re-render the chart due to style change, etc
  // the reason not put in the state is because changing the hierarchy of chart is handled by s3, we don't want
  // to cause re-render when we update the path
  const path = useRef([]);

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

  // update chart when relative state/props changed
  useEffect(
    () => {
      if (!data) return;
      const svg = d3.select(svgEl.current);

      // new style
      const chartStyle = { ...contextStyle, ...style };
      const chartWidth =
        width - chartStyle.margin.left - chartStyle.margin.right;
      const chartHeight =
        height - chartStyle.margin.top - chartStyle.margin.bottom;

      renderBarChart(
        svg,
        data,
        {
          ...chartStyle,
          width: chartWidth,
          height: chartHeight,
        },
        path.current, // path will be updated inside this function
        { animation: true }
      );
    },
    [width, height, contextStyle, style, data]
  );

  return (
    <CenteredWrapper ref={containerEl}>
      <svg ref={svgEl} width={width} height={height} />
    </CenteredWrapper>
  );
};
