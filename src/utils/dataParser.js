import * as d3 from 'd3';

// calculate sum, sort the node by its value and add index to each node to track its position
export const hierarchyDataParser = (data) =>
  data &&
  d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value)
    .eachAfter(
      (d) =>
        // save the index of each node
        // d.parent.index are used for caching the current traversed node index to calculate the next node's index
        // the parent index will be reset when it travesed to the parent node
        (d.index = d.parent ? (d.parent.index = d.parent.index + 1 || 0) : 0)
    );

// get the node from hierarchical tree from an array of index
export const getHierarchyData = (root, path = []) => {
  let node = root;
  path.forEach((idx) => {
    if (!node.children)
      throw new ReferenceError(`getHierarchyData error! Invalid path ${path}!`);

    node = node.children[idx];
  });
  return node;
};
