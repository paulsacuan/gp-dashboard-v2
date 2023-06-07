import React, { Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function ProductBulkUpload({
  show,
  handleClose,
  title,
  handleUpload,
  data,
}) {
  const [files, setFiles] = useState();

  const onChange = event => {
    setFiles(event.target.files[0]);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('file', files);
    handleUpload(formData, title);
    setFiles(null);
  };

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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex flex-row justify-between items-center"
                >
                  {title}
                  <a
                    href={data.sampleLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primera-100 text-xs font-semibold bg-segunda-100 p-2 rounded-lg shadow-sm hover:bg-primera-100 hover:text-segunda-100"
                  >
                    Download sample file
                  </a>
                </Dialog.Title>

                <div className="shadow-md rounded-lg h-48 mt-4 p-2">
                  <input
                    type="file"
                    onChange={onChange}
                    accept={data.fileType}
                    className="bg-segunda-100/50 shadow-md rounded-2xl px-2 py-1 w-full justify-between items-center text-primera-100"
                  />
                </div>

                <div className="mt-4 flex flex-row justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg shadow-lg bg-segunda-100 px-4 py-2 text-sm font-semibold text-primera-100 hover:bg-primera-100 hover:text-segunda-100"
                    onClick={handleClose}
                  >
                    <XCircleIcon className="h-5 w-5 mr-1" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg shadow-lg bg-primera-100 px-4 py-2 text-sm font-semibold text-segunda-100 hover:bg-segunda-100 hover:text-primera-100"
                    onClick={handleSubmit}
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    Submit
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
