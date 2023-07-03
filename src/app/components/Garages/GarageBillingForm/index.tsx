import React, { Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// External
import { Transition, Dialog } from '@headlessui/react';
import {
  XMarkIcon,
  XCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';

export default function GarageBillingForm({
  show,
  handleClose,
  data,
  handlePayment,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return data;
    }, [data]),
  });

  useEffect(() => {
    // const newData = data;
    // newData.billed_balance =
    //   Math.trunc(data.billed_balance * Math.pow(10, 2)) / Math.pow(10, 2);
    reset(data);
  }, [data, reset]);

  const onClose = () => {
    reset();
    handleClose();
  };

  const onSubmit = data => {
    data.status = 'paid';
    handlePayment(data);
  };
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium justify-between flex items-center leading-6 text-gray-900"
                >
                  Garage Credit Payment
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg shadow-lg bg-secondary-500 px-2 py-2 text-sm font-semibold text-primary-500 hover:bg-primary-500 hover:text-secondary-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-2 flex flex-row items-center justify-center gap-2">
                    <div>
                      <label>Invoice #</label>
                      <input
                        className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                          errors.inv
                            ? 'border border-red-500 focus:outline focus:outline-red-500'
                            : 'focus:outline focus:outline-secondary-500'
                        }`}
                        type="text"
                        name="inv"
                        readOnly
                        {...register('inv', { required: true })}
                      />
                    </div>
                    <div>
                      <label>Billed amount</label>
                      <input
                        className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                          errors.billed_balance
                            ? 'border border-red-500 focus:outline focus:outline-red-500'
                            : 'focus:outline focus:outline-secondary-500'
                        }`}
                        type="number"
                        readOnly
                        name="billed_balance"
                        pattern="^\d*(\.\d{0,2})?$"
                        {...register('billed_balance', { required: true })}
                      />
                    </div>
                    <div>
                      <label>Amount Paid</label>
                      <input
                        className={`appearance-none border rounded-md border-slate-200 bg-slate-50 w-full py-2 px-3 text-slate-700 leading-tight ${
                          errors.amount_paid
                            ? 'border border-red-500 focus:outline focus:outline-red-500'
                            : 'focus:outline focus:outline-secondary-500'
                        }`}
                        type="number"
                        name="amount_paid"
                        step="any"
                        {...register('amount_paid', { required: true })}
                      />
                      {errors.amount_paid && (
                        <p className="text-red-500 text-xs italic">
                          Amount Paid is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex gap-2 justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg shadow-lg bg-segunda-100 px-4 py-2 text-sm font-semibold text-primera-100 hover:bg-primera-100 hover:text-segunda-100"
                      onClick={onClose}
                    >
                      <XCircleIcon className="h-5 w-5 mr-1" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg shadow-lg bg-primera-100 px-4 py-2 text-sm font-semibold text-segunda-100 hover:bg-segunda-100 hover:text-primera-100"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      Submit
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
