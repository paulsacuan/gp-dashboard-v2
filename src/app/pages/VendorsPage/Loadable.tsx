/**
 * Asynchronously loads the component for VendorsPage
 */

import { lazyLoad } from 'utils/loadable';

export const VendorsPage = lazyLoad(
  () => import('./index'),
  module => module.VendorsPage,
);
