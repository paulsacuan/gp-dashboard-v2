import React, { useState } from 'react';
// External
import { Listbox, Combobox, Switch } from '@headlessui/react';
import { useNavigate, useNavigation, useLoaderData } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
import axios from 'axios';
// utils
import { Auth } from 'utils/auth';
import { apiUrl, garageType, tierList, daysOfWeek } from 'utils/constants';
import { provinces } from 'utils/locations';
// Icons
import {
  PlusCircleIcon,
  ArrowUturnLeftIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/solid';

export default function GarageCreate() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { salesUser } = (useLoaderData() as { salesUser }) || {
    salesUser: { data: {} },
  };

  const [isApprover, setIsApprover] = useState(false);
  const [isSingleApprover, setIsSingleApprover] = useState(false);

  const [selectedTier, setSelectedTier] = useState(tierList[0]);
  const [enabledCredit, setEnabledCredit] = useState(false);

  const [isProvincial, setIsProvincial] = useState(false);
  const [isCod, setIsCod] = useState(false);
  const [isNextDay, setIsNextDay] = useState(false);
  const [isExpress, setIsExpress] = useState(false);

  const [provinceQuery, setProvinceQuery] = useState('');
  const [accountQuery, setAccountQuery] = useState('');
  const [accountHolder, setAccountHolder] = useState(
    salesUser[0].first_name + ' ' + salesUser[0].last_name,
  );

  const [selectedGaragetype, setSelectedGarageType] = useState(garageType[0]);
  const [selectedLocation, setSelectedLocation] = useState(() => provinces[0]);

  const [accountHolderEmail, setAccountHolderEmail] = useState(salesUser[0]);

  const [selectedDays, setSelectedDays] = useState(['Monday']);

  type BasicModel = {
    id: number;
    name: string;
  };
  type SalesModel = {
    id: number;
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    try {
      data.rebate = 0; // default
      data.total_rebates = 0; // default
      data.discount_amount = 0; // default

      data.garage_type = selectedGaragetype.value;
      data.province = selectedLocation.name;
      data.delivery_day = selectedDays.toString();
      data.tier = selectedTier;
      data.is_approver = isApprover;
      data.is_single_approver = isSingleApprover;
      data.is_cod_available = isCod;
      data.is_provincial = isProvincial;
      data.is_express_available = isExpress;
      data.is_next_day_available = isNextDay;
      data.account_holder = accountHolder;
      data.sales_manager = accountHolder;
      data.sales_manager_email = accountHolderEmail.email;
      data.account_holder_email = accountHolderEmail.email;

      setLoading(true);
      console.log(JSON.stringify(data));

      const response = await axios.post(`${apiUrl}/v2/garages`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.token()}`,
        },
      });
      if (response.status === 200) {
        setLoading(false);
        toast.success('Garage Created!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate(`/garages/${response.data.data.id}`, { replace: true });
      } else {
        setLoading(false);
        toast.error('Failed to create new garage!', {
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

  const handleSelectedAccount = am => {
    const filterAMs =
      am === ''
        ? salesUser
        : salesUser.filter(sales => {
            return sales.email.toLowerCase().includes(am.toLowerCase());
          });
    setAccountHolderEmail(filterAMs[0]);
    setAccountHolder(filterAMs[0].first_name + ' ' + filterAMs[0].last_name);
  };

  const filteredProvince =
    provinceQuery === ''
      ? provinces
      : provinces.filter(province => {
          return province.name
            .toLowerCase()
            .includes(provinceQuery.toLowerCase());
        });

  const filteredAMs =
    accountQuery === ''
      ? salesUser
      : salesUser.filter(sales => {
          return sales.email.toLowerCase().includes(accountQuery.toLowerCase());
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
                onClick={() => {
                  navigate(`/garages`);
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
                onClick={() => {
                  console.log('save');
                }}
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
              Garage Details
            </p>
          </div>
          <div className="col-span-4 md:col-span-3">
            <label className="block text-gray-700 font-bold mb-2">
              Shop Name
            </label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.shop_name
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="shop_name"
              name="shop_name"
              type="text"
              {...register('shop_name', { required: true })}
            />
            {errors.shop_name && (
              <p className="text-red-500 text-xs italic">
                Shop Name is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">
              Discount code
            </label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.discount_code
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="discount_code"
              name="discount_code"
              type="text"
              {...register('discount_code', { required: true })}
            />
            {errors.discount_code && (
              <p className="text-red-500 text-xs italic">
                Discount code is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-3">
            <label className="block text-gray-700 font-bold mb-2">
              Company Name
            </label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.company_name
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="company_name"
              name="company_name"
              type="text"
              {...register('company_name', { required: true })}
            />
            {errors.company_name && (
              <p className="text-red-500 text-xs italic">
                Company Name is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-1 mb-2 relative">
            <label className="block text-slate-700 font-bold mb-2">
              Price Tier
            </label>
            <Listbox value={selectedTier} onChange={setSelectedTier}>
              <Listbox.Button className="text-left max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus-visible:border-secondary-500">
                Tier {selectedTier}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                {tierList.map(tier => (
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-5 pr-4 ${
                        active
                          ? 'bg-primary-500 text-secondary-500'
                          : 'text-gray-900'
                      }`
                    }
                    key={tier}
                    value={tier}
                  >
                    Tier {tier}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>

          <div className="col-span-4 md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.email
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="email"
              name="email"
              type="email"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">Email is required</p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Mobile</label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.mobile
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="mobile"
              name="mobile"
              type="text"
              {...register('mobile', { required: true })}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs italic">Mobile is required</p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              DTI / TIN No
            </label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.dti_tin_no
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="dti_tin_no"
              name="dti_tin_no"
              type="dti_tin_no"
              {...register('dti_tin_no', { required: true })}
            />
            {errors.dti_tin_no && (
              <p className="text-red-500 text-xs italic">
                DTI / TIN No is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2 relative">
            <label className="block text-slate-700 font-bold mb-2">
              Garage Type
            </label>
            <Listbox
              value={selectedGaragetype}
              onChange={setSelectedGarageType}
            >
              <Listbox.Button className="text-left max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus-visible:border-secondary-500">
                {selectedGaragetype.name}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                {garageType.map(gTypes => (
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-5 pr-4 ${
                        active
                          ? 'bg-primary-500 text-secondary-500'
                          : 'text-gray-900'
                      }`
                    }
                    key={gTypes.id}
                    value={gTypes}
                  >
                    {gTypes.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
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
          </div>
          <div className="col-span-4 md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">City</label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.city
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="city"
              name="city"
              type="text"
              {...register('city', { required: true })}
            />
            {errors.city && (
              <p className="text-red-500 text-xs italic">City is required</p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Barangay
            </label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.barangay
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="barangay"
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
          <div className="col-span-4 md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Postal</label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.postal
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="postal"
              name="postal"
              type="text"
              {...register('postal', { required: true })}
            />
            {errors.postal && (
              <p className="text-red-500 text-xs italic">Postal is required</p>
            )}
          </div>
          <div className="col-span-4">
            <label className="block text-gray-700 font-bold mb-2">
              Address
            </label>
            <input
              className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.address
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="address"
              name="address"
              type="text"
              {...register('address', { required: true })}
            />
            {errors.address && (
              <p className="text-red-500 text-xs italic">Address is required</p>
            )}
          </div>

          <div className="col-span-4 text-left my-4 relative">
            <p className="text-secondary-500 text-md text-lg font-semibold">
              Approver Options
            </p>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Requires Approver
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isApprover}
                onChange={setIsApprover}
                className={`${isApprover ? 'bg-secondary-500' : 'bg-gray-700'}
          relative inline-flex h-[26px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Is Approver</span>
                <span
                  aria-hidden="true"
                  className={`${isApprover ? 'translate-x-8' : 'translate-x-0'}
            pointer-events-none inline-block h-[22px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <p>{isApprover ? 'True' : 'False'}</p>
            </div>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Approver Type
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isSingleApprover}
                onChange={setIsSingleApprover}
                disabled={!isApprover}
                className={`${
                  isSingleApprover ? 'bg-secondary-500' : 'bg-primary-500'
                }
          relative inline-flex h-[26px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 disabled:bg-gray-700`}
              >
                <span className="sr-only">Approver Type</span>
                <span
                  aria-hidden="true"
                  className={`${
                    isSingleApprover ? 'translate-x-8' : 'translate-x-0'
                  }
            pointer-events-none inline-block h-[22px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <p>{isSingleApprover ? 'Single Approver' : 'Double Approver'}</p>
            </div>
          </div>
          <div className="col-span-4 text-left my-4 relative">
            <p className="text-secondary-500 text-md text-lg font-semibold">
              Delivery Options
            </p>
          </div>

          <div className="col-span-4 relative mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Delivery Day
            </label>
            <Listbox value={selectedDays} onChange={setSelectedDays} multiple>
              <Listbox.Button className="text-left appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus-visible:border-secondary-500">
                {selectedDays.map(person => person).join(', ')}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                {daysOfWeek.map(day => (
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-5 pr-4 ${
                        active
                          ? 'bg-primary-500 text-secondary-500'
                          : 'text-gray-900'
                      }`
                    }
                    key={day}
                    value={day}
                  >
                    {day}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <div className="col-span-2 md:col-span-1 relative">
            <label className="block text-slate-700 font-bold mb-2">
              Provincial Available
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isProvincial}
                onChange={setIsProvincial}
                className={`${isProvincial ? 'bg-secondary-500' : 'bg-gray-700'}
          relative inline-flex h-[26px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only"> Provincial Available</span>
                <span
                  aria-hidden="true"
                  className={`${
                    isProvincial ? 'translate-x-8' : 'translate-x-0'
                  }
            pointer-events-none inline-block h-[22px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <p>{isProvincial ? 'True' : 'False'}</p>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 relative">
            <label className="block text-slate-700 font-bold mb-2">
              COD Available
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isCod}
                onChange={setIsCod}
                className={`${isCod ? 'bg-secondary-500' : 'bg-gray-700'}
          relative inline-flex h-[26px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only"> COD Available</span>
                <span
                  aria-hidden="true"
                  className={`${isCod ? 'translate-x-8' : 'translate-x-0'}
            pointer-events-none inline-block h-[22px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <p>{isCod ? 'True' : 'False'}</p>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 relative">
            <label className="block text-slate-700 font-bold mb-2">
              Nextday Available
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isNextDay}
                onChange={setIsNextDay}
                className={`${isNextDay ? 'bg-secondary-500' : 'bg-gray-700'}
          relative inline-flex h-[26px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only"> Nextday Available</span>
                <span
                  aria-hidden="true"
                  className={`${isNextDay ? 'translate-x-8' : 'translate-x-0'}
            pointer-events-none inline-block h-[22px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <p>{isNextDay ? 'True' : 'False'}</p>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Express Available
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isExpress}
                onChange={setIsExpress}
                className={`${isExpress ? 'bg-secondary-500' : 'bg-gray-700'}
          relative inline-flex h-[26px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only"> Express Available</span>
                <span
                  aria-hidden="true"
                  className={`${isExpress ? 'translate-x-8' : 'translate-x-0'}
            pointer-events-none inline-block h-[22px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <p>{isExpress ? 'True' : 'False'}</p>
            </div>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Minimum Order
            </label>
            <input
              className={`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.minimum_order
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="minimum_order"
              type="number"
              {...register('minimum_order', { required: true })}
            />
            {errors.minimum_order && (
              <p className="text-red-500 text-xs italic">
                Minimum Order is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Order Delivery Fee
            </label>
            <input
              className={`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.order_delivery_fee
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="order_delivery_fee"
              type="number"
              {...register('order_delivery_fee', { required: true })}
            />
            {errors.order_delivery_fee && (
              <p className="text-red-500 text-xs italic">
                Order Delivery Fee is required
              </p>
            )}
          </div>
          <div className="col-span-4 text-left my-4 relative">
            <p className="text-secondary-500 text-md text-lg font-semibold">
              Account Holder
            </p>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2 relative">
            <label className="block text-slate-700 font-bold mb-2">
              Account Holder Email
            </label>
            <Combobox
              value={accountHolderEmail}
              onChange={c => handleSelectedAccount(c)}
              as="div"
              className="mx-auto max-w-xl divide-y divide-gray-100 overflow-hidden"
            >
              <Combobox.Input
                className="`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus-visible:border-secondary-500"
                onChange={event => setAccountQuery(event.target.value)}
                displayValue={(sales: SalesModel) => sales.email}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 mt-6 flex border-none items-center pr-2">
                <ChevronUpDownIcon
                  className="h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="absolute bg-white shadow-md z-40 mt-1 max-h-32 md:max-h-64 w-full overflow-y-auto rounded ">
                {filteredAMs.map(sales => (
                  <Combobox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none text-xs py-2 pl-5 pr-4 ${
                        active ? 'bg-primary-500 text-white' : 'text-gray-900'
                      }`
                    }
                    key={sales.email}
                    value={sales.email}
                  >
                    {sales.email}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Account Holder
            </label>
            <input
              className={`max-w-sm appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.account_holder
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="account_holder"
              type="text"
              value={accountHolder}
              {...register('account_holder', { required: false })}
            />
          </div>

          <div className="col-span-4 text-left my-4 relative">
            <p className="text-secondary-500 text-md text-lg font-semibold">
              Credit Line Options
            </p>
          </div>
          <div className="col-span-2 md:col-span-2 relative">
            <label className="block text-slate-700 font-bold mb-2">
              Enabled Credit
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={enabledCredit}
                onChange={setEnabledCredit}
                className={`${
                  enabledCredit ? 'bg-secondary-500' : 'bg-gray-700'
                }
          relative inline-flex h-[26px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Enabled Credit</span>
                <span
                  aria-hidden="true"
                  className={`${
                    enabledCredit ? 'translate-x-8' : 'translate-x-0'
                  }
            pointer-events-none inline-block h-[22px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <p>{enabledCredit ? 'True' : 'False'}</p>
            </div>
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Credit Amount/Limit
            </label>
            <input
              className={`max-w-sm appearance-none border disabled:bg-gray-200 rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.credit_limit
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="credit_limit"
              disabled={!enabledCredit}
              type="number"
              {...register('credit_limit', {
                required: enabledCredit
                  ? 'Credit Amount/Limit is required'
                  : false,
              })}
            />
            {errors.order_delivery_fee && (
              <p className="text-red-500 text-xs italic">
                Credit Amount Limit is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Credit Cycle(day/s)
            </label>
            <input
              className={`max-w-sm appearance-none border disabled:bg-gray-200 rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.credit_cycle
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="credit_cycle"
              disabled={!enabledCredit}
              type="number"
              {...register('credit_cycle', {
                required: enabledCredit ? 'Credit Cycle is required' : false,
              })}
            />
            {errors.order_delivery_fee && (
              <p className="text-red-500 text-xs italic">
                Credit Cycle is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Payment Deadline(day/s)
            </label>
            <input
              className={`max-w-sm appearance-none border disabled:bg-gray-200 rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.payment_deadline
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="payment_deadline"
              disabled={!enabledCredit}
              type="number"
              {...register('payment_deadline', {
                required: enabledCredit
                  ? 'Payment Deadline is required'
                  : false,
              })}
            />
            {errors.order_delivery_fee && (
              <p className="text-red-500 text-xs italic">
                Payment Deadline is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Monthly Credit Limit
            </label>
            <input
              className={`max-w-sm appearance-none border disabled:bg-gray-200 rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.monthly_credit_limit
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="monthly_credit_limit"
              disabled={!enabledCredit}
              type="number"
              {...register('monthly_credit_limit', {
                required: enabledCredit
                  ? ' Monthly Credit Limit is required'
                  : false,
              })}
            />
            {errors.order_delivery_fee && (
              <p className="text-red-500 text-xs italic">
                Monthly Credit Limit is required
              </p>
            )}
          </div>
          <div className="col-span-4 md:col-span-2 mb-2">
            <label className="block text-slate-700 font-bold mb-2">
              Monthly Credit Balance
            </label>
            <input
              className={`max-w-sm appearance-none border disabled:bg-gray-200 rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                errors.montly_credit_balance
                  ? 'border border-red-500 focus:outline focus:outline-red-500'
                  : 'focus:outline focus:outline-secondary-500'
              }`}
              id="text"
              name="montly_credit_balance"
              disabled={!enabledCredit}
              type="number"
              {...register('montly_credit_balance', {
                required: enabledCredit
                  ? ' Monthly Credit Balance is required'
                  : false,
              })}
            />
            {errors.order_delivery_fee && (
              <p className="text-red-500 text-xs italic">
                Monthly Credit Balance is required
              </p>
            )}
          </div>
        </Card>
      </LoadingOverlay>
    </form>
  );
}
