// add index to each node inside hierarchy tree
export const addIndexToHierarchyData = (hierarchyData) =>
  hierarchyData.eachAfter(
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
    if (!node.children || !node.children[idx])
      throw new ReferenceError(`getHierarchyData error! Invalid path ${path}!`);

    node = node.children[idx];
  });
  return node;
};

// map the data generate from d3.nest to hierarchyStructure
export const mapNestToHierarchyStructure = (name, nestData, mapping) => {
  function recursiveMap(targetObj, sourceArray) {
    // recursive loop all the nest structure from nest data, and convert it into hierarchy structure
    targetObj.children = sourceArray.map((source) => {
      // due to the strcture differents, the leaf node will end up with different results
      if (!source.values) return { name: source.key, data: source };
      return recursiveMap({ name: source.key }, source.values);
    });
    // mapping function will loop though all the nodes, except leaf nodes due to the structure
    // use it to convert the data exact to hierarchy structure here
    typeof mapping === 'function' && mapping(targetObj);
    return targetObj;
  }

  return recursiveMap({ name }, nestData);
};
