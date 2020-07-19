import assert from 'assert';
import { nest, hierarchy } from 'd3';

import {
  addIndexToHierarchyData,
  getHierarchyData,
  mapNestToHierarchyStructure,
} from '../utils/dataParser';

const johnData = { name: 'John', age: 30, gender: 'male', income: 75000 };
const willData = { name: 'Will', age: 30, gender: 'male', income: 90000 };
const davidData = { name: 'David', age: 28, gender: 'male', income: 50000 };
const kellyData = { name: 'Kelly', age: 45, gender: 'female', income: 120000 };
const sourceData = [johnData, willData, davidData, kellyData];

const nestData = nest()
  .key((d) => d.gender)
  .key((d) => d.age)
  .key((d) => d.name)
  .entries(sourceData);

const removeLeafChildrenAndSum = (node) => {
  // function to delete the leaf node children and calculate sum
  if (!node.children[0].name) {
    node.value = node.children[0].data.income;
    delete node.children;
  } else {
    node.value = node.children.reduce((v, child) => v + child.value, 0);
  }
};

const hierarchyObj = mapNestToHierarchyStructure(
  'Income Data',
  nestData,
  removeLeafChildrenAndSum
);
const hierarchyData = hierarchy(hierarchyObj);

describe('Test mapNestToHierarchyStructure', () => {
  describe('Test without mapping function', () => {
    it('Should return a hierarchy structured object except leaf node', () => {
      assert.deepEqual(mapNestToHierarchyStructure('Income Data', nestData), {
        name: 'Income Data',
        children: [
          {
            name: 'male',
            children: [
              {
                name: '30',
                children: [
                  {
                    name: 'John',
                    children: [{ name: undefined, data: johnData }],
                  },

                  {
                    name: 'Will',
                    children: [{ name: undefined, data: willData }],
                  },
                ],
              },
              {
                name: '28',
                children: [
                  {
                    name: 'David',
                    children: [{ name: undefined, data: davidData }],
                  },
                ],
              },
            ],
          },
          {
            name: 'female',
            children: [
              {
                name: '45',
                children: [
                  {
                    name: 'Kelly',
                    children: [{ name: undefined, data: kellyData }],
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });

  describe('Test with mapping function', () => {
    it('Should return a hierarchy structured object with sum', () => {
      assert.deepEqual(hierarchyObj, {
        name: 'Income Data',
        children: [
          {
            name: 'male',
            children: [
              {
                name: '30',
                children: [
                  { name: 'John', value: 75000 },
                  { name: 'Will', value: 90000 },
                ],
                value: 165000,
              },
              {
                name: '28',
                children: [{ name: 'David', value: 50000 }],
                value: 50000,
              },
            ],
            value: 215000,
          },
          {
            name: 'female',
            children: [
              {
                name: '45',
                children: [{ name: 'Kelly', value: 120000 }],
                value: 120000,
              },
            ],
            value: 120000,
          },
        ],
        value: 335000,
      });
    });
  });
});

describe('Test getHierarchyData', () => {
  describe('Test with invalid path', () => {
    it('Should throw ReferenceError', () => {
      const path = [1, 3];
      expect(() => {
        getHierarchyData(hierarchyData, path);
      }).toThrow(`getHierarchyData error! Invalid path ${path}!`);
    });
  });
  describe('Test without passing pass', () => {
    it('Should return input root', () => {
      assert.deepEqual(getHierarchyData(hierarchyData), hierarchyData);
    });
  });
  describe('Test with valid path', () => {
    it('Should return specific node defined by path', () => {
      assert.deepEqual(getHierarchyData(hierarchyData, [0, 1, 0]).data, {
        name: 'David',
        value: 50000,
      });
    });
  });
});

describe('Test addIndexToHierarchyData', () => {
  const testPath = [[], [0], [1], [0, 1]];
  it('hierarchyData should not contain index before apply', () => {
    testPath.forEach((path) =>
      assert.equal(getHierarchyData(hierarchyData, path).index, undefined)
    );
  });
  it('HierarchyData should contain index after apply', () => {
    addIndexToHierarchyData(hierarchyData);
    testPath.forEach((path) =>
      assert.equal(
        getHierarchyData(hierarchyData, path).index,
        path.length ? path[path.length - 1] : 0
      )
    );
  });
});
