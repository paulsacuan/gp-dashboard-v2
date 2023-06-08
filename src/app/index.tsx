/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
// Styles
import '../styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
// Pages
import { HomePage } from './pages/HomePage/Loadable';
import { LoginPage } from './pages/LoginPage/Loadable';
import { ProductsPage } from './pages/ProductsPage/Loadable';
// Pages/Products
import ProductView from './pages/ProductsPage/ProductView';
import ProductCreate from './pages/ProductsPage/ProductCreate';
import ProductUpdate from './pages/ProductsPage/ProductUpdate';
import ProductCompatibilities from './pages/ProductsPage/ProductCompatibilities';
import ProductWholesalePrice from './pages/ProductsPage/ProductWholesalePrice';
// Pages/Error
import ErrorPage from './pages/ErrorPage';
// Components
import { Layout } from './components/Layout';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
// Auth
import { Auth } from 'utils/auth';
// Product Loaders
import {
  productsLoader,
  productLoader,
  singleProductLoader,
} from './loaders/ProductLoaders';
// Order Loaders
import { orderStatusLoader } from './loaders/OrderLoaders';
// External
import {
  Route,
  Navigate,
  useLocation,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export function App() {
  const RequireAuth = ({
    children,
    roles,
  }: {
    children: JSX.Element;
    roles: any;
  }) => {
    const isLoggedIn = Auth.isLogged();
    const userRoles = Auth.role() || [];
    const location = useLocation();
    const canAccess =
      roles && roles.some((item: string) => userRoles.includes(item));
    if (!isLoggedIn) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else if (isLoggedIn && !canAccess) {
      return <Navigate to="/restricted" />;
    } else {
      return children;
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route
          path="/"
          element={
            <RequireAuth
              roles={[
                'admin_user',
                'product_user',
                'accounting_user',
                'logistics_user',
                'vendor_user',
                'sales_user',
              ]}
            >
              <Layout />
            </RequireAuth>
          }
          errorElement={<ErrorPage />}
        >
          <Route
            path="/"
            loader={orderStatusLoader}
            element={<HomePage />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="products"
            loader={productsLoader}
            element={
              <RequireAuth roles={['admin_user', 'product_user']}>
                <ProductsPage />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="products/create"
            loader={productLoader}
            element={
              <RequireAuth roles={['admin_user', 'product_user']}>
                <ProductCreate />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="products/:slug"
            loader={productLoader}
            element={
              <RequireAuth roles={['admin_user', 'product_user']}>
                <ProductView />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="products/:slug/update"
            loader={productLoader}
            element={
              <RequireAuth roles={['admin_user', 'product_user']}>
                <ProductUpdate />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="products/:slug/compatibilities"
            loader={singleProductLoader}
            element={
              <RequireAuth roles={['admin_user', 'product_user']}>
                <ProductCompatibilities />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="products/:slug/wholesale-price"
            loader={singleProductLoader}
            element={
              <RequireAuth roles={['admin_user', 'product_user']}>
                <ProductWholesalePrice />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>,
    ),
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
