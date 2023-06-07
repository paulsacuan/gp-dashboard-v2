import React, { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { Typography } from '@material-tailwind/react';

export default function OEMs({ show, data, handleClose }) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
              <Dialog.Panel className="w-full md:max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-sm font-medium leading-6 text-gray-900"
                >
                  Product OEMs
                </Dialog.Title>
                <div className="mt-2 w-full overflow-x-scroll rounded-xl shadow-sm">
                  {data.length > 0 ? (
                    <table className="w-full max-w-md table-auto text-right overflow-x-scroll">
                      <thead>
                        <tr>
                          <th className="border-b border-blue-gray-100 bg-primera-100 py-4 px-4 font-semibold text-segunda-100 leading-none text-left text-xs">
                            Product ID
                          </th>
                          <th className="border-b border-blue-gray-100 bg-primera-100 py-4 px-4 font-semibold text-segunda-100 leading-none text-xs">
                            OEM #
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data &&
                          data.map(oem => (
                            <tr
                              key={oem.id}
                              className="even:bg-blue-gray-100/50 hover:bg-segunda-200/20"
                            >
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs text-left"
                                >
                                  {oem.product_id}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {oem.oem_number}
                                </Typography>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-row items-center justify-center p-4 text-xs text-gray-500">
                      <p>No OEM found for this product 😔</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg shadow-lg bg-segunda-100 px-4 py-2 text-sm font-semibold text-primera-100 hover:bg-primera-100 hover:text-segunda-100"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
