import React, { useState } from 'react';
// Components
import Pagination from 'app/components/Pagination';
import ProductBulkUpload from 'app/components/Products/ProductBulkUpload';
import ProductImageUpload from 'app/components/Products/ProductImageUpload';
// External
import { Card, CardBody, Typography, Chip } from '@material-tailwind/react';
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
  Link,
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
    <div className="bg-white m-4 p-4">
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
      <Card>
        <CardBody className="relative shadow-sm w-full text-xs flex flex-col space-y-1 lg:space-y-0 lg:flex-row lg:space-x-1 justify-center">
          <Link
            to={'create'}
            className="shadow-md px-4 py-2 rounded-xl bg-primera-100 text-segunda-100 font-semibold text-center hover:bg-segunda-100 hover:text-primera-100"
          >
            <button className="flex items-center">
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Create New Product
            </button>
          </Link>

          {ImportObjects.map(data => (
            <button
              onClick={() => handleOpenUpload(data.title)}
              className="flex items-center shadow-md px-4 py-2 rounded-xl bg-primera-100 text-segunda-100 font-semibold text-center hover:bg-segunda-100 hover:text-primera-100"
            >
              <data.Icon className="h-5 w-5 mr-2 stroke-2" />
              {data.title}
            </button>
          ))}
          <button
            onClick={() => setIsBulkImageOpen(true)}
            className="flex items-center shadow-md px-4 py-2 rounded-xl bg-primera-100 text-segunda-100 font-semibold text-center hover:bg-segunda-100 hover:text-primera-100"
          >
            <PhotoIcon className="h-5 w-5 mr-2 stroke-2" />
            Bulk Upload Product Images
          </button>
        </CardBody>
      </Card>
      <div className="relative mt-5 max-w-md">
        <label htmlFor="search" className="sr-only">
          Search
        </label>

        <div className="rounded-xl shadow-md mb-8">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            aria-hidden="true"
          >
            <MagnifyingGlassIcon
              className="mr-3 h-5 w-5 stroke-1 text-segunda-100"
              aria-hidden="true"
            />
          </div>
          <Form id="search-form" role="search">
            <input
              className="h-12 block w-full text-segunda-100 rounded-xl bg-primera-100 pl-9 focus:ring-none focus:outline focus:outline-segunda-100 sm:text-sm"
              id="search"
              aria-label="Search Products"
              placeholder="Search"
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

      <Card>
        <div className="h-full rounded-lg overflow-auto">
          <LoadingOverlay
            active={navigation.state === 'loading' || loading === true}
            spinner
          >
            {/* card */}
            <table className="w-full min-w-max table-auto text-right overflow-x-scroll">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-left text-xs">
                    Part #
                  </th>
                  <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs">
                    Name
                  </th>
                  <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs">
                    T1 Price
                  </th>
                  <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs">
                    Cost
                  </th>
                  <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs text-center">
                    Stock
                  </th>
                  <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs text-center">
                    Status
                  </th>
                  <th className="border-b border-blue-gray-100 bg-primera-100 py-6 px-4 font-semibold text-segunda-100 leading-none text-xs text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.data &&
                  products.data.data.data.map(product => (
                    <tr
                      key={product.id}
                      className="even:bg-blue-gray-100/50 hover:bg-segunda-200/20"
                    >
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-left text-xs flex flex-row items-center gap-4"
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
                          color="blue-gray"
                          className="font-normal text-xs"
                        >
                          {product.name}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xs"
                        >
                          {product.tier_1}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xs"
                        >
                          {product.cost}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Chip
                          variant="ghost"
                          size="sm"
                          className="text-center"
                          value={renderStatus(product.stock)}
                          color={
                            renderStatus(product.stock) === '✅'
                              ? 'green'
                              : 'red'
                          }
                        />
                      </td>
                      <td className="py-2 px-4">
                        <Chip
                          variant="ghost"
                          size="sm"
                          className="text-center"
                          value={renderStatus(product.status)}
                          color={
                            renderStatus(product.status) === '✅'
                              ? 'green'
                              : 'red'
                          }
                        />
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-center"
                        >
                          <button
                            className="bg-primera-100 text-xs font-semibold shadow-md text-segunda-100 px-4 py-2 rounded-lg hover:bg-segunda-100 hover:text-primera-100"
                            onClick={() =>
                              navigate(`/products/${product.slug}`)
                            }
                          >
                            View details
                          </button>
                        </Typography>
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
