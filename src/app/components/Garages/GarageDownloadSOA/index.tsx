import React, { Fragment } from 'react';
// External
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function GarageDownloadSOA({ show, handleClose, data }) {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium justify-between flex items-center leading-6 text-gray-900"
                >
                  Download SOA
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg shadow-lg bg-secondary-500 px-2 py-2 text-sm font-semibold text-primary-500 hover:bg-primary-500 hover:text-secondary-500"
                    onClick={handleClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </Dialog.Title>
                <div className="mt-2 flex flex-col items-center justify-center gap-2">
                  {data.map(file => (
                    <a
                      href={file.url}
                      target="__blank"
                      className="bg-primary-500 rounded-lg px-4 py-2 text-sm text-secondary-500"
                    >
                      {file.file_name}
                    </a>
                  ))}
                </div>

                <div className="mt-4"></div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
