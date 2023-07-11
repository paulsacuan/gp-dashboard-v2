import React, { useState } from 'react';
// External
import { Combobox } from '@headlessui/react';
import { useNavigate, useNavigation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
import axios from 'axios';
// utils
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';
import { provinces } from 'utils/locations';
// Icons
import {
  PlusCircleIcon,
  ArrowUturnLeftIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/solid';

export default function VendorCreate() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [provinceQuery, setProvinceQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(() => provinces[0]);

  type BasicModel = {
    id: number;
    name: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    try {
      data.province = selectedLocation.name;
      setLoading(true);
      const response = await axios.post(`${apiUrl}/v2/vendors`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.token()}`,
        },
      });
      if (response.status === 200) {
        setLoading(false);
        toast.success('Vendor Created!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate(`/vendors/${response.data.data.id}`, { replace: true });
      } else {
        setLoading(false);
        toast.error('Failed to create new vendor!', {
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

  const handleSelectedProvince = p => {
    const filterProvince =
      p === ''
        ? provinces
        : provinces.filter(province => {
            return province.name.toLowerCase().includes(p.toLowerCase());
          });
    setSelectedLocation(filterProvince[0]);
  };

  const filteredProvince =
    provinceQuery === ''
      ? provinces
      : provinces.filter(province => {
          return province.name
            .toLowerCase()
            .includes(provinceQuery.toLowerCase());
        });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LoadingOverlay
        active={navigation.state === 'loading' || loading === true}
        className="m-4 p-4 flex flex-col md:flex-row gap-2"
      >
        <div className="w-full md:w-2/6 md:order-1 grow-0 space-y-2">
          <Card className="hover:shadow-md p-4">
            <div className="flex flex-row justify-between gap-2 mt-4">
              <button
                onClick={e => {
                  e.preventDefault();
                  navigate(`/vendors`);
                }}
                type="button"
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
                  <PlusCircleIcon className="h-4 w-4 mr-1" />
                  Save
                </span>
              </button>
            </div>
          </Card>
        </div>
        <Card className="flex-1 w-full text-xs hover:shadow-md grid grid-cols-4 gap-2 p-4">
          <div className="col-span-4 text-left my-4 relative">
            <p className="text-secondary-500 text-md text-lg font-semibold">
              Vendor Details
            </p>
          </div>

          <div className="col-span-4 md:col-span-3">
            <label className="block text-slate-700 font-bold mb-2">
              Shop Name
            </label>
            <input
              className={`appearance-none border rounded-md w-full py-2 px-3 leading-tight border-slate-200 bg-slate-50 text-slate-700 ${
                errors.name
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              } `}
              id="name"
              type="text"
              name="name"
              {...register('name', { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                Shop name is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2">
            <label className="block text-slate-700 font-bold mb-2">Email</label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3 leading-tight border-slate-200 bg-slate-50 text-slate-700 ${
                errors.email
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              } `}
              id="email"
              type="email"
              name="Email"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">Email is required</p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Mobile
            </label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3 leading-tight border-slate-200 bg-slate-50 text-slate-700 ${
                errors.mobile
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="mobile"
              type="text"
              name="Mobile"
              {...register('mobile', { required: true })}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs italic">Mobile is required</p>
            )}
          </div>
          <div className="col-span-4 text-left my-4 relative">
            <p className="text-secondary-500 text-md text-lg font-semibold">
              Address
            </p>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2 relative">
            <label className="block text-slate-700 font-bold mb-2">
              Province
            </label>
            <Combobox
              value={selectedLocation}
              onChange={c => handleSelectedProvince(c)}
              as="div"
              className="mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden"
            >
              <Combobox.Input
                className="`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus-visible:border-secondary-500"
                onChange={event => setProvinceQuery(event.target.value)}
                displayValue={(province: BasicModel) => province.name}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 mt-6 flex border-none items-center pr-2">
                <ChevronUpDownIcon
                  className="h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="absolute bg-white shadow-md z-40 mt-1 max-h-32 md:max-h-64 w-full overflow-y-auto rounded ">
                {filteredProvince.map(province => (
                  <Combobox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none text-xs py-2 pl-5 pr-4 ${
                        active ? 'bg-primary-500 text-white' : 'text-gray-900'
                      }`
                    }
                    key={province.name}
                    value={province.name}
                  >
                    {province.name}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
            {errors.shop_name && (
              <p className="text-red-500 text-xs italic">
                Province is required
              </p>
            )}
          </div>

          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">City</label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3 leading-tight border-slate-200 bg-slate-50 text-slate-700 ${
                errors.city
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="city"
              type="text"
              {...register('city', { required: true })}
            />
            {errors.city && (
              <p className="text-red-500 text-xs italic">City is required</p>
            )}
          </div>

          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Barangay
            </label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3 leading-tight border-slate-200 bg-slate-50 text-slate-700 ${
                errors.barangay
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              } `}
              id="text"
              name="barangay"
              type="text"
              {...register('barangay', { required: true })}
            />
            {errors.barangay && (
              <p className="text-red-500 text-xs italic">
                Barangay is required
              </p>
            )}
          </div>

          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Postal
            </label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3 leading-tight border-slate-200 bg-slate-50 text-slate-700 ${
                errors.postal
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              } `}
              id="text"
              name="postal"
              type="number"
              {...register('postal', { required: true })}
            />
            {errors.postal && (
              <p className="text-red-500 text-xs italic">Postal is required</p>
            )}
          </div>
          <div className="col-span-4 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Address
            </label>
            <input
              className={`appearance-none border rounded-md  w-full py-2 px-3 leading-tight border-slate-200 bg-slate-50 text-slate-700 ${
                errors.address
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="address"
              type="text"
              {...register('address', { required: true })}
            />
            {errors.address && (
              <p className="text-red-500 text-xs italic">Address is required</p>
            )}
          </div>
        </Card>
      </LoadingOverlay>
    </form>
  );
}
