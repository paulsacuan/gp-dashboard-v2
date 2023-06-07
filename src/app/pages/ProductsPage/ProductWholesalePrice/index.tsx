import React, { useState } from 'react';
// External
import { Card, Typography } from '@material-tailwind/react';
import { Tab, Listbox } from '@headlessui/react';
import LoadingOverlay from 'react-loading-overlay-ts';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
// Icons
import {
  ArrowUturnLeftIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
// utils
import { renderStatus } from 'utils/helper';
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductWholesalePrice() {
  const { product } = (useLoaderData() as { product }) || {
    product: { data: {} },
  };
  const { tier_prices } = (useLoaderData() as { tier_prices }) || {
    tier_prices: [],
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const navigate = useNavigate();
  const TWO_VAL_ARRAY = [1, 0];
  const [status, setStatus] = useState(TWO_VAL_ARRAY[0]);
  const [selectedTier, setSelectedTier] = useState(1);

  const [btnName, setBtnName] = useState('Add');

  const handleEdit = data => {
    setBtnName('Update');
    setStatus(data.status);
    reset({
      id: data.id,
      tier: data.tier,
      min: data.min,
      max: data.max,
      price: data.price,
      status: data.status,
    });
  };

  const handleReset = () => {
    setBtnName('Add');
    setStatus(TWO_VAL_ARRAY[0]);
    reset({
      id: 0,
      tier: selectedTier,
      min: 0,
      max: 0,
      price: 0,
      status: 0,
    });
  };

  const onSubmit = async data => {
    try {
      let response = { status: 0 };
      data.status = status;
      data.product_id = product.data.data.id;
      data.price = parseFloat(data.price);

      setLoading(true);
      if (btnName === 'Add') {
        response = await axios.post(`${apiUrl}/v2/products/tier/price`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.token()}`,
          },
        });
      } else {
        response = await axios.put(
          `${apiUrl}/v2/products/tier/price/${data.id}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Auth.token()}`,
            },
          },
        );
      }

      if (response.status === 200) {
        setLoading(false);
        const message = `${
          btnName === 'Add'
            ? 'Product Wholesale Price Added!'
            : 'Product Wholesale Price Updated!'
        }`;
        toast.success(message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        handleReset();
        setBtnName('Add');
        navigate(`/products/${product.data.data.slug}/wholesale-price`, {
          replace: true,
        });
      } else {
        setLoading(false);
        toast.error('Product Wholesale update error!', {
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
      toast.error('Something went wrong!', {
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
    <LoadingOverlay
      active={navigation.state === 'loading' || loading === true}
      className="m-4 p-4 flex flex-col md:flex-row gap-2"
    >
      <div className="w-full md:w-2/6 md:order-1 grow-0 space-y-2">
        <Card className="p-4">
          <p className="text-center bg-primera-100 text-segunda-100 py-1 my-4 px-4 rounded-xl text-xs">
            Actions
          </p>

          <div className="flex flex-row justify-between gap-2 mt-4">
            <button
              className="px-4 py-2 bg-segunda-100 text-primera-100 rounded-md text-xs font-semibold shadow-md inline-flex items-center hover:bg-primera-100 hover:text-segunda-100"
              type="button"
              onClick={() => {
                // navigate(`/products/${product.data.data.slug}`, {
                //   replace: true,
                // });
                navigate(-1);
              }}
            >
              <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
        </Card>
        <Card className="p-4 text-xs">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-4">
                <p className="text-center bg-primera-100 text-segunda-100 py-1 my-2 px-4 rounded-xl text-xs">
                  {btnName === 'Add'
                    ? 'Add Wholesale Price'
                    : 'Update Wholesale Price'}
                </p>
              </div>
              <div className="col-span-4">
                <input
                  id="text"
                  name="id"
                  type="text"
                  hidden
                  defaultValue={0}
                  {...register('id', { required: false })}
                />
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Tier
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.tier
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="tier"
                  name="tier"
                  type="number"
                  max={20}
                  {...register('tier', { required: true })}
                />
                {errors.tier && (
                  <p className="text-red-500 text-xs italic">
                    Tier is required
                  </p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Min
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.min
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="min"
                  name="min"
                  type="number"
                  {...register('min', { required: true })}
                />
                {errors.min && (
                  <p className="text-red-500 text-xs italic">Min is required</p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Max
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.max
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="max"
                  name="max"
                  type="number"
                  {...register('max', { required: true })}
                />
                {errors.max && (
                  <p className="text-red-500 text-xs italic">Max is required</p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Price
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.price
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="price"
                  name="price"
                  type="number"
                  {...register('price', { required: true })}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs italic">
                    Price is required
                  </p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Status
                </label>
                <Listbox
                  value={status}
                  onChange={newValue => {
                    setStatus(newValue);
                  }}
                >
                  <div className="relative">
                    <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                      <span className="block truncate">
                        {renderStatus(status)}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                      {TWO_VAL_ARRAY.map((boolArr, boolArrIdx) => (
                        <Listbox.Option
                          key={boolArrIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-primera-100 text-segunda-100'
                                : 'text-gray-900'
                            }`
                          }
                          value={boolArr}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {renderStatus(boolArr)}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              <div className="col-span-4 flex flex-row justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-segunda-100 text-primera-100 rounded-md text-xs font-semibold shadow-md hover:bg-primera-100 hover:text-segunda-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primera-100 text-segunda-100 flex items-center rounded-md text-xs font-semibold shadow-md hover:bg-segunda-100 hover:text-primera-100"
                >
                  {btnName}
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>

      <Card className="flex-1 w-full p-4 hover:shadow-md bg-gradient-to-r from-primera-50/80 to-primera-100">
        <div className="w-full px-2 py-16">
          <Tab.Group>
            <Tab.List className="flex space-x-2 rounded-xl bg-segunda-100 p-1 overflow-auto">
              {Object.keys(tier_prices).map(index => (
                <Tab
                  key={index}
                  onClick={() => setSelectedTier(parseInt(index) + 1)}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-1 md:px-0 px-2 text-sm font-medium leading-5 text-primera-100',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-segunda-100 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-primera-100 shadow text-segunda-100'
                        : 'text-primera-100 hover:bg-white/[0.12] hover:text-white',
                    )
                  }
                >
                  {parseInt(index) + 1}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {tier_prices.map((tiers, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-segunda-100 focus:outline-none focus:ring-2',
                  )}
                >
                  <div className="h-full rounded-lg overflow-auto">
                    {tiers.length > 0 ? (
                      <table className="w-full min-w-max table-auto text-right overflow-x-scroll">
                        <thead>
                          <tr>
                            <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-left text-xs">
                              Id
                            </th>
                            <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-right text-xs">
                              Tier
                            </th>
                            <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-right text-xs">
                              Min
                            </th>
                            <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-right text-xs">
                              Max
                            </th>
                            <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-right text-xs">
                              Price
                            </th>
                            <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-right text-xs">
                              Status
                            </th>
                            <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-center text-xs">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tiers.map(tier => (
                            <tr
                              key={tier.id}
                              className="even:bg-blue-gray-100/50 hover:bg-segunda-200/20"
                            >
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-left text-xs flex flex-row items-center gap-4"
                                >
                                  {tier.id}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-right text-xs gap-4"
                                >
                                  {tier.tier}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-right text-xs gap-4"
                                >
                                  {tier.min}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-right text-xs gap-4"
                                >
                                  {tier.max}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-right text-xs gap-4"
                                >
                                  {tier.price}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-right text-xs gap-4"
                                >
                                  {renderStatus(tier.status)}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal flex flex-row items-center justify-center space-x-1"
                                >
                                  <button
                                    className="bg-primera-100 text-xs font-semibold shadow-md text-segunda-100 px-4 py-2 rounded-lg hover:bg-segunda-100 hover:text-primera-100"
                                    onClick={() => handleEdit(tier)}
                                  >
                                    Update
                                  </button>
                                  {/* <button
                                    className="bg-red-600 text-xs font-semibold shadow-md text-white px-4 py-2 rounded-lg hover:bg-segunda-100 hover:text-primera-100"
                                    onClick={() => handleEdit(tier)}
                                  >
                                    Delete
                                  </button> */}
                                </Typography>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex flex-row items-center justify-center">
                        <p className="text-sm text-gray-500">
                          No wholesale price for tier {parseInt(idx) + 1} yet 😔
                        </p>
                      </div>
                    )}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </Card>
    </LoadingOverlay>
  );
}
