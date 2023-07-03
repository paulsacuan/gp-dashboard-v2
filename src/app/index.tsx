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
import { GaragesPage } from './pages/GaragesPage/Loadable';
// Pages/Products
import ProductView from './pages/ProductsPage/ProductView';
import ProductCreate from './pages/ProductsPage/ProductCreate';
import ProductUpdate from './pages/ProductsPage/ProductUpdate';
import ProductCompatibilities from './pages/ProductsPage/ProductCompatibilities';
import ProductWholesalePrice from './pages/ProductsPage/ProductWholesalePrice';
// Pages/Garages
import GarageView from './pages/GaragesPage/GarageView';
import GarageUpdate from './pages/GaragesPage/GarageUpdate';
import GarageBilling from './pages/GaragesPage/GarageBilling';
import GarageUsers from './pages/GaragesPage/GarageUsers';
import GarageUserView from './pages/GaragesPage/GarageUserView';
import GarageUserCreate from './pages/GaragesPage/GarageUserCreate';

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
// Garage Loader
import {
  garageLoader,
  singleGarageLoader,
  garageBillingsLoader,
  garageUsersLoader,
  garageUserLoader,
} from './loaders/GarageLoaders';
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
          <Route
            path="garages"
            loader={garageLoader}
            element={
              <RequireAuth roles={['admin_user', 'sales_user']}>
                <GaragesPage />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="garages/:id"
            loader={singleGarageLoader}
            element={
              <RequireAuth roles={['admin_user', 'sales_user']}>
                <GarageView />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="garages/:id/update"
            loader={singleGarageLoader}
            element={
              <RequireAuth roles={['admin_user', 'sales_user']}>
                <GarageUpdate />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="garages/:id/billing"
            loader={garageBillingsLoader}
            element={
              <RequireAuth roles={['admin_user', 'sales_user']}>
                <GarageBilling />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="garages/:id/users"
            loader={garageUsersLoader}
            element={
              <RequireAuth roles={['admin_user', 'sales_user']}>
                <GarageUsers />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="garages/:id/users/:user_id"
            loader={garageUserLoader}
            element={
              <RequireAuth roles={['admin_user', 'sales_user']}>
                <GarageUserView />
              </RequireAuth>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="garages/:id/users/create"
            loader={singleGarageLoader}
            element={
              <RequireAuth roles={['admin_user', 'sales_user']}>
                <GarageUserCreate />
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
