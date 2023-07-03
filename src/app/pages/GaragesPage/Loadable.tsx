/**
 * Asynchronously loads the component for GaragesPage
 */

import { lazyLoad } from 'utils/loadable';

export const GaragesPage = lazyLoad(
  () => import('./index'),
  module => module.GaragesPage,
);
