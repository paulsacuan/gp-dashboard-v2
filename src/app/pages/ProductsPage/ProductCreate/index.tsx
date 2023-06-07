import React, { useState } from 'react';
// External
import { Combobox, Listbox } from '@headlessui/react';
import { useLoaderData, useNavigation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
import axios from 'axios';
// utils
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';
// Helpers
import {
  renderProductAvailability,
  renderStatus,
  renderProductGarageType,
  renderSaleType,
} from 'utils/helper';
// Icons
import {
  CheckCircleIcon,
  ArrowUturnLeftIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/solid';

export default function ProductCreate() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const { vendors } = (useLoaderData() as { vendors }) || {
    vendors: { data: {} },
  };
  const { categories } = (useLoaderData() as { categories }) || {
    categories: { data: {} },
  };
  const { brands } = (useLoaderData() as { brands }) || {
    brands: { data: {} },
  };
  const { parents } = (useLoaderData() as { parents }) || {
    parents: { data: [] },
  };

  const [state, setState] = useState({
    stock: 0,
    status: 0,
    discountAllowed: 0,
    nextDayDeliveryAllowed: 0,
    expressDeliveryAllowed: 0,
    btc_availability: 1,
    garage_type: 1,
    is_wholesale: 0,
    is_promo: 0,
    is_sale: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // listBox array
  const TWO_VAL_ARRAY = [1, 0];
  const THREE_VAL_ARRAY = [1, 0, 2];

  type BasicModel = {
    id: number;
    name: string;
  };
  // queries
  const [vendorQuery, setVendorQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [brandQuery, setBrandQuery] = useState('');
  const [parentQuery, setParentQuery] = useState('');

  // states
  const [selectedVendor, setSelectedVendor] = useState<BasicModel | undefined>(
    vendors[0],
  );
  const [selectedCategory, setSelectedCategory] = useState<
    BasicModel | undefined
  >(categories[0]);
  const [selectedBrand, setSelectedBrand] = useState<BasicModel | undefined>(
    brands[0],
  );
  const [selectedParent, setSelectedParent] = useState<BasicModel | undefined>({
    id: 0,
    name: '',
  });
  const [loading, setLoading] = React.useState(navigation.state === 'loading');
  // filtered array
  const filteredVendor =
    vendorQuery === ''
      ? vendors
      : vendors.filter((vendor: BasicModel) => {
          return vendor.name.toLowerCase().includes(vendorQuery.toLowerCase());
        });
  const filteredCategory =
    categoryQuery === ''
      ? categories
      : categories.filter((category: BasicModel) => {
          return category.name
            .toLowerCase()
            .includes(categoryQuery.toLowerCase());
        });
  const filteredBrand =
    brandQuery === ''
      ? brands
      : brands.filter((brand: BasicModel) => {
          return brand.name.toLowerCase().includes(brandQuery.toLowerCase());
        });
  const filteredParent =
    parentQuery === ''
      ? parents
      : parents.filter((parent: BasicModel) => {
          return parent.name.toLowerCase().includes(parentQuery.toLowerCase());
        });

  // handlers
  const handleSelectVendor = v => {
    const filterV =
      v === ''
        ? vendors
        : vendors.filter((vendor: BasicModel) => {
            return vendor.name.toLowerCase().includes(v.toLowerCase());
          });
    setSelectedVendor(filterV[0]);
  };

  const handleSelectedCategory = c => {
    const filterC =
      c === ''
        ? categories
        : categories.filter((category: BasicModel) => {
            return category.name.toLowerCase().includes(c.toLowerCase());
          });
    setSelectedCategory(filterC[0]);
  };

  const handleSelectedBrand = b => {
    const filterB =
      b === ''
        ? brands
        : brands.filter((brand: BasicModel) => {
            return brand.name.toLowerCase().includes(b.toLowerCase());
          });
    setSelectedBrand(filterB[0]);
  };

  const handleSelectParent = p => {
    const filterP =
      p === ''
        ? parents
        : parents.filter((parent: BasicModel) => {
            return parent.name.toLowerCase().includes(p.toLowerCase());
          });
    setSelectedParent(filterP[0]);
  };

  const onSubmit = async data => {
    try {
      data.vendor_id = selectedVendor.id;
      data.category_id = selectedCategory.name;
      data.brand_id = selectedBrand.name;
      data.parent_id = selectedParent.id;

      data.stock = state.stock;
      data.status = state.status;
      data.discount_allowed = state.discountAllowed;
      data.nextday_delivery_allowed = state.nextDayDeliveryAllowed;
      data.express_delivery_allowed = state.expressDeliveryAllowed;
      data.btc_availability = state.btc_availability;
      data.garage_type = state.garage_type;
      data.is_wholesale = state.is_wholesale;
      data.is_promo = state.is_promo;
      data.is_sale = state.is_sale;

      data.currency_id = 1; // default
      setLoading(true);

      const response = await axios.post(`${apiUrl}/v2/products`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.token()}`,
        },
      });
      if (response.status === 200) {
        setLoading(false);
        toast.success('Product Created Successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate(`/products/${response.data.data.slug}`, { replace: true });
      } else {
        setLoading(false);
        toast.error('Product creation failed!', {
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LoadingOverlay
          active={navigation.state === 'loading' || loading === true}
          className="m-4 p-4 flex flex-col md:flex-row gap-2 z-20"
        >
          {/* actions */}
          <div className="max-w-sm md:order-1 flex-1 space-y-2">
            {/* card */}
            <Card className="hover:shadow-md flex flex-row justify-between gap-2 p-4">
              <button
                className="px-4 py-2 bg-segunda-100 text-primera-100 rounded-lg text-xs font-semibold shadow-md inline-flex items-center hover:bg-primera-100 hover:text-segunda-100"
                type="button"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowUturnLeftIcon className="h-4 w-4 stroke-1 mr-2" />
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primera-100 text-segunda-100 flex items-center rounded-md text-xs font-semibold shadow-md hover:bg-segunda-100 hover:text-primera-100"
              >
                <CheckCircleIcon className="h-4 w-4 stroke-1 mr-1" />
                Save
              </button>
            </Card>
          </div>
          {/* card */}
          <Card className="flex-1 w-full text-xs hover:shadow-md grid grid-cols-4 gap-2 p-4">
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Part #
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.part_number
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="part_number"
                type="text"
                {...register('part_number', { required: true })}
              />
              {errors.part_number && (
                <p className="text-red-500 text-xs italic">
                  Part # is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Part Name
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.name
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  Part Name is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2 relative">
              <label className="block text-gray-700 font-bold mb-2">
                Vendor
              </label>
              <div className="w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox
                  value={selectedVendor}
                  onChange={v => handleSelectVendor(v)}
                  as="div"
                  className="mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden rounded bg-white shadow-sm ring-1 ring-black/5"
                >
                  <Combobox.Input
                    className="`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-visible:border-segunda-100"
                    onChange={event => setVendorQuery(event.target.value)}
                    displayValue={(vendor: BasicModel) => vendor.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 mt-6 flex items-center border-none pr-2">
                    <ChevronUpDownIcon
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  <Combobox.Options className="absolute bg-white shadow-md z-40 mt-1 max-h-32 md:max-h-64 w-full overflow-y-auto rounded text-sm">
                    {filteredVendor.map(vendor => (
                      <Combobox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none text-xs py-2 pl-5 pr-4 ${
                            active
                              ? 'bg-primera-100 text-white'
                              : 'text-gray-900'
                          }`
                        }
                        key={vendor.id}
                        value={vendor.name}
                      >
                        {vendor.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
              </div>
            </div>
            <div className="col-span-4 md:col-span-2 relative">
              <label className="block text-gray-700 font-bold mb-2">
                Category
              </label>
              <div className="w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox
                  value={selectedCategory}
                  onChange={c => handleSelectedCategory(c)}
                  as="div"
                  className="mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden rounded bg-white shadow-sm ring-1 ring-black/5"
                >
                  <Combobox.Input
                    className="`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-visible:border-segunda-100"
                    onChange={event => setCategoryQuery(event.target.value)}
                    displayValue={(category: BasicModel) => category.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 mt-6 flex border-none items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  <Combobox.Options className="absolute bg-white shadow-md z-40 mt-1 max-h-32 md:max-h-64 w-full overflow-y-auto rounded text-sm">
                    {filteredCategory.map(category => (
                      <Combobox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none text-xs py-2 pl-5 pr-4 ${
                            active
                              ? 'bg-primera-100 text-white'
                              : 'text-gray-900'
                          }`
                        }
                        key={category.id}
                        value={category.name}
                      >
                        {category.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
              </div>
            </div>
            <div className="col-span-4 md:col-span-2 relative">
              <label className="block text-gray-700 font-bold mb-2">
                Brand
              </label>
              <div className="w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox
                  value={selectedBrand}
                  onChange={b => handleSelectedBrand(b)}
                  as="div"
                  className="mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden rounded bg-white shadow-sm ring-1 ring-black/5"
                >
                  <Combobox.Input
                    className="`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-visible:border-segunda-100"
                    onChange={event => setBrandQuery(event.target.value)}
                    displayValue={(brand: BasicModel) => brand.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 mt-6 border-none flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  <Combobox.Options className="absolute bg-white shadow-md z-40 mt-1 max-h-32 md:max-h-64 w-full overflow-y-auto rounded text-sm">
                    {filteredBrand.map(brand => (
                      <Combobox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none text-xs py-2 pl-5 pr-4 ${
                            active
                              ? 'bg-primera-100 text-white'
                              : 'text-gray-900'
                          }`
                        }
                        key={brand.id}
                        value={brand.name}
                      >
                        {brand.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
              </div>
            </div>
            <div className="col-span-4 md:col-span-2 relative">
              <label className="block text-gray-700 font-bold mb-2">
                Product Parent
              </label>
              <div className="w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox
                  value={selectedParent}
                  onChange={p => handleSelectParent(p)}
                  as="div"
                  className="mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden rounded bg-white shadow-sm ring-1 ring-black/5"
                >
                  <Combobox.Input
                    className="`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-visible:border-segunda-100"
                    onChange={event => setParentQuery(event.target.value)}
                    displayValue={(parent: BasicModel) => parent.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 mt-6 flex items-center border-none pr-2">
                    <ChevronUpDownIcon
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  <Combobox.Options className="absolute bg-white shadow-md z-40 mt-1 max-h-32 md:max-h-64 w-full overflow-y-auto rounded text-sm">
                    {filteredParent.map(parent => (
                      <Combobox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none text-xs py-2 pl-5 pr-4 ${
                            active
                              ? 'bg-primera-100 text-white'
                              : 'text-gray-900'
                          }`
                        }
                        key={parent.id}
                        value={parent.name}
                      >
                        {parent.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
              </div>
            </div>
            <div className="col-span-4 p-1 rounded-xl font-bold my-2 bg-primera-100 text-segunda-100">
              <p className="text-center">Details</p>
            </div>
            <div className="col-span-4">
              <label className="block text-gray-700 font-bold mb-2">
                Short Description
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.short_description
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="short_description"
                type="text"
                {...register('short_description', { required: true })}
              />
              {errors.short_description && (
                <p className="text-red-500 text-xs italic">
                  Short description is required
                </p>
              )}
            </div>
            <div className="col-span-4">
              <label className="block text-gray-700 font-bold mb-2">
                Long Description
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.long_description
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="long_description"
                type="text"
                {...register('long_description', { required: true })}
              />
              {errors.long_description && (
                <p className="text-red-500 text-xs italic">
                  Long description is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Stock
              </label>
              <Listbox
                value={state.stock}
                onChange={newValue => {
                  setState({ ...state, stock: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderStatus(state.stock)}
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
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Status
              </label>
              <Listbox
                value={state.status}
                onChange={newValue => {
                  setState({ ...state, status: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderStatus(state.status)}
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
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Next Day Delivery
              </label>
              <Listbox
                value={state.nextDayDeliveryAllowed}
                onChange={newValue => {
                  setState({ ...state, nextDayDeliveryAllowed: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderStatus(state.nextDayDeliveryAllowed)}
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
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Express Delivery
              </label>
              <Listbox
                value={state.expressDeliveryAllowed}
                onChange={newValue => {
                  setState({ ...state, expressDeliveryAllowed: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderStatus(state.expressDeliveryAllowed)}
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
            <div className="col-span-4">
              <label className="block text-gray-700 font-bold mb-2">
                Remarks
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.remarks
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="remarks"
                type="text"
                {...register('remarks', { required: false })}
              />
              {errors.remarks && (
                <p className="text-red-500 text-xs italic">
                  Remarks is required
                </p>
              )}
            </div>
            <div className="col-span-4">
              <label className="block text-gray-700 font-bold mb-2">Tags</label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tags
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tags"
                type="text"
                {...register('tags', { required: true })}
              />
              {errors.tags && (
                <p className="text-red-500 text-xs italic">Tags is required</p>
              )}
            </div>
            <div className="col-span-4 p-1 rounded-xl font-bold my-2 bg-primera-100 text-segunda-100">
              <p className="text-center">Product Visibility</p>
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                BTC Availability
              </label>
              <Listbox
                value={state.btc_availability}
                onChange={newValue => {
                  setState({ ...state, btc_availability: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderProductAvailability(state.btc_availability)}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                    {THREE_VAL_ARRAY.map((boolArr, boolArrIdx) => (
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
                              {renderProductAvailability(boolArr)}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Garage Visibility
              </label>
              <Listbox
                value={state.garage_type}
                onChange={newValue => {
                  setState({ ...state, garage_type: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderProductGarageType(state.garage_type)}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                    {THREE_VAL_ARRAY.map((boolArr, boolArrIdx) => (
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
                              {renderProductGarageType(boolArr)}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Is Wholesale
              </label>
              <Listbox
                value={state.is_wholesale}
                onChange={newValue => {
                  setState({ ...state, is_wholesale: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderStatus(state.is_wholesale)}
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
            <div className="col-span-4 md:col-span-2"></div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Is Promo
              </label>
              <Listbox
                value={state.is_promo}
                onChange={newValue => {
                  setState({ ...state, is_promo: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderStatus(state.is_promo)}
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

            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Sale Type
              </label>
              <Listbox
                value={state.is_sale}
                onChange={newValue => {
                  setState({ ...state, is_sale: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderSaleType(state.is_sale)}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                    {THREE_VAL_ARRAY.map((boolArr, boolArrIdx) => (
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
                              {renderSaleType(boolArr)}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Discount Allowed
              </label>
              <Listbox
                value={state.discountAllowed}
                onChange={newValue => {
                  setState({ ...state, discountAllowed: newValue });
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative max-w-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight text-left shadow border focus:outline-none focus-visible:border-segunda-100 text-sm">
                    <span className="block truncate">
                      {renderStatus(state.discountAllowed)}
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
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Discount Percent
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.discount_percent
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="discount_percent"
                type="text"
                {...register('discount_percent', { required: false })}
              />
              {errors.discount_percent && (
                <p className="text-red-500 text-xs italic">
                  Discount Percent is required
                </p>
              )}
            </div>
            <div className="col-span-4 p-1 rounded-xl font-bold my-2 bg-primera-100 text-segunda-100">
              <p className="text-center">Cost & Prices (&#8369;)</p>
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Price
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.price
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="price"
                type="text"
                {...register('price', { required: true })}
              />
              {errors.price && (
                <p className="text-red-500 text-xs italic">Price is required</p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">Cost</label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.cost
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="cost"
                type="text"
                {...register('cost', { required: true })}
              />
              {errors.cost && (
                <p className="text-red-500 text-xs italic">Cost is required</p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 1
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_1
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_1"
                type="text"
                {...register('tier_1', { required: true })}
              />
              {errors.tier_1 && (
                <p className="text-red-500 text-xs italic">
                  Tier 1 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 2
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_2
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_2"
                type="text"
                {...register('tier_2', { required: true })}
              />
              {errors.tier_2 && (
                <p className="text-red-500 text-xs italic">
                  Tier 2 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 3
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_3
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_3"
                type="text"
                {...register('tier_3', { required: true })}
              />
              {errors.tier_3 && (
                <p className="text-red-500 text-xs italic">
                  Tier 3 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 4
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_4
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_4"
                type="text"
                {...register('tier_4', { required: true })}
              />
              {errors.tier_4 && (
                <p className="text-red-500 text-xs italic">
                  Tier 4 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 5
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_5
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_5"
                type="text"
                {...register('tier_5', { required: true })}
              />
              {errors.tier_5 && (
                <p className="text-red-500 text-xs italic">
                  Tier 5 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 6
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_6
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_6"
                type="text"
                {...register('tier_6', { required: true })}
              />
              {errors.tier_6 && (
                <p className="text-red-500 text-xs italic">
                  Tier 6 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 7
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_7
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_7"
                type="text"
                {...register('tier_7', { required: true })}
              />
              {errors.tier_7 && (
                <p className="text-red-500 text-xs italic">
                  Tier 7 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 8
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_8
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_8"
                type="text"
                {...register('tier_8', { required: true })}
              />
              {errors.tier_8 && (
                <p className="text-red-500 text-xs italic">
                  Tier 8 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 9
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_9
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_9"
                type="text"
                {...register('tier_9', { required: true })}
              />
              {errors.tier_9 && (
                <p className="text-red-500 text-xs italic">
                  Tier 9 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 10
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_10
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_10"
                type="text"
                {...register('tier_10', { required: true })}
              />
              {errors.tier_10 && (
                <p className="text-red-500 text-xs italic">
                  Tier 10 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 11
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_11
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_11"
                type="text"
                {...register('tier_11', { required: true })}
              />
              {errors.tier_11 && (
                <p className="text-red-500 text-xs italic">
                  Tier 11 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 12
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_12
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_12"
                type="text"
                {...register('tier_12', { required: true })}
              />
              {errors.tier_12 && (
                <p className="text-red-500 text-xs italic">
                  Tier 12 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 13
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_13
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_13"
                type="text"
                {...register('tier_13', { required: true })}
              />
              {errors.tier_13 && (
                <p className="text-red-500 text-xs italic">
                  Tier 13 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 14
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_14
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_14"
                type="text"
                {...register('tier_14', { required: true })}
              />
              {errors.tier_14 && (
                <p className="text-red-500 text-xs italic">
                  Tier 14 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 15
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_15
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_15"
                type="text"
                {...register('tier_15', { required: true })}
              />
              {errors.tier_15 && (
                <p className="text-red-500 text-xs italic">
                  Tier 15 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 16
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_16
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_16"
                type="text"
                {...register('tier_16', { required: true })}
              />
              {errors.tier_16 && (
                <p className="text-red-500 text-xs italic">
                  Tier 16 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 17
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_17
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_17"
                type="text"
                {...register('tier_17', { required: true })}
              />
              {errors.tier_17 && (
                <p className="text-red-500 text-xs italic">
                  Tier 17 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 18
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_18
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_18"
                type="text"
                {...register('tier_18', { required: true })}
              />
              {errors.tier_18 && (
                <p className="text-red-500 text-xs italic">
                  Tier 18 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 19
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_19
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_19"
                type="text"
                {...register('tier_19', { required: true })}
              />
              {errors.tier_19 && (
                <p className="text-red-500 text-xs italic">
                  Tier 19 is required
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2">
                Tier 20
              </label>
              <input
                className={`shadow max-w-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${
                  errors.tier_20
                    ? 'border border-red-500 focus:outline focus:outline-red-500'
                    : 'focus:outline focus:outline-segunda-100'
                }`}
                id="text"
                name="tier_20"
                type="text"
                {...register('tier_20', { required: true })}
              />
              {errors.tier_20 && (
                <p className="text-red-500 text-xs italic">
                  Tier 20 is required
                </p>
              )}
            </div>
          </Card>
        </LoadingOverlay>
      </form>
    </>
  );
}
