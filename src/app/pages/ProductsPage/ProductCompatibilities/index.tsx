import React, { useState } from 'react';
// External
import { useLoaderData, useNavigation, useNavigate } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay-ts';
import { Card, Typography } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

// Icons
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
// utils
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

export default function Compatibilities() {
  const [loading, setLoading] = useState(false);
  const [btnName, setBtnName] = useState('Add');
  const navigation = useNavigation();
  const navigate = useNavigate();

  const { product } = (useLoaderData() as { product }) || {
    product: { data: {} },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    try {
      data.product_id = product.data.data.id;
      const id = data.id.toString();
      let response = { status: 0 };
      if (id !== '0') {
        response = await axios.put(
          `${apiUrl}/v2/products/compatibilities/update/${data.id}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Auth.token()}`,
            },
          },
        );
      } else {
        console.log(JSON.stringify(data));
        response = await axios.post(
          `${apiUrl}/v2/products/compatibilities`,
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
          id !== '0'
            ? 'Product Compatibility updated!'
            : 'Product Compatibility added!'
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
        navigate(`/products/${product.data.data.slug}/compatibilities`, {
          replace: true,
        });
      } else {
        setLoading(false);
        toast.error('Product compatibility update error!', {
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

  const handleEdit = data => {
    setBtnName('Update');
    reset({
      id: data.id,
      make: data.make,
      model: data.model,
      year: data.year,
      engine_displacement: data.engine_displacement,
      car_fuel_type: data.car_fuel_type,
      car_transmission: data.car_transmission,
    });
  };

  const handleReset = () => {
    setBtnName('Add');
    reset({
      id: 0,
      make: '',
      model: '',
      year: '',
      engine_displacement: '',
      car_fuel_type: '',
      car_transmission: '',
    });
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
                    ? 'Add Product Compatibility'
                    : 'Update Product Compatibility'}
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
                  Make
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.make
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="text"
                  name="make"
                  type="text"
                  {...register('make', { required: true })}
                />
                {errors.make && (
                  <p className="text-red-500 text-xs italic">
                    Make is required
                  </p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Model
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.model
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="text"
                  name="model"
                  type="text"
                  {...register('model', { required: true })}
                />
                {errors.model && (
                  <p className="text-red-500 text-xs italic">
                    Model is required
                  </p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Year
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.year
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="text"
                  name="year"
                  type="text"
                  {...register('year', { required: true })}
                />
                {errors.year && (
                  <p className="text-red-500 text-xs italic">
                    Year is required
                  </p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Engine Displacement
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.engine_displacement
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="text"
                  name="engine_displacement"
                  type="text"
                  {...register('engine_displacement', { required: true })}
                />
                {errors.engine_displacement && (
                  <p className="text-red-500 text-xs italic">
                    Engine Displacement is required
                  </p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Car Fuel Type
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.car_fuel_type
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="text"
                  name="car_fuel_type"
                  type="text"
                  {...register('car_fuel_type', { required: true })}
                />
                {errors.car_fuel_type && (
                  <p className="text-red-500 text-xs italic">
                    Car Fuel Type is required
                  </p>
                )}
              </div>
              <div className="col-span-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Car Transmission
                </label>
                <input
                  className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                    errors.car_transmission
                      ? 'border border-red-500 focus:outline focus:outline-red-500'
                      : 'focus:outline focus:outline-segunda-100'
                  }`}
                  id="text"
                  name="car_transmission"
                  type="text"
                  {...register('car_transmission', { required: true })}
                />
                {errors.car_fuel_type && (
                  <p className="text-red-500 text-xs italic">
                    Car Transmission is required
                  </p>
                )}
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
      <Card className="flex-1 max-w-full p-4 grid grid-cols-4 gap-2 text-xs hover:shadow-md">
        <div className="col-span-4">
          <div className="h-full rounded-lg overflow-auto">
            {product.data.data.compatibilities.length > 0 ? (
              <table className="w-full min-w-max table-auto text-right overflow-x-scroll">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-left text-xs">
                      Make
                    </th>
                    <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs">
                      Model
                    </th>
                    <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs">
                      Year
                    </th>
                    <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs">
                      Engine Displacement
                    </th>
                    <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs">
                      Car Fuel Type
                    </th>
                    <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs">
                      Car Transmission
                    </th>
                    <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.data.data.compatibilities &&
                    product.data.data.compatibilities.map(c => (
                      <tr
                        key={c.id}
                        className="even:bg-blue-gray-100/50 hover:bg-segunda-200/20"
                      >
                        <td className="py-2 px-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-left text-xs flex flex-row items-center gap-4"
                          >
                            {c.make}
                          </Typography>
                        </td>
                        <td className="py-2 px-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-right text-xs gap-4"
                          >
                            {c.model}
                          </Typography>
                        </td>
                        <td className="py-2 px-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-right text-xs gap-4"
                          >
                            {c.year}
                          </Typography>
                        </td>
                        <td className="py-2 px-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-right text-xs gap-4"
                          >
                            {c.engine_displacement}
                          </Typography>
                        </td>
                        <td className="py-2 px-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-right text-xs gap-4"
                          >
                            {c.car_fuel_type}
                          </Typography>
                        </td>
                        <td className="py-2 px-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-right text-xs gap-4"
                          >
                            {c.car_transmission}
                          </Typography>
                        </td>
                        <td className="py-2 px-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-center"
                          >
                            <button
                              className="bg-primera-100 text-xs font-semibold shadow-md text-segunda-100 px-4 py-2 rounded-lg hover:bg-segunda-100 hover:text-primera-100"
                              onClick={() => handleEdit(c)}
                            >
                              Update
                            </button>
                          </Typography>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="w-full h-full flex flex-row justify-center items-center">
                <p className="text-sm text-gray-500">
                  No Compatibilities found for this product 😔
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </LoadingOverlay>
  );
}
