import * as d3 from 'd3';

import { getHierarchyData } from './dataParser';
// Hierarchical Bar Chart reference: https://observablehq.com/@d3/hierarchical-bar-chart

export const renderBarChart = (svg, root, style, path, options = {}) => {
  const { animation, initialAnimation } = options;
  let initial = true;

  // clean previously chart render
  svg.selectAll('*').remove();

  // initial variables
  const color = d3.scaleOrdinal([true, false], style.color);
  const scale = d3
    .scaleLinear()
    .range([style.margin.left, style.width + style.margin.left]);
  const yAxis = (g) =>
    g
      .attr('class', 'y-axis')
      .attr('transform', `translate(${style.margin.left + 0.5},0)`)
      .call((g) =>
        g
          .append('line')
          .attr('stroke', 'currentColor')
          .attr('y1', style.margin.top)
          .attr('y2', style.height)
      );

  const xAxis = (g) =>
    g
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${style.margin.top})`)
      .call(d3.axisTop(scale).ticks(style.width / 80, 's'))
      .call((g) =>
        (g.selection ? g.selection() : g).select('.domain').remove()
      );

  // get child bar tranlsation related to current parent chart
  // pass index will return child bar translation in the same row
  const getChildrenBarTranslate = (index) => {
    let value = 0;
    return (d, i) => {
      const idx = index !== undefined ? index : i;
      const t = `translate(${scale(value) - scale(0)},${style.maxBarSize *
        idx})`;
      value += d.value;
      return t;
    };
  };

  function up(svg, d) {
    if (!d.parent || !svg.selectAll('.exit').empty()) return;

    // Rebind the current node to the background.
    svg.select('.background').datum(d.parent);

    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll('.enter').attr('class', 'exit');

    // Update the x-scale domain.
    scale.domain([0, d3.max(d.parent.children, (d) => d.value)]);

    // Enter the new bars for the clicked-on data's parent.
    const enter = bar(svg, down, d.parent, '.exit').attr('fill-opacity', 0);

    if (animation) {
      const transition1 = svg.transition().duration(style.duration);
      const transition2 = transition1.transition();
      // Update the x-axis.
      svg
        .selectAll('.x-axis')
        .transition(transition1)
        .call(xAxis);

      // translation expended children bar back to new translation with two animations
      exit
        .selectAll('g')
        .transition(transition1)
        .attr('transform', getChildrenBarTranslate())
        .transition(transition2)
        .attr('transform', getChildrenBarTranslate(d.index));

      // Transition exiting rects to the new scale and fade to parent color.
      exit
        .selectAll('rect')
        .transition(transition1)
        .attr('width', (d) => scale(d.value) - scale(0))
        .attr('fill', color(true));

      // Transition exiting text to fade out.
      // Remove exiting nodes.
      exit
        .transition(transition2)
        .attr('fill-opacity', 0)
        .remove();

      enter
        .selectAll('g')
        .attr('transform', (d, i) => `translate(0,${style.maxBarSize * i})`);

      // Transition entering bars to fade in over the full duration.
      enter.transition(transition2).attr('fill-opacity', 1);

      // Color the bars as appropriate.
      // Exiting nodes will obscure the parent bar, so hide it.
      // Transition entering rects to the new x-scale.
      // When the entering parent rect is done, make it visible!
      enter
        .selectAll('rect')
        .attr('fill', (d) => color(!!d.children))
        .attr('fill-opacity', (p) => (p === d ? 0 : null))
        .transition(transition2)
        .attr('width', (d) => scale(d.value) - scale(0))
        .on('end', function(p) {
          d3.select(this).attr('fill-opacity', 1);
        });
    } else {
      // update everything to its final state without animation
      svg.selectAll('.x-axis').call(xAxis);
      exit.remove();
      enter.attr('fill-opacity', 1);
      enter
        .selectAll('g')
        .attr('transform', (d, i) => `translate(0, ${style.maxBarSize * i})`);
      enter
        .selectAll('rect')
        .attr('fill-opacity', 1)
        .attr('fill', (d) => color(!!d.children))
        .attr('width', (d) => scale(d.value) - scale(0));
    }
    path.pop();
  }

  // expend the nested children chart
  function down(svg, d) {
    if (!d.children || d3.active(svg.node())) return;
    // Rebind the current node to the background.
    svg.select('.background').datum(d);

    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll('.enter').attr('class', 'exit');

    // Entering nodes immediately obscure the clicked-on bar, so hide it.
    exit.selectAll('rect').attr('fill-opacity', (p) => {
      return p === d ? 0 : null;
    });

    // new bars that is going to displayed
    const enter = bar(svg, down, d, '.y-axis');

    // run animation in the followint two situation:
    // 1. first time call down function with initialAnimation state as true
    // 2. the rest time call down function with animation state as true
    if ((!initial && animation) || (initial && initialAnimation)) {
      // Define two sequenced transitions.
      const transition1 = svg.transition().duration(style.duration);
      const transition2 = transition1.transition();

      // fade out old bars and remove after transition
      exit
        .transition(transition1)
        .attr('fill-opacity', 0)
        .remove();

      // fade in new bars
      enter
        .attr('fill-opacity', 0)
        .transition(transition1)
        .attr('fill-opacity', 1);

      // Transition and separate selected selected bar with its children
      enter
        .selectAll('g')
        .attr('transform', getChildrenBarTranslate(d.index))
        .transition(transition1)
        .attr('transform', getChildrenBarTranslate());

      // Update the x-scale domain.
      scale.domain([0, d3.max(d.children, (d) => d.value)]);

      // expend the children bar to the new x-scale
      enter
        .selectAll('g')
        .transition(transition2)
        .attr('transform', (d, i) => `translate(0,${style.maxBarSize * i})`);

      // Color the bars as parents; they will fade to children if appropriate.
      enter
        .selectAll('rect')
        .attr('fill', color(true))
        .attr('fill-opacity', 1)
        .transition(transition2)
        .attr('fill', (d) => color(!!d.children))
        .attr('width', (d) => scale(d.value) - scale(0));

      // animate x-axis
      svg
        .selectAll('.x-axis')
        .transition(transition2)
        .call(xAxis);
    } else {
      // update everything to its final state directly without animation
      exit.remove();
      scale.domain([0, d3.max(d.children, (d) => d.value)]);
      svg.selectAll('.x-axis').call(xAxis);

      enter.attr('fill-opacity', 1);
      enter
        .selectAll('g')
        .attr('transform', (d, i) => `translate(0,${style.maxBarSize * i})`);
      enter
        .selectAll('rect')
        .attr('fill-opacity', 1)
        .attr('fill', (d) => color(!!d.children))
        .attr('width', (d) => scale(d.value) - scale(0));
    }
    !initial && path.push(d.index);

    initial = false; // set initial flag to false after calling down function
  }

  function bar(svg, down, d, selector) {
    const g = svg
      .insert('g', selector)
      .attr('class', 'enter')
      .attr(
        'transform',
        `translate(0,${style.margin.top + style.maxBarSize * style.barPadding})`
      )
      .attr('text-anchor', 'end')
      .style('font', '10px sans-serif');

    const bar = g
      .selectAll('g')
      .data(d.children)
      .join('g')
      .attr('cursor', (d) => (!d.children ? null : 'pointer'))
      .on('click', (d) => down(svg, d));

    bar
      .append('text')
      .attr('x', style.margin.left - 6)
      .attr('y', (style.maxBarSize * (1 - style.barPadding)) / 2)
      .attr('dy', '.35em')
      .text((d) => d.data.name);

    bar
      .append('rect')
      .attr('x', scale(0))
      .attr('width', (d) => scale(d.value) - scale(0))
      .attr('height', style.maxBarSize * (1 - style.barPadding));

    return g;
  }
  const renderNode = getHierarchyData(root, path);
  scale.domain([0, renderNode.value]);

  svg
    .append('rect')
    .attr('class', 'background')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', style.width)
    .attr('height', style.height)
    .attr('transform', `translate(${style.margin.left},${style.margin.top})`)
    .attr('cursor', 'pointer')
    .on('click', (d) => up(svg, d));

  svg.append('g').call(xAxis);

  svg.append('g').call(yAxis);

  down(svg, renderNode);

  return svg.node();
};
