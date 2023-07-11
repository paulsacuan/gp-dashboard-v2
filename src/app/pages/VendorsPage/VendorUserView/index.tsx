import React, { useState, useMemo } from 'react';
// External
import { useForm } from 'react-hook-form';
import LoadingOverlay from 'react-loading-overlay-ts';
import { useLoaderData, useNavigation, useNavigate } from 'react-router-dom';
import { Listbox } from '@headlessui/react';
import { Card } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import axios from 'axios';
// Icons
import {
  PencilSquareIcon,
  ArrowUturnLeftIcon,
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
// utils
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';
import { renderStatus } from 'utils/helper';

export default function VendorUserView() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const statusOptions = [1, 0];

  const { user } = (useLoaderData() as { user }) || {
    user: { data: {} },
  };
  const [status, setStatus] = useState(user.status);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return user;
    }, [user]),
  });

  const onSubmit = async data => {
    try {
      data.status = status;
      setLoading(true);
      const response = await axios.put(`${apiUrl}/v2/account/update`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.token()}`,
        },
      });
      if (response.status === 200) {
        setLoading(false);
        setIsEditMode(false);
        toast.success('Vendor User Updated!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate(`/vendors/${data.id}/users/${user.id}`, { replace: true });
      } else {
        setLoading(false);
        setIsEditMode(false);

        toast.error('Vendor user update failed!', {
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
      setIsEditMode(false);
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
            {isEditMode ? (
              <div className="my-2 flex items-center justify-between">
                <button
                  onClick={e => {
                    e.preventDefault();
                    setIsEditMode(false);
                  }}
                  className="relative inline-block px-4 py-2 font-bold group w-full max-w-[8rem]"
                >
                  <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-red-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="absolute rounded-lg inset-0 w-full h-full bg-red-600 border-2 border-red-600 group-hover:bg-primary-500 group-hover:border-red-600"></span>
                  <span className="relative text-white group-hover:text-red-600 flex items-center justify-center text-xs">
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
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
            ) : (
              <div className="my-2 flex items-center justify-between">
                <button
                  onClick={e => {
                    e.preventDefault();
                    navigate(`/vendors/${user.vendor_id}/users`);
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
                  onClick={e => {
                    e.preventDefault();
                    setIsEditMode(true);
                  }}
                  className="relative inline-block px-4 py-2 font-bold group w-full max-w-[8rem]"
                >
                  <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                  <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Edit
                  </span>
                </button>
              </div>
            )}
          </Card>
        </div>
        <Card className="flex-1 max-w-full p-4 grid grid-cols-4 gap-2 text-xs hover:shadow-md">
          <div className="col-span-4 text-left my-4 relative">
            <p className="text-secondary-500 text-md text-lg font-semibold">
              {isEditMode ? 'Edit User' : 'Vendor user details'}
            </p>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              First Name
            </label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3  leading-tight ${
                errors.first_name
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              } ${
                isEditMode
                  ? 'border-slate-200 bg-slate-50 text-slate-700'
                  : 'border-gray-400 bg-gray-300 text-slate-700'
              }`}
              id="text"
              disabled={!isEditMode}
              name="first_name"
              type="text"
              {...register('first_name', { required: true })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs italic">
                First Name is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Last name
            </label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3  leading-tight ${
                errors.last_name
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              } ${
                isEditMode
                  ? 'border-slate-200 bg-slate-50 text-slate-700'
                  : 'border-gray-400 bg-gray-300 text-slate-700'
              }`}
              id="text"
              name="last_name"
              type="text"
              disabled={!isEditMode}
              {...register('last_name', { required: true })}
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs italic">
                Last name is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">Email</label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3  leading-tight ${
                errors.email
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              } ${
                isEditMode
                  ? 'border-slate-200 bg-slate-50 text-slate-700'
                  : 'border-gray-400 bg-gray-300 text-slate-700'
              }`}
              id="text"
              name="email"
              type="text"
              disabled={!isEditMode}
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">Email is required</p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2 relative">
            <label className="block text-slate-700 font-bold mb-2">
              Status
            </label>
            <Listbox value={status} onChange={setStatus} disabled={!isEditMode}>
              <Listbox.Button
                className={`text-left max-w-sm appearance-none border rounded-md  w-full py-2 px-3  leading-tight focus:outline-none focus-visible:border-secondary-500 ${
                  isEditMode
                    ? 'border-slate-200 bg-slate-50 text-slate-700'
                    : 'border-gray-400 bg-gray-300 text-slate-700'
                }`}
              >
                {renderStatus(status)}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                {statusOptions.map(stat => (
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-5 pr-4 ${
                        active
                          ? 'bg-primary-500 text-secondary-500'
                          : 'text-gray-900'
                      }`
                    }
                    key={stat}
                    value={stat}
                  >
                    {renderStatus(stat)}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
        </Card>
      </LoadingOverlay>
    </form>
  );
}
