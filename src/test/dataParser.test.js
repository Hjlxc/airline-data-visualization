import assert from 'assert';

import {
  addIndexToHierarchyData,
  getHierarchyData,
  mapNestToHierarchyStructure,
} from '../utils/dataParser';

import getTestData from './test.data';

const testData = getTestData();

describe('Test mapNestToHierarchyStructure', () => {
  describe('Test without mapping function', () => {
    it('Should return a hierarchy structured object except leaf node', () => {
      assert.deepEqual(
        mapNestToHierarchyStructure('Income Data', testData.nestData),
        testData.nestToHierarchyObj
      );
    });
  });

  describe('Test with mapping function', () => {
    it('Should return a hierarchy structured object with sum', () => {
      assert.deepEqual(
        mapNestToHierarchyStructure(
          'Income Data',
          testData.nestData,
          testData.removeLeafChildrenAndSum
        ),
        testData.parsedAndSummedHierarchyObj
      );
    });
  });
});

describe('Test getHierarchyData', () => {
  describe('Test with invalid path', () => {
    it('Should throw ReferenceError', () => {
      const path = [1, 3];
      expect(() => {
        getHierarchyData(testData.hierarchyData, path);
      }).toThrow(`getHierarchyData error! Invalid path ${path}!`);
    });
  });
  describe('Test without passing pass', () => {
    it('Should return input root', () => {
      assert.deepEqual(
        getHierarchyData(testData.hierarchyData),
        testData.hierarchyData
      );
    });
  });
  describe('Test with valid path', () => {
    it('Should return specific node defined by path', () => {
      assert.deepEqual(
        getHierarchyData(testData.hierarchyData, [0, 1, 0]).data,
        {
          name: 'David',
          value: 50000,
        }
      );
    });
  });
});

describe('Test addIndexToHierarchyData', () => {
  const testPath = [[], [0], [1], [0, 1]];
  it('hierarchyData should not contain index before apply', () => {
    testPath.forEach((path) =>
      assert.equal(
        getHierarchyData(testData.hierarchyData, path).index,
        undefined
      )
    );
  });
  it('HierarchyData should contain index after apply', () => {
    const dataCopy = testData.hierarchyData.copy();
    addIndexToHierarchyData(dataCopy);
    testPath.forEach((path) =>
      assert.equal(
        getHierarchyData(dataCopy, path).index,
        path.length ? path[path.length - 1] : 0
      )
    );
  });
});
