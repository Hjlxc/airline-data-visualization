import wrapper from './wrapper';

import flightsNumberData from './flightsNumberData';
import flightsDelayData from './flightsDelayData';

export default {
  'Flights Number Data': wrapper(flightsNumberData),
  'Flights Delay Data': wrapper(flightsDelayData),
};
