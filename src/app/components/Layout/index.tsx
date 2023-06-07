import React, { useState, Fragment } from 'react';
// Routes
import routes from 'routes';
// utils
import { Auth } from 'utils/auth';
import { removeLocalStorage } from 'utils/tokenStorage';
// External
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Transition, Dialog } from '@headlessui/react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
// import LoadingOverlay from 'react-loading-overlay-ts';
// Icons
import {
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export function Layout(props: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathLength = location.pathname.length;
  const removeFirstSlash = location.pathname.slice(1, pathLength);
  const indexOfSecondSlash = removeFirstSlash.indexOf('/');
  const pathName =
    indexOfSecondSlash !== -1
      ? location.pathname.slice(0, indexOfSecondSlash + 1)
      : location.pathname;

  // const navigation = useNavigation();
  const { i18n } = useTranslation();

  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleLogout = () => {
    removeLocalStorage();
    navigate('/login');
  };

  const getRole = role => {
    let userRole = '';
    switch (role) {
      case 'admin_user':
        userRole = 'Admin User';
        break;
      case 'products_user':
        userRole = 'Product User';
        break;
      case 'vendor_user':
        userRole = 'Vendor User';
        break;
      case 'sales_user':
        userRole = 'Sales User';
        break;
      case 'product_user':
        userRole = 'Product User';
        break;
      case 'logistics_user':
        userRole = 'Logistics User';
        break;
      default:
        userRole = 'Hello User';
        break;
    }
    return userRole;
  };

  const getRouteName = (routesArray, pathname) => {
    const currentRoute = routesArray.filter(route => route.path === pathname);
    const prop = currentRoute[0];
    return (
      <p className="flex items-center">
        <prop.Icon className="h-5 w-5 mr-2 text-segunda-100 stroke-2" />
        {prop.name}
      </p>
    );
  };
  const getRoutes = routes =>
    routes.map((prop: any, key: any) => {
      if (prop.roles.includes(Auth.role()) && prop.hidden === false) {
        return (
          <li
            key={key}
            className={`m-1 p-2 rounded-lg ${
              pathName === prop.path
                ? 'bg-white font-bold text-primera-100'
                : 'text-white'
            }`}
          >
            <Link to={prop.path} className="flex items-center">
              <prop.Icon className="h-5 w-5 mr-2 text-segunda-100 stroke-2" />
              {prop.name}
            </Link>
          </li>
        );
      }
      return null;
    });

  return (
    <>
      <Helmet
        titleTemplate="%s - GoParts Dashboard"
        defaultTitle="GoParts Dashboard"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="GoParts Dashboard" />
      </Helmet>
      <div className="h-screen w-screen p-0 m-0 overflow-y-hidden">
        <div className="flex flex-row h-screen">
          {/* sidebar */}
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              onClose={closeModal}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-200 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-200 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex flex-col lg:hidden z-10 lg:flex-col w-4/5 bg-primera-100 h-screen content-center">
                  <button
                    type="button"
                    value="Close Sidebar"
                    onClick={closeModal}
                    className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  <div className="bg-white flex flex-row justify-center pt-8 pb-4">
                    <img
                      src="/goparts-logo.svg"
                      alt="goparts-logo"
                      className="h-8 self-center"
                    />
                  </div>
                  <nav className="flex-1 overflow-y-auto mb-auto">
                    <ul className="p-4">{getRoutes(routes)}</ul>
                  </nav>
                  <div className="h-10 bg-segunda-100 flex flex-row justify-between items-center">
                    <p className="font-semibold text-primera-100 text-xs ml-2 flex items-center">
                      <UserCircleIcon className="h-5 w-5 mr-1" />
                      {getRole(Auth.role())}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="flex flex-row hover:cursor-pointer items-center font-semibold text-primera-100 text-xs"
                    >
                      Logout
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-primera-100 stroke-2" />
                    </button>
                  </div>
                </div>
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>
            </Dialog>
          </Transition>
          <div className="hidden lg:flex lg:flex-col w-1/5 bg-primera-100 h-screen overscroll-y-auto content-center">
            <div className="bg-white flex flex-row justify-center p-4">
              <img
                src="/goparts-logo.svg"
                alt="goparts-logo"
                className="h-8 self-center"
              />
            </div>
            <nav className="flex-1 overflow-y-auto mb-auto">
              <ul className="p-4">{getRoutes(routes)}</ul>
            </nav>
            <div className="h-10 bg-segunda-100 flex flex-row justify-between items-center">
              <p className="font-semibold text-primera-100 text-xs ml-2 flex items-center">
                <UserCircleIcon className="h-5 w-5 mr-1" />
                {getRole(Auth.role())}
              </p>
              <button
                onClick={handleLogout}
                className="flex flex-row items-center font-semibold text-primera-100 text-xs"
              >
                Logout
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-primera-100 stroke-2" />
              </button>
            </div>
          </div>
          {/* content */}
          <div className={`w-full lg:w-4/5 h-screen overflow-auto`}>
            {/* <LoadingOverlay
              active={navigation.state === 'loading'}
              spinner
              className="h-screen"
            > */}
            <div className="lg:hidden flex bg-primera-100 flex-row-reverse p-2">
              <button
                onClick={openModal}
                className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-white hover:border-white"
              >
                <svg
                  className="fill-current h-3 w-3"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
              <span className="mr-auto text-white font-semibold">
                {getRouteName(routes, pathName)}
              </span>
            </div>
            <div className="hidden lg:flex bg-primera-100 flex-row items-center justify-center p-2 h-12">
              <span className="text-center text-white font-semibold">
                {getRouteName(routes, pathName)}
              </span>
            </div>
            <Outlet />
            {/* </LoadingOverlay> */}
          </div>
        </div>
      </div>
    </>
  );
}
