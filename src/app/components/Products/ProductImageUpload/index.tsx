import React, { Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import {
  PhotoIcon,
  ArrowPathIcon,
  XCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
import ImageUploading from 'react-images-uploading';

export default function ProductImageUpload({
  show,
  handleClose,
  title,
  handleUpload,
}) {
  const [images, setImages] = useState([]);
  const maxNumber = 10;

  const onChange = imageList => {
    setImages(imageList);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images[]', image.file);
    });
    setImages([]);
    handleUpload(formData);
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
                  {title === 'Bulk Upload Product Images' ? (
                    <a
                      href="https://gp-storage.sgp1.cdn.digitaloceanspaces.com/files/sample%20bulk%20image%20upload.png"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primera-100 text-xs font-semibold bg-segunda-100 p-2 rounded-lg shadow-sm hover:bg-primera-100 hover:text-segunda-100"
                    >
                      View sample format
                    </a>
                  ) : null}
                </Dialog.Title>

                <div className="shadow-md rounded-lg">
                  <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    acceptType={['png', 'jpg', 'svg']}
                    dataURLKey="data_url"
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => (
                      // write your building UI
                      <div className="h-[50vh] p-2 mt-4 flex flex-col relative">
                        <button
                          className="h-40 border-dashed border border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm"
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          <PhotoIcon className="h-5 w-5" />
                          <p> Click or Drop here</p>
                        </button>
                        &nbsp;
                        <div className="overflow-y-auto space-y-2 pb-10">
                          {imageList.map((image, index) => (
                            <div
                              key={index}
                              className="bg-segunda-100/50 shadow-md rounded-2xl px-2 py-1 flex flex-row justify-between items-center text-primera-100"
                            >
                              <div className="flex flex-row items-center text-sm py-1">
                                <img
                                  src={image['data_url']}
                                  alt=""
                                  className="h-8 w-8 mr-2 rounded-full"
                                />
                                <p className="line-clamp-1">
                                  {image.file.name}
                                </p>
                              </div>
                              <div className="flex flex-row items-center space-x-2">
                                <button onClick={() => onImageUpdate(index)}>
                                  <ArrowPathIcon className="h-6 w-6" />
                                </button>
                                <button onClick={() => onImageRemove(index)}>
                                  <XCircleIcon className="h-6 w-6" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {images.length > 0 ? (
                          <button
                            onClick={onImageRemoveAll}
                            className="px-4 py-2 bg-gray-300 text-xs font-normal absolute bottom-0 w-full left-0 rounded-b-lg shadow-lg"
                          >
                            Remove all images
                          </button>
                        ) : null}
                      </div>
                    )}
                  </ImageUploading>
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
