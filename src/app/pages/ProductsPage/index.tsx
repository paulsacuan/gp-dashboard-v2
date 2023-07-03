import React, { useState } from 'react';
// Components
import Pagination from 'app/components/Pagination';
import ProductBulkUpload from 'app/components/Products/ProductBulkUpload';
import ProductImageUpload from 'app/components/Products/ProductImageUpload';
// External
import { Card, CardBody, Typography } from '@material-tailwind/react';
import LoadingOverlay from 'react-loading-overlay-ts';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  useLoaderData,
  Form,
  useSubmit,
  useNavigation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
// Icons
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  DocumentDuplicateIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  CheckBadgeIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';
// utils
import { renderStatus } from 'utils/helper';
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

export function ProductsPage() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { products } = (useLoaderData() as { products: { data } }) || {
    products: { data: {} },
  };
  const { search } = (useLoaderData() as { search: [] }) || {
    search: [],
  };

  const ImportObjects = [
    {
      title: 'Import Products',
      api: '/v2/products/import',
      fileType: '.xlsx, .xls, .csv',
      fileAppend: 'file',
      Icon: DocumentDuplicateIcon,
      sampleLink:
        'https://gp-storage.sgp1.cdn.digitaloceanspaces.com/files/IMPORT_NEW_PRODUCTS_TEMPLATE.xlsx',
    },
    {
      title: 'Import Product Price',
      api: '/v2/products/price/update',
      fileType: '.xlsx, .xls, .csv',
      fileAppend: 'file',
      Icon: CurrencyDollarIcon,
      sampleLink:
        'https://gp-storage.sgp1.cdn.digitaloceanspaces.com/files/SAMPLE%20PRICE%20UPLOAD.xlsx',
    },
    {
      title: 'Import Product Details',
      api: '/v2/products/update/bulk',
      fileType: '.xlsx, .xls, .csv',
      fileAppend: 'file',
      Icon: DocumentChartBarIcon,
      sampleLink:
        'https://gp-storage.sgp1.cdn.digitaloceanspaces.com/files/SAMPLE%20BULK%20PRODUCT%20UPDATE.xlsx',
    },
    {
      title: 'Import Product OEM',
      api: '/v2/product/oem/import',
      fileType: '.xlsx, .xls, .csv',
      fileAppend: 'file',
      Icon: CheckBadgeIcon,
      sampleLink:
        'https://gp-storage.sgp1.cdn.digitaloceanspaces.com/files/SAMPLE%20OEM%20UPLOAD.xlsx',
    },
  ];

  const [selectedImportObject, setSelectedImportObject] = useState(
    ImportObjects[0],
  );
  const submit = useSubmit();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isBulkImageOpen, setIsBulkImageOpen] = useState(false);

  const onPageChanged = page => {
    searchParams.set('page', page);
    setSearchParams(searchParams);
  };

  const handleOpenUpload = title => {
    const newObject = ImportObjects.filter(obj => obj.title === title);
    setIsBulkImportOpen(true);
    setSelectedImportObject(newObject[0]);
  };

  const handleUploadImage = async formData => {
    try {
      setIsBulkImageOpen(false);
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/v2/products/upload/bulk`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Auth.token()}`,
          },
        },
      );
      if (response.status === 200) {
        setLoading(false);
        toast.success('Product images upload success!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setIsBulkImageOpen(false);
        navigate(`/products`, { replace: true });
      } else {
        setLoading(false);
        toast.error('Product Images upload failed!', {
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
      toast.error('Something went wrong', {
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

  const handleUpload = async (data, title) => {
    try {
      const newObject = ImportObjects.filter(obj => obj.title === title);
      const response = await axios.post(`${apiUrl}${newObject[0].api}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Auth.token()}`,
        },
      });
      if (response.status === 200) {
        setLoading(false);
        toast.success('Product upload success!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setIsBulkImportOpen(false);
        navigate(`/products`, { replace: true });
      } else {
        setLoading(false);
        toast.error('Product upload failed!', {
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
      toast.error('Something went wrong.', {
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
    <div className="m-4 p-4">
      {/* card */}

      <ProductBulkUpload
        show={isBulkImportOpen}
        handleClose={() => setIsBulkImportOpen(false)}
        title={selectedImportObject.title}
        handleUpload={handleUpload}
        data={selectedImportObject}
      />
      <ProductImageUpload
        show={isBulkImageOpen}
        handleClose={() => setIsBulkImageOpen(false)}
        title="Bulk Upload Product Images"
        handleUpload={handleUploadImage}
      />
      <Card className="my-2 rounded-xl">
        <CardBody className="relative shadow-lg rounded-xl w-full flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 justify-center">
          <button
            onClick={() => navigate('/products/create')}
            className="relative inline-block px-4 py-2 font-bold group"
          >
            <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
            <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Create New Product
            </span>
          </button>
          {ImportObjects.map((data, idx) => (
            <button
              key={idx}
              onClick={() => handleOpenUpload(data.title)}
              className="relative inline-block px-4 py-2 font-bold group"
            >
              <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
              <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                <data.Icon className="h-5 w-5 mr-2 stroke-2" />
                {data.title}
              </span>
            </button>
          ))}

          <button
            onClick={() => setIsBulkImageOpen(true)}
            className="relative inline-block px-4 py-2 font-bold group"
          >
            <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
            <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
              <PhotoIcon className="h-5 w-5 mr-2 stroke-2" />
              Bulk Upload Product Images
            </span>
          </button>
        </CardBody>
      </Card>

      <div className="relative mt-10 max-w-md">
        <label htmlFor="search" className="sr-only">
          Search
        </label>

        <div className="rounded-xl mb-8">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"
            aria-hidden="true"
          >
            <MagnifyingGlassIcon
              className="mr-3 h-5 w-5 stroke-1 text-secondary-500"
              aria-hidden="true"
            />
          </div>
          <Form id="search-form" role="search">
            <input
              className="h-12 block w-full text-secondary-500 rounded-xl bg-primary-500 pl-11 focus:ring-none focus:outline focus:outline-secondary-500 sm:text-sm"
              id="search"
              aria-label="Search Products"
              placeholder="Search (ex: vortex plus engine oil)"
              type="search"
              name="search"
              defaultValue={search}
              onChange={event => {
                submit(event.currentTarget.form);
              }}
            />
          </Form>
        </div>

        {navigation.state === 'loading' && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      <Card className="rounded-xl">
        <div className="h-full rounded-xl shadow-lg overflow-auto">
          <LoadingOverlay
            active={navigation.state === 'loading' || loading === true}
            spinner
          >
            {/* card */}
            <table className="w-full min-w-max table-auto text-right rounded-xl overflow-x-scroll">
              <thead>
                <tr>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs text-center">
                    Action
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Part #
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Name
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Vendor
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Category
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    T1 Price
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Cost
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs text-center">
                    Stock
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.data &&
                  products.data.data.data.map(product => (
                    <tr
                      key={product.id}
                      className="even:bg-slate-50 bg-slate-200 text-gray-900 hover:bg-primary-100 hover:text-primary-500"
                    >
                      <td className="py-2 px-4">
                        <Typography variant="small" className="text-center">
                          <button
                            onClick={() =>
                              navigate(`/products/${product.slug}`)
                            }
                            className="relative inline-block px-4 py-2 font-bold group"
                          >
                            <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                            <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                            <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                              View
                            </span>
                          </button>
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs flex flex-row items-center justify-between gap-4 font-normal text-primary-500"
                        >
                          <img
                            src={
                              product.images.length > 0
                                ? 'https://gp-storage.sgp1.digitaloceanspaces.com/' +
                                  product.images[0].url
                                : product.brand && product.brand.image_small
                            }
                            className="h-8 w-8 rounded-full bg-white"
                            alt={product.part_number}
                          />
                          {product.part_number}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal"
                        >
                          {product.name}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal"
                        >
                          {product.vendor.name}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal"
                        >
                          {product.category.name}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal"
                        >
                          {product.tier_1}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal"
                        >
                          {product.cost}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        {renderStatus(product.stock)}
                      </td>
                      <td className="py-2 px-4">
                        {renderStatus(product.status)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </LoadingOverlay>
        </div>
      </Card>
      <div className="relative h-18">
        <Pagination
          data={products.data && products.data.data}
          onPageChanged={onPageChanged}
          limit={30}
        />
      </div>
    </div>
  );
}
