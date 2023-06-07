import * as React from 'react';
// External
import { useLocation } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay-ts';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
// utils
import { saveLocalStorage } from 'utils/tokenStorage';
import { config } from 'utils/config';

export function LoginPage() {
  const { register, handleSubmit } = useForm();
  const location = useLocation();

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: object) => {
    try {
      setLoading(true);
      const response = await config.apiClient.post('/account/login', data);
      saveLocalStorage({ token: response.data.data.token });
      setLoading(false);
      const prevLocation = location.state ? location.state.from : '/';
      if (prevLocation) {
        window.location.href = prevLocation.pathname + prevLocation.search;
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      setLoading(false);
      toast.error('Invalid User Credentials!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login Page | GoParts Dashboard</title>
        <meta name="description" content="GoParts Dashboard Login Page" />
      </Helmet>
      <LoadingOverlay active={loading} spinner>
        <div className="bg-[url('/public/rainbow-vortex.svg')] bg-cover h-[calc(100vh-2rem)] flex flex-row items-center justify-center">
          <div className="w-full max-w-md px-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4"
            >
              <div className="flex flex-col justify-center p-4 space-y-2 items-center">
                <img
                  src="/goparts-logo.svg"
                  alt="goparts-logo"
                  className="h-10 self-center"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="email"
                  {...register('email', { required: true })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="******************"
                  {...register('password', { required: true })}
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-segunda-100 flex items-center hover:bg-primera-100 hover:text-segunda-100 text-primera-100 font-bold py-2 px-4 rounded-lg focus:outline-none shadow-md"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="h-8 bg-white flex flex-row justify-center items-center text-center text-gray-500 text-xs">
          <p>&copy;2023 Lica Ventures.</p>
        </div>
      </LoadingOverlay>
    </>
  );
}
