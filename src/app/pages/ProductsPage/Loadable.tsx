/**
 * Asynchronously loads the component for ProductsPage
 */

import { lazyLoad } from 'utils/loadable';

export const ProductsPage = lazyLoad(
  () => import('./index'),
  module => module.ProductsPage,
);
