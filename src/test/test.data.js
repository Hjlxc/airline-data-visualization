import { nest, hierarchy } from 'd3';

export default () => {
  const johnData = { name: 'John', age: 30, gender: 'male', income: 75000 };
  const willData = { name: 'Will', age: 30, gender: 'male', income: 90000 };
  const davidData = { name: 'David', age: 28, gender: 'male', income: 50000 };
  const kellyData = {
    name: 'Kelly',
    age: 45,
    gender: 'female',
    income: 120000,
  };
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

  const nestToHierarchyObj = {
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
  };
  const parsedAndSummedHierarchyObj = {
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
  };

  return {
    nestData,
    hierarchyData: hierarchy(parsedAndSummedHierarchyObj),
    nestToHierarchyObj,
    parsedAndSummedHierarchyObj,
    removeLeafChildrenAndSum,
  };
};
