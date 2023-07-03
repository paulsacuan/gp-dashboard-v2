import React, { useState, useMemo } from 'react';
// External
import { useForm } from 'react-hook-form';
import LoadingOverlay from 'react-loading-overlay-ts';
import { useLoaderData, useNavigation, useNavigate } from 'react-router-dom';
import { Card } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import axios from 'axios';
// Icons
import {
  PencilSquareIcon,
  ArrowUturnLeftIcon,
  CreditCardIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
// utils
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';
import {
  renderGarageType,
  renderStatus,
  renderCurrency,
  renderDate,
} from 'utils/helper';

export default function GarageView() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { garage } = (useLoaderData() as { garage }) || {
    garage: { data: {} },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return garage.approver;
    }, [garage.approver]),
  });

  const [editApprover, setEditApprover] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${apiUrl}/v2/garage/approver/${data.garage_id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.token()}`,
          },
        },
      );

      if (response.status === 200) {
        setLoading(false);
        setEditApprover(false);
        toast.success('Approver Email Updated!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate(`/garages/${data.garage_id}`, { replace: true });
      } else {
        setLoading(false);
        setEditApprover(false);
        toast.error('Approver email update failed!', {
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
      setEditApprover(false);
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
    <LoadingOverlay
      active={navigation.state === 'loading' || loading === true}
      className="m-4 p-4 flex flex-col md:flex-row gap-2"
    >
      <div className="text-center my-4 bg-primary-500 rounded-2xl shadow-lg py-1 inline md:hidden">
        <p className="font-semibold text-lg md:text-md inline-flex text-secondary-500">
          {garage.shop_name}
        </p>
      </div>

      <div className="w-full md:w-2/6 md:order-1 grow-0 space-y-2">
        <Card className="hover:shadow-md p-4">
          <div className="my-2 space-y-3">
            <button
              onClick={() => {
                navigate(`/garages/${garage.id}/users`);
              }}
              className="relative inline-block px-4 py-2 font-bold group w-full"
            >
              <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
              <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                <UserGroupIcon className="h-4 w-4 mr-2" />
                View Garage Users
              </span>
            </button>
            <button
              onClick={() => {
                navigate(`/garages/${garage.id}/billing`);
              }}
              className="relative inline-block px-4 py-2 font-bold group w-full"
            >
              <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
              <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                <CreditCardIcon className="h-4 w-4 mr-2" />
                View Garage Billings
              </span>
            </button>
          </div>
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
                navigate(`/garages/${garage.id}/update`);
              }}
              className="relative inline-block px-4 py-2 font-bold group w-full max-w-[8rem]"
            >
              <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
              <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                <PencilSquareIcon className="h-4 w-4 mr-1" />
                Update
              </span>
            </button>
          </div>
        </Card>
        <Card className="hover:shadow-md p-4">
          <p className="text-sm text-secondary-500 font-semibold mb-2">
            Garage Credit
          </p>
          <div className="space-y-1 text-primary-400 mb-4">
            <span className="flex items-center text-sm justify-between">
              <p className="font-light">Billed Balance </p>
              <p>{renderCurrency(garage.credit.billed_balance)}</p>
            </span>
            <span className="flex items-center text-sm justify-between">
              <p className="font-light">Outstanding Balance </p>
              <p>{renderCurrency(garage.credit.outstanding_balance)}</p>
            </span>
            <span className="flex items-center text-sm justify-between">
              <p className="font-light">Payment Due date </p>
              <p>{renderDate(garage.credit.payment_duedate)}</p>
            </span>
          </div>
          <button
            onClick={() => {
              navigate(`/garages/${garage.id}/billing`);
            }}
            className="relative inline-block px-4 py-2 font-bold group w-full"
          >
            <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
            <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              View Garage Billings
            </span>
          </button>
        </Card>
        <Card className="hover:shadow-md p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {editApprover ? (
              <div className="flex gap-2 items-center mb-2 text-xs font-semibold justify-between">
                <div className="flex items-center gap-2 justify-center text-sm">
                  <p className="font-semibold text-secondary-500">Approver:</p>
                  <p
                    className={`${
                      garage.is_approver ? 'text-primary-500' : 'text-red-600'
                    }`}
                  >
                    {garage.is_approver ? `✅` : `❌`}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditApprover(false)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-secondary-500 text-primary-500 px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center mb-2 text-xs font-semibold justify-between">
                <div className="flex items-center gap-2 justify-center text-sm">
                  <p className="font-semibold text-secondary-500">Approver:</p>
                  <p
                    className={`${
                      garage.is_approver ? 'text-primary-500' : 'text-red-600'
                    }`}
                  >
                    {garage.is_approver ? `✅` : `❌`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditApprover(!editApprover)}
                  className="self-end bg-primary-500 text-secondary-500 py-2 px-4 rounded-md flex items-center"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-1" />
                  Update Approver Email
                </button>
              </div>
            )}

            <div className="text-xs">
              <div className="col-span-4 md:col-span-1 mt-2">
                <label className="block text-slate-700 font-bold mb-2">
                  Primary Approver
                </label>
                <input
                  className="text-left disabled:text-primary-100 disabled:bg-gray-200 bg-slate-100 border border-slate-200 max-w-sm appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
                  id="text"
                  type="text"
                  name="primary_approver_email"
                  disabled={!editApprover}
                  {...register('primary_approver_email', {
                    required: true,
                  })}
                />
                {errors.shop_name && (
                  <p className="text-red-500 text-xs italic">
                    Primary Approverl Email is required
                  </p>
                )}
              </div>
              <div className="col-span-4 md:col-span-1 mt-4">
                <label className="block text-slate-700 font-bold mb-2">
                  Secondary Approver
                </label>
                <input
                  className="text-left disabled:text-primary-100 disabled:bg-gray-200 bg-slate-100 border border-slate-200 max-w-sm appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
                  id="text"
                  type="text"
                  name="secondary_approver_email"
                  disabled={!editApprover}
                  {...register('secondary_approver_email', {
                    required: false,
                  })}
                />
              </div>
            </div>
          </form>
        </Card>
      </div>
      <Card className="flex-1 max-w-full p-4 grid grid-cols-4 gap-2 text-xs hover:shadow-md">
        <div className="col-span-4 text-left my-4 relative">
          <p className="text-secondary-500 text-md text-lg font-semibold">
            Garage Details
          </p>
        </div>
        <div className="col-span-4 md:col-span-1">
          <label className="block text-slate-700 font-bold mb-2">ID</label>
          <input
            className="text-right bg-slate-100 border border-slate-200 max-w-sm appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.id}
          />
        </div>

        <div className="col-span-4 md:col-span-3">
          <label className="block text-slate-700 font-bold mb-2">
            Shop Name
          </label>
          <input
            className="text-center bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 font-bold leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.shop_name}
          />
        </div>
        <div className="col-span-4 md:col-span-1">
          <label className="block text-slate-700 font-bold mb-2">
            Customer Tier
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={`Tier ${garage.tier}`}
          />
        </div>

        <div className="col-span-4 md:col-span-3">
          <label className="block text-slate-700 font-bold mb-2">
            Company Name
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.company_name}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">Email</label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.email}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">Mobile</label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.mobile}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">DTI/TIN</label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.dti_tin_no}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Garage Type
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={renderGarageType(garage.garage_type)}
          />
        </div>
        <div className="col-span-4 text-left my-4 relative">
          <p className="text-secondary-500 text-md text-lg font-semibold">
            Address
          </p>
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Province
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.province}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">City</label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.city}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Barangay
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.barangay}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">Postal</label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.postal}
          />
        </div>
        <div className="col-span-4">
          <label className="block text-slate-700 font-bold mb-2">Address</label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.address}
          />
        </div>
        <div className="col-span-4 text-left my-4 relative">
          <p className="text-secondary-500 text-md text-lg font-semibold">
            Approver Details
          </p>
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Needs Approver
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={renderStatus(garage.is_approver)}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Single Approver
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={renderStatus(garage.is_single_approver)}
          />
        </div>
        <div className="col-span-4 text-left my-4 relative">
          <p className="text-secondary-500 text-md text-lg font-semibold">
            Delivery Details
          </p>
        </div>

        <div className="col-span-4">
          <label className="block text-slate-700 font-bold mb-2">
            Delivery Day
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.delivery_day}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Minimum Order
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.minimum_order}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Delivery Fee
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.order_delivery_fee}
          />
        </div>
        <div className="col-span-4 md:col-span-1">
          <label className="block text-slate-700 font-bold mb-2">
            Is Provincial
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={renderStatus(garage.is_provincial)}
          />
        </div>
        <div className="col-span-4 md:col-span-1">
          <label className="block text-slate-700 font-bold mb-2">
            Is COD Available
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={renderStatus(garage.is_cod_available)}
          />
        </div>
        <div className="col-span-4 md:col-span-1">
          <label className="block text-slate-700 font-bold mb-2">
            Is Next day Available
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={renderStatus(garage.is_next_day_available)}
          />
        </div>
        <div className="col-span-4 md:col-span-1">
          <label className="block text-slate-700 font-bold mb-2">
            Is Express Available
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={renderStatus(garage.is_express_available)}
          />
        </div>
        <div className="col-span-4 text-left my-4 relative">
          <p className="text-secondary-500 text-md text-lg font-semibold">
            Account Holder Details
          </p>
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Account Holder
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.account_holder}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Account Holder Email
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.sales_manager_email}
          />
        </div>
        <div className="col-span-4 text-left my-4 relative">
          <p className="text-secondary-500 text-md text-lg font-semibold">
            Credit Line Details
          </p>
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Is Credit Enabled
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={renderStatus(garage.credit.enabled_credit)}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Available Credit
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.credit.available_credit}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Credit Cycle(day/s)*
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.credit.credit_cycle}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Payment Deadline(day/s)*
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.credit.payment_deadline}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Monthly Credit Limit
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.monthly_credit_limit}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-slate-700 font-bold mb-2">
            Monthly Credit Balance
          </label>
          <input
            className="text-right bg-slate-100 border border-slate-200 appearance-none rounded-md px-2 w-full py-2 text-primary-500 leading-tight"
            id="text"
            type="text"
            readOnly
            value={garage.montly_credit_balance}
          />
        </div>
      </Card>
    </LoadingOverlay>
  );
}
