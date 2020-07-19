import * as d3 from 'd3';

export const csvParser = (path, validationFunc, parseFunc) =>
  new Promise(async (resolve, reject) => {
    try {
      let data = await d3.csv(path);
      if (typeof validationFunc === 'function') data = validationFunc(data);
      if (typeof parseFunc === 'function') data = parseFunc(data);
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
