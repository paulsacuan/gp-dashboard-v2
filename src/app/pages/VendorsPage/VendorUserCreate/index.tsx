import React, { useState } from 'react';
// External
import { useForm } from 'react-hook-form';
import LoadingOverlay from 'react-loading-overlay-ts';
import { useLoaderData, useNavigation, useNavigate } from 'react-router-dom';
import { Card } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import axios from 'axios';
// Icons
import { ArrowUturnLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
// utils
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

export default function VendorUserCreate() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { vendor } = (useLoaderData() as { vendor }) || {
    vendor: { data: {} },
  };

  interface InputTypes {
    email: string;
    password: string;
    password_confirmation: string;
    firstname: string;
    lastname: string;
    user_type: string;
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InputTypes>();

  const onSubmit = async data => {
    try {
      data.user_type = 'vendor_user';
      data.vendor_id = vendor.id;
      setLoading(true);
      const response = await axios.post(`${apiUrl}/v2/account/register`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.token()}`,
        },
      });
      if (response.status === 200) {
        setLoading(false);
        toast.success('Vendor User Created!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate(`/vendors/${vendor.id}/users/${response.data.data.user.id}`, {
          replace: true,
        });
      } else {
        setLoading(false);
        toast.error('Vendor user failed to create!', {
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
    } catch (error) {
      setLoading(false);
      toast.error('Something unexpected happened!', {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <LoadingOverlay
        active={navigation.state === 'loading' || loading === true}
        className="m-4 p-4 flex flex-col md:flex-row gap-2"
      >
        <div className="w-full md:w-2/6 md:order-1 grow-0 space-y-2">
          <Card className="hover:shadow-md p-4">
            <div className="text-primary-400 mb-4 tracking-wide text-center underline decoration-secondary-500 underline-offset-4">
              {vendor.name}
            </div>
            <div className="my-2 flex items-center justify-between">
              <button
                onClick={e => {
                  e.preventDefault();
                  navigate(`/vendors/${vendor.id}/users`);
                }}
                className="relative inline-block px-4 py-2 font-bold group w-full max-w-[8rem]"
              >
                <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-secondary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute rounded-lg inset-0 w-full h-full bg-secondary-500 border-2 border-secondary-500 group-hover:bg-primary-500 group-hover:border-secondary-500"></span>
                <span className="relative text-primary-500 group-hover:text-secondary-500 flex items-center justify-center text-xs">
                  <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
                  Back
                </span>
              </button>
              <button
                type="submit"
                className="relative inline-block px-4 py-2 font-bold group w-full max-w-[8rem]"
              >
                <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Save
                </span>
              </button>
            </div>
          </Card>
        </div>
        <Card className="flex-1 max-w-full p-4 grid grid-cols-4 gap-2 text-xs hover:shadow-md">
          <div className="col-span-4 text-left my-4 relative">
            <p className="text-secondary-500 text-md text-lg font-semibold">
              Vendor User Details
            </p>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              First Name
            </label>
            <input
              className={`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.firstname
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="firstname"
              type="text"
              {...register('firstname', {
                required: 'First Name is required',
              })}
            />
            {errors.firstname && (
              <p className="text-red-500 text-xs italic">
                {errors.firstname && errors.firstname.message}
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Last Name
            </label>
            <input
              className={`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.lastname
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="lastname"
              type="text"
              {...register('lastname', { required: 'Last Name is required' })}
            />
            {errors.lastname && (
              <p className="text-red-500 text-xs italic">
                {errors.lastname && errors.lastname.message}
              </p>
            )}
          </div>
          <div className="col-span-4 mb-2">
            <label className="block text-slate-700 font-bold mb-2">Email</label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.email
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email && errors.email.message}
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Password
            </label>
            <input
              className={`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.password
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="password"
              type="password"
              {...register('password', {
                required: 'Password is required (min 6 characters)',
                minLength: 6,
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password && errors.password.type === 'required'
                  ? 'Password is required'
                  : 'Password must be at least 6 characters long'}
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Confirm Password
            </label>
            <input
              className={`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.password_confirmation
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="password_confirmation"
              type="password"
              {...register('password_confirmation', {
                required: true,
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return 'Your passwords do no match';
                  }
                },
              })}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs italic">
                {errors.password_confirmation &&
                errors.password_confirmation.type === 'required'
                  ? 'Password Confirmation is required'
                  : errors.password_confirmation.message}
              </p>
            )}
          </div>
        </Card>
      </LoadingOverlay>
    </form>
  );
}
