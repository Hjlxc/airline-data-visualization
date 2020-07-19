import * as d3 from 'd3';
import { renderBarChart } from '../utils/barChart';
import getTestData from './test.data';
import { getHierarchyData } from '../utils/dataParser';

describe('Test HierarchicalBarChart', () => {
  let data;
  let svg;
  const style = {
    width: 500,
    height: 500,
    margin: { top: 20, right: 40, bottom: 20, left: 40 },
    color: ['steelblue', '#ccc'],
    duration: 750,
    maxBarSize: 30,
    barPadding: 0.15,
  };
  const path = [];
  beforeAll(() => {
    data = getTestData().hierarchyData;
    svg = d3
      .create('svg')
      .attr('width', style.width + style.margin.left + style.margin.right)
      .attr('height', style.height + style.margin.top + style.margin.bottom);
    renderBarChart(svg, data, style, path);
  });

  describe('Test Bar Creation', () => {
    it('svg created', () => {
      expect(d3.select(svg)).not.toBeNull();
    });

    it('x axis correct created', () => {
      const xAxis = svg.selectAll('.x-axis');
      expect(xAxis).not.toBeNull();
      expect(xAxis.attr('transform')).toBe(`translate(0,${style.margin.top})`);
    });

    it('y axis correct created', () => {
      const yAxis = svg.selectAll('.y-axis');
      expect(yAxis).not.toBeNull();
      expect(yAxis.attr('transform')).toBe(
        `translate(${style.margin.left + 0.5},0)`
      );
    });

    it('background rect correct created', () => {
      const background = svg.selectAll('.background');
      expect(background).not.toBeNull();
      expect(background.attr('width')).toBe(String(style.width));
      expect(background.attr('height')).toBe(String(style.height));
      expect(background.attr('transform')).toBe(
        `translate(${style.margin.left},${style.margin.top})`
      );
      expect(background.attr('cursor')).toBe('pointer');
      expect(background.attr('fill')).toBe('none');
    });

    it('bar correct created', () => {
      const bars = svg.select('.enter').selectAll('g');
      const chartData = getHierarchyData(data, path);
      expect(bars.size()).toBe(chartData.children.length);

      // check if each bar is correctly created
      const scale = d3
        .scaleLinear()
        .range([style.margin.left, style.width + style.margin.left])
        .domain([0, d3.max(chartData.children, (d) => d.value)]);

      bars.each(function(d, i) {
        const bar = d3.select(this);
        // not using arracy function due to need to access this inside the function
        expect(bar.attr('transform')).toBe(
          `translate(0,${style.maxBarSize * i})`
        );
        expect(bar.select('text').attr('x')).toBe(
          String(style.margin.left - 6)
        );
        expect(bar.select('text').attr('y')).toBe(
          String((style.maxBarSize * (1 - style.barPadding)) / 2)
        );
        expect(bar.select('rect').attr('x')).toBe(String(style.margin.left));
        expect(bar.select('rect').attr('x')).toBe(String(scale(0)));
        expect(bar.select('rect').attr('width')).toBe(
          String(scale(d.value) - scale(0))
        );
        expect(bar.select('rect').attr('height')).toBe(
          String(style.maxBarSize * (1 - style.barPadding))
        );
      });
    });
  });
});
