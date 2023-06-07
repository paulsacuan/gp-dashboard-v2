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
        <div className="text-center my-4 bg-primera-100 rounded-2xl shadow-lg py-1 inline md:hidden">
          <p className="font-semibold text-lg md:text-md inline-flex text-segunda-100 bg">
            {product.part_number}
          </p>
        </div>
        <div className="w-full md:w-2/6 md:order-1 grow-0 space-y-2">
          <Card className="hover:shadow-md p-4">
            <p className="text-center bg-primera-100 text-segunda-100 py-1 my-4 px-4 rounded-xl text-xs">
              Actions
            </p>
            <div className="my-2 space-y-2">
              <button
                className="px-4 py-2 w-full bg-primera-100 text-segunda-100 rounded-md text-xs font-semibold shadow-md inline-flex items-center hover:bg-segunda-100 hover:text-primera-100"
                type="button"
                onClick={() => {
                  handleImageUpload('Upload Product Image');
                }}
              >
                <PhotoIcon className="h-4 w-4 mr-2" />
                Upload Image
              </button>
              <button
                className="px-4 py-2 w-full bg-primera-100 text-segunda-100 rounded-md text-xs font-semibold shadow-md inline-flex items-center hover:bg-segunda-100 hover:text-primera-100"
                type="button"
                onClick={() => {
                  handleHistory();
                }}
              >
                <NewspaperIcon className="h-4 w-4 mr-2" />
                View History
              </button>
              <button
                className="px-4 py-2 w-full bg-primera-100 text-segunda-100 rounded-md text-xs font-semibold shadow-md inline-flex items-center hover:bg-segunda-100 hover:text-primera-100"
                type="button"
                onClick={() => {
                  setIsOEMOpen(true);
                }}
              >
                <ListBulletIcon className="h-4 w-4 mr-2" />
                View OEMs
              </button>
              <button
                className="px-4 py-2 w-full bg-primera-100 text-segunda-100 rounded-md text-xs font-semibold shadow-md inline-flex items-center hover:bg-segunda-100 hover:text-primera-100"
                type="button"
                onClick={() => {
                  navigate(`/products/${product.slug}/compatibilities`);
                }}
              >
                <QueueListIcon className="h-4 w-4 mr-2" />
                View Compatibilities
              </button>
              <button
                className="px-4 py-2 w-full bg-primera-100 text-segunda-100 rounded-md text-xs font-semibold shadow-md inline-flex items-center hover:bg-segunda-100 hover:text-primera-100"
                type="button"
                onClick={() => {
                  navigate(`/products/${product.slug}/wholesale-price`);
                }}
              >
                <BanknotesIcon className="h-4 w-4 mr-2" />
                View Wholesale Prices
              </button>
            </div>
            <div className="flex flex-row justify-between gap-2 mt-4">
              <button
                className="px-4 py-2 bg-segunda-100 text-primera-100 rounded-md text-xs font-semibold shadow-md inline-flex items-center hover:bg-primera-100 hover:text-segunda-100"
                type="button"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
                Back
              </button>

              <button
                className="px-4 py-2 bg-primera-100 text-segunda-100 flex items-center rounded-md text-xs font-semibold shadow-md hover:bg-segunda-100 hover:text-primera-100"
                onClick={() => {
                  navigate(`/products/${product.slug}/update`);
                }}
              >
                <PencilSquareIcon className="h-4 w-4 mr-1" />
                Update
              </button>
            </div>
          </Card>
          <div className="p-2 md:p-4">
            <span className="text-sm">
              Brand
              <span className="flex flex-row justify-between items-center">
                <b className="text-primera-100 flex items-center">
                  <CubeIcon className="h-4 w-4 ml-2 mr-1 text-segunda-100" />
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
              Vendor
              <span className="flex flex-row items-center">
                <BuildingStorefrontIcon className="h-4 w-4 ml-2 mr-1 text-segunda-100" />
                <b className="text-primera-100">{product.vendor.name}</b>
              </span>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            <p className="px-4 py-1 my-4 text-xs text-segunda-100 font-normal rounded-xl bg-primera-100 w-full text-center">
              Images
            </p>
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
                      className="bg-gray-200"
                    />
                  ))}
                </Carousel>
              </div>
            ) : (
              <div className="h-44 md:h-64 bg-gray-200 flex flex-row justify-center items-center p-4 mt-4 rounded-lg w-full">
                <p className="text-center py-2">No image found 😔</p>
              </div>
            )}
          </div>
        </div>
        {/* card */}
        <Card className="flex-1 max-w-full p-4 grid grid-cols-4 gap-2 text-xs hover:shadow-md">
          <div className="col-span-4 text-center my-4 bg-primera-100 rounded-xl py-1">
            <p className="font-normal text-xs md:text-md inline-flex text-segunda-100 bg">
              Product Details
            </p>
          </div>
          <div className="col-span-4">
            <label className="block text-gray-700 font-bold mb-2">Part #</label>
            <input
              className="shadow text-center bg-gray-200 appearance-none border rounded w-full py-2 text-primera-100 font-bold leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.part_number}
            />
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">ID</label>
            <input
              className="shadow text-right bg-gray-200 max-w-sm appearance-none border rounded w-full py-2 pprimera-100-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.id}
            />
          </div>
          <div className="col-span-4 md:col-span-3">
            <label className="block text-gray-700 font-bold mb-2">Name</label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.name}
            />
          </div>
          <hr className="col-span-4 my-4" />
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">
              Category
            </label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.category.name}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">Brand</label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.brand.name}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">Vendor</label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.vendor.name}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">
              Garage Type
            </label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={renderProductGarageType(product.stock)}
            />
          </div>
          <hr className="col-span-4 my-4" />
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">Stock</label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={renderStatus(product.stock)}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">Status</label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={renderStatus(product.status)}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">
              B2C Availability
            </label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={renderProductAvailability(product.btc_availability)}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-bold mb-2">Promo</label>
            <input
              className="shadow text-right bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={renderStatus(product.is_promo)}
            />
          </div>
          {/* <hr className="col-span-4 my-4" /> */}
          <div className="col-span-4 text-center my-4 bg-primera-100 rounded-xl py-1">
            <p className="font-normal text-xs md:text-md inline-flex text-segunda-100 bg">
              Product Descriptions
            </p>
          </div>
          <div className="col-span-4">
            <label className="block text-gray-700 font-bold mb-2">
              Short Description
            </label>
            <input
              className="shadow text-left bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.short_description}
            />
          </div>
          <div className="col-span-4">
            <label className="block text-gray-700 font-bold mb-2">
              Long Description
            </label>
            <input
              className="shadow text-left bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.long_description}
            />
          </div>
          <div className="col-span-4 text-center my-4 bg-primera-100 rounded-xl py-1">
            <p className="font-normal text-xs md:text-md inline-flex text-segunda-100 bg">
              Price & Cost Details (&#8369;)
            </p>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Cost</label>
            <input
              className="shadow bg-gray-200 text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.cost}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Price (B2C)
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.price}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 1</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_1}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 2</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_2}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 3</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_3}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 4</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_4}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 5</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_5}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 6</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_6}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 7</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_7}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 8</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_8}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Tier 9</label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_9}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 10
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_10}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 11
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_11}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 12
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_12}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 13
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_13}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 14
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_14}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 15
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_15}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 16
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_16}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 17
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_17}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 18
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_18}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 19
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              readOnly
              value={product.tier_19}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Tier 20
            </label>
            <input
              className="shadow text-right appearance-none border rounded w-full py-2 px-3 text-primera-100 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
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
