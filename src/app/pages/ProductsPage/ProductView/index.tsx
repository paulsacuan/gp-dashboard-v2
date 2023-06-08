import React, { useState } from 'react';
// Components
import ProductImageUpload from 'app/components/Products/ProductImageUpload';
import ProductHistory from 'app/components/Products/ProductHistory';
import ProductOEMs from 'app/components/Products/ProductOEM';

// External
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { Card, Carousel } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
import axios from 'axios';
// Icons
import {
  BuildingStorefrontIcon,
  CubeIcon,
  PencilSquareIcon,
  ArrowUturnLeftIcon,
  PhotoIcon,
  NewspaperIcon,
  QueueListIcon,
  ListBulletIcon,
  BanknotesIcon,
} from '@heroicons/react/24/solid';
// utils
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';
import {
  renderStatus,
  renderProductGarageType,
  renderProductAvailability,
} from 'utils/helper';

export default function Product() {
  const [loading, setLoading] = useState(false);
  const { product } = (useLoaderData() as { product }) || {
    product: { data: {} },
  };
  console.log(product);
  const navigate = useNavigate();
  const navigation = useNavigation();

  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOEMOpen, setIsOEMOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);
  const [productHistory, setProductHistory] = useState(null);
  const productOEM = product.oem !== null ? product.oem : [];
  const [currentHistoryUrl, setCurrentHistoryUrl] = useState(null);

  const handleImageUpload = title => {
    setIsImageUploadOpen(true);
    setModalTitle(title);
  };

  const handleHistory = async (page = null) => {
    const link = page
      ? `${apiUrl}/v2/products/history/${product.id}?page=${page}`
      : `${apiUrl}/v2/products/history/${product.id}`;

    // if true no need to fetch product history again
    if (currentHistoryUrl && currentHistoryUrl.toString() === link.toString()) {
      setIsHistoryOpen(true);
      return;
    }
    const response = await axios.get(link, {
      headers: {
        Authorization: `Bearer ${Auth.token()}`,
      },
    });
    if (response) {
      setProductHistory(response.data);
      setCurrentHistoryUrl(link);
      setIsHistoryOpen(true);
    } else {
      setIsHistoryOpen(true);
    }
  };

  const handleUploadImage = async formData => {
    try {
      setIsImageUploadOpen(false);
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/v2/products/images/${product.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Auth.token()}`,
          },
        },
      );
      if (response.status === 200) {
        setLoading(false);
        toast.success('Product image upload success!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate(`/products/${product.slug}`, { replace: true });
      } else {
        setLoading(false);
        toast.error('Product Image upload failed!', {
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
      <ProductImageUpload
        show={isImageUploadOpen}
        handleClose={() => setIsImageUploadOpen(false)}
        title={modalTitle}
        handleUpload={handleUploadImage}
      />
      <ProductHistory
        show={isHistoryOpen}
        data={productHistory}
        handleClose={() => setIsHistoryOpen(false)}
        handlePagination={handleHistory}
      />
      <ProductOEMs
        show={isOEMOpen}
        data={productOEM}
        handleClose={() => setIsOEMOpen(false)}
      />
      <LoadingOverlay
        active={navigation.state === 'loading' || loading === true}
        className="m-4 p-4 flex flex-col md:flex-row gap-2"
      >
        <div className="text-center my-4 bg-primary-500 rounded-2xl shadow-lg py-1 inline md:hidden">
          <p className="font-semibold text-lg md:text-md inline-flex text-secondary-500">
            {product.part_number}
          </p>
        </div>
        <div className="w-full md:w-2/6 md:order-1 grow-0 space-y-2">
          <Card className="hover:shadow-md p-4">
            <div className="my-2 space-y-3">
              <button
                onClick={() => {
                  handleImageUpload('Upload Product Image');
                }}
                className="relative inline-block px-4 py-2 font-bold group w-full"
              >
                <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                  <PhotoIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </span>
              </button>

              <button
                onClick={() => {
                  handleHistory('Upload Product Image');
                }}
                className="relative inline-block px-4 py-2 font-bold group w-full"
              >
                <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                  <NewspaperIcon className="h-4 w-4 mr-2" />
                  View History
                </span>
              </button>

              <button
                onClick={() => {
                  setIsOEMOpen(true);
                }}
                className="relative inline-block px-4 py-2 font-bold group w-full"
              >
                <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                  <ListBulletIcon className="h-4 w-4 mr-2" />
                  View OEMs
                </span>
              </button>

              <button
                onClick={() => {
                  navigate(`/products/${product.slug}/compatibilities`);
                }}
                className="relative inline-block px-4 py-2 font-bold group w-full"
              >
                <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                  <QueueListIcon className="h-4 w-4 mr-2" />
                  View Compatibilities
                </span>
              </button>

              <button
                onClick={() => {
                  navigate(`/products/${product.slug}/wholesale-price`);
                }}
                className="relative inline-block px-4 py-2 font-bold group w-full"
              >
                <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                  <BanknotesIcon className="h-4 w-4 mr-2" />
                  View Wholesale Prices
                </span>
              </button>
            </div>
            <div className="flex flex-row justify-between gap-2 mt-4">
              <button
                onClick={() => {
                  navigate(-1);
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
                  navigate(`/products/${product.slug}/update`);
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
          <div className="p-4 bg-white rounded-xl shadow-lg space-y-2">
            <span className="text-sm bg">
              <p className="text-slate-400 text-xs"> Brand</p>
              <span className="flex flex-row justify-between items-center">
                <b className="text-primary-500 flex items-center">
                  <CubeIcon className="h-4 w-4 ml-2 mr-1 text-secondary-500" />
                  {product.brand.name}
                </b>
                <img
                  src={product.brand.image_medium}
                  alt={product.brand.name}
                  className="w-10 h-10 rounded-full bg-white"
                />
              </span>
            </span>
            <hr className="py-2" />
            <span className="text-sm">
              <p className="text-slate-400 text-xs"> Vendor</p>
              <span className="flex flex-row items-center">
                <BuildingStorefrontIcon className="h-4 w-4 ml-2 mr-1 text-secondary-500" />
                <b className="text-primary-500">{product.vendor.name}</b>
              </span>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            {product && product.images.length > 0 ? (
              <div className="p-2 md:p-4">
                <Carousel className="rounded-xl">
                  {product.images.map(p => (
                    <img
                      key={p.id}
                      src={
                        'https://gp-storage.sgp1.digitaloceanspaces.com/' +
                        p.url
                      }
                      alt={p.url}
                      className="bg-slate-200"
                    />
                  ))}
                </Carousel>
              </div>
            ) : (
              <div className="h-44 md:h-64 bg-white flex flex-row justify-center items-center p-4 shadow-lg rounded-lg w-full">
                <p className="text-center text-xs text-slate-400 py-2">
                  No image found 😔
                </p>
              </div>
            )}
          </div>
        </div>
        {/* card */}
        <Card className="flex-1 max-w-full p-4 grid grid-cols-4 gap-2 text-xs hover:shadow-md">
          <div className="col-span-4">
            <label className="block text-slate-700 font-bold mb-2">
              Part #
            </label>
            <input
              className="text-center bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 font-bold leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.part_number}
            />
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">ID</label>
            <input
              className="text-right bg-slate-200 max-w-sm appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.id}
            />
          </div>
          <div className="col-span-4 md:col-span-3">
            <label className="block text-slate-700 font-bold mb-2">Name</label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.name}
            />
          </div>
          <hr className="col-span-4 my-4" />
          <div className="col-span-2 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">
              Category
            </label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.category.name}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">Brand</label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.brand.name}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">
              Vendor
            </label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.vendor.name}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">
              Garage Type
            </label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={renderProductGarageType(product.stock)}
            />
          </div>
          <hr className="col-span-4 my-4" />
          <div className="col-span-2 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">Stock</label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={renderStatus(product.stock)}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">
              Status
            </label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={renderStatus(product.status)}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">
              B2C Availability
            </label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={renderProductAvailability(product.btc_availability)}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-slate-700 font-bold mb-2">Promo</label>
            <input
              className="text-right bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={renderStatus(product.is_promo)}
            />
          </div>
          <hr className="col-span-4 my-4" />
          <div className="col-span-4">
            <label className="block text-slate-700 font-bold mb-2">
              Short Description
            </label>
            <input
              className="text-left bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.short_description}
            />
          </div>
          <div className="col-span-4">
            <label className="block text-slate-700 font-bold mb-2">
              Long Description
            </label>
            <input
              className="text-left bg-slate-200 appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.long_description}
            />
          </div>
          <hr className="col-span-4 my-4" />
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">Cost</label>
            <input
              className="bg-slate-200 text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.cost}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Price (B2C)
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.price}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 1
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_1}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 2
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_2}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 3
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_3}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 4
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_4}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 5
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_5}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 6
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_6}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 7
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_7}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 8
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_8}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 9
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_9}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 10
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_10}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 11
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_11}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 12
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_12}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 13
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_13}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 14
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_14}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 15
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_15}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 16
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_16}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 17
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_17}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 18
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_18}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 19
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_19}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-slate-700 font-bold mb-2">
              Tier 20
            </label>
            <input
              className="text-right appearance-none rounded-xl px-2 w-full py-2 text-primary-500 bg-slate-200 leading-tight"
              id="text"
              type="text"
              readOnly
              value={product.tier_20}
            />
          </div>
        </Card>
      </LoadingOverlay>
    </>
  );
}
