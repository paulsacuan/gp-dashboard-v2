import React from 'react';
// External
import {
  useLoaderData,
  useNavigation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay-ts';
import { Card, Typography, Tooltip } from '@material-tailwind/react';
// Icons
import {
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from '@heroicons/react/24/solid';
// Components
import Pagination from 'app/components/Pagination';
// utils
import { renderDate, renderStatus } from 'utils/helper';

export default function GarageUsers() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { users } = (useLoaderData() as { users }) || {
    users: { data: {} },
  };
  const { garage } = (useLoaderData() as { garage }) || {
    garage: { data: {} },
  };

  const onPageChanged = page => {
    searchParams.set('page', page);
    setSearchParams(searchParams);
  };

  return (
    <LoadingOverlay
      active={navigation.state === 'loading'}
      className="m-4 p-4 flex flex-col md:flex-row gap-2"
    >
      <div className="w-full md:w-2/6 md:order-1 space-y-2">
        <Card className="hover:shadow-md p-4">
          <div className="text-primary-400 mb-4 tracking-wide text-center underline decoration-secondary-500 underline-offset-4">
            {garage.shop_name} Users
          </div>
          <div className="flex flex-row justify-between gap-2 mt-4">
            <button
              onClick={() => {
                navigate(`/garages/${garage.id}`);
              }}
              className="relative inline-block px-4 py-2 font-bold group w-full"
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
                navigate(`/garages/${garage.id}/users/create`);
              }}
              className="relative inline-block px-4 py-2 font-bold group w-full"
            >
              <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
              <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Add new user
              </span>
            </button>
          </div>
        </Card>
      </div>

      <div className="w-full md:w-4/6">
        <Card className="rounded-xl">
          <div className="h-full rounded-xl shadow-lg overflow-auto">
            <table className="w-full min-w-max table-auto text-right rounded-xl overflow-x-scroll">
              <thead>
                <tr>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs text-center">
                    Action
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Id
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    First Name
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Last Name
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Email
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    User Type
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Status
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Last Visit
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.data.data.data.map(user => (
                  <tr
                    key={user.id}
                    className="even:bg-slate-50 bg-slate-200 text-gray-900 hover:bg-primary-100 hover:text-primary-500"
                  >
                    <td className="py-2 px-4">
                      <Tooltip content="Edit User" className="text-xs">
                        <button
                          onClick={() =>
                            navigate(`/garages/${garage.id}/users/${user.id}`)
                          }
                          className="relative inline-block px-4 py-2 font-bold group"
                        >
                          <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                          <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                          <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                            <PencilSquareIcon className="h4 w-4" />
                          </span>
                        </button>
                      </Tooltip>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {user.id}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {user.first_name}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {user.last_name}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {user.email}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {user.user_type}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {renderStatus(user.status)}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {renderDate(user.last_visited_at)}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="relative h-18">
          <Pagination
            data={users.data && users.data.data}
            onPageChanged={onPageChanged}
            limit={30}
          />
        </div>
      </div>
    </LoadingOverlay>
  );
}
