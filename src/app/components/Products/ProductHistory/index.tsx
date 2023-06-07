import React, { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { Typography } from '@material-tailwind/react';
import Pagination from '../../Pagination';

export default function History({ show, data, handleClose, handlePagination }) {
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
              <Dialog.Panel className="w-full md:max-w-[50vw] transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-sm font-medium leading-6 text-gray-900"
                >
                  Product History
                </Dialog.Title>
                <div className="mt-2 w-full overflow-x-scroll rounded-xl shadow-sm">
                  {data && data.data.data.length > 0 ? (
                    <table className="w-full md:w-[50vw] table-auto text-right overflow-x-scroll">
                      <thead>
                        <tr>
                          <th className="border-b border-blue-gray-100 bg-primera-100 py-4 px-4 font-semibold text-segunda-100 leading-none text-left text-xs">
                            Comment
                          </th>
                          <th className="border-b border-blue-gray-100 bg-primera-100 py-4 px-4 font-semibold text-segunda-100 leading-none text-xs">
                            Changes
                          </th>
                          <th className="border-b border-blue-gray-100 bg-primera-100 py-4 px-4 font-semibold text-segunda-100 leading-none text-xs">
                            Updated By
                          </th>
                          <th className="border-b border-blue-gray-100 bg-primera-100 py-4 px-4 font-semibold text-segunda-100 leading-none text-xs">
                            Date
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data &&
                          data.data.data.map(history => (
                            <tr
                              key={history.id}
                              className="even:bg-blue-gray-100/50 hover:bg-segunda-200/20"
                            >
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs text-left"
                                >
                                  {history.changes}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {history.comment}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {history.user.email}
                                </Typography>
                              </td>
                              <td className="py-2 px-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {new Date(history.created_at).toDateString()}
                                </Typography>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-row items-center justify-center p-4 text-xs text-gray-500">
                      <p>No history found for this product 😔</p>
                    </div>
                  )}
                </div>
                <Pagination
                  data={data && data.data}
                  onPageChanged={handlePagination}
                  limit={30}
                />
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
