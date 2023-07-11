import React from 'react';
// Components
import Pagination from 'app/components/Pagination';
// External
import { Card, CardBody, Typography } from '@material-tailwind/react';
import {
  useLoaderData,
  useSearchParams,
  useNavigation,
  useNavigate,
  Form,
  useSubmit,
} from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay-ts';
// Icons
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/solid';

export function VendorsPage() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { vendors } = (useLoaderData() as { vendors: { data } }) || {
    vendors: { data: {} },
  };
  const { search } = (useLoaderData() as { search: [] }) || {
    search: [],
  };
  const submit = useSubmit();

  const [searchParams, setSearchParams] = useSearchParams();

  const onPageChanged = page => {
    searchParams.set('page', page);
    setSearchParams(searchParams);
  };

  console.log(vendors);
  return (
    <div className="m-4 p-4">
      <Card className="my-2 rounded-xl">
        <CardBody>
          <button
            onClick={() => navigate('/vendors/create')}
            className="relative inline-block px-4 py-2 font-bold group"
          >
            <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
            <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Create New Vendor
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
              aria-label="Search Vendors"
              placeholder="Search (ex: Kwikparts)"
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
          <LoadingOverlay active={navigation.state === 'loading'} spinner>
            {/* card */}
            <table className="w-full min-w-max table-auto text-right rounded-xl overflow-x-scroll">
              <thead>
                <tr>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs text-center">
                    Action
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    ID
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Shop Name
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Mobile
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Email
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Address
                  </th>
                </tr>
              </thead>

              <tbody>
                {vendors.data &&
                  vendors.data.data.data.map(vendor => (
                    <tr
                      key={vendor.id}
                      className="even:bg-slate-50 bg-slate-200 text-gray-900 hover:bg-primary-100 hover:text-primary-500"
                    >
                      <td className="py-2 px-4">
                        <Typography variant="small" className="text-center">
                          <button
                            onClick={() => navigate(`/vendors/${vendor.id}`)}
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
                          className="text-xs text-primary-500 font-normal"
                        >
                          {vendor.id}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal"
                        >
                          {vendor.name}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal"
                        >
                          {vendor.mobile}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal"
                        >
                          {vendor.email}
                        </Typography>
                      </td>
                      <td className="py-2 px-4">
                        <Typography
                          variant="small"
                          className="text-xs text-primary-500 font-normal max-w-md"
                        >
                          {vendor.address}
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
          data={vendors.data && vendors.data.data}
          onPageChanged={onPageChanged}
          limit={30}
        />
      </div>
    </div>
  );
}
