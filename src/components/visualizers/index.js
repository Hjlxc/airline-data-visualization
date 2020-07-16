import wrapper from './wrapper';

import visualizer1 from './visualizer1';
import visualizer2 from './visualizer2';

export default {
  visualizer1: wrapper(visualizer1),
  visualizer2: wrapper(visualizer2),
};
