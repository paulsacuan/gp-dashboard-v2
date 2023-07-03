import React, { useState } from 'react';
// External
import {
  useLoaderData,
  useNavigation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
import { Card, Typography, Tooltip } from '@material-tailwind/react';
import axios from 'axios';
// Icons
import {
  ArrowUturnLeftIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CreditCardIcon,
} from '@heroicons/react/24/solid';
// Components
import Pagination from 'app/components/Pagination';
import GarageUploadSOA from 'app/components/Garages/GarageUploadSOA';
import GarageDownloadSOA from 'app/components/Garages/GarageDownloadSOA';
import GarageBillingForm from 'app/components/Garages/GarageBillingForm';
// utils
import { dateFormatter, renderCurrency, renderDate } from 'utils/helper';
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

export default function GarageBilling() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { billing } = (useLoaderData() as { billing }) || {
    billing: { data: {} },
  };
  const { garage } = (useLoaderData() as { garage }) || {
    garage: { data: {} },
  };
  console.log(garage);

  const [searchParams, setSearchParams] = useSearchParams();

  const onPageChanged = page => {
    searchParams.set('page', page);
    setSearchParams(searchParams);
  };

  const [downloadable, setDownloadable] = useState([]);
  const [selectedBilling, setSelectedBilling] = useState({
    id: 0,
    amount_paid: 0,
    inv: '',
    billed_balance: 0,
  });
  const [isOpenBillingForm, setIsOpenBillingForm] = useState(false);
  const [isOpenDL, setIsOpenDL] = useState(false);
  const [isOpenUL, setIsOpenUL] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleOpenDL = data => {
    setDownloadable(data.files);
    setIsOpenDL(true);
  };

  const handleOpenUL = data => {
    setSelectedBilling(data);
    setIsOpenUL(true);
  };
  const handleOpenBillingForm = data => {
    setSelectedBilling(data);
    setIsOpenBillingForm(true);
  };
  const handlePDFChange = event => {
    const pdfs = [];
    for (let i = 0; i < event.target.files.length; i += 1) {
      pdfs.push(event.target.files[i]);
    }
    setSelectedFiles(pdfs);
  };

  const handleUpload = async event => {
    event.preventDefault();
    try {
      // eslint-disable-next-line no-restricted-globals
      const res = confirm(`Are you sure you want to upload this files?`);
      if (res) {
        if (selectedFiles) {
          setLoading(true);
          const formData = new FormData();

          // eslint-disable-next-line array-callback-return
          selectedFiles.map(file => {
            formData.append('pdfs[]', file);
          });

          const response = await axios.post(
            `${apiUrl}/v2/garage/soa/upload/${selectedBilling.id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${Auth.token()}`,
              },
            },
          );
          if (response.status === 200) {
            setLoading(false);
            setIsOpenUL(false);
            toast.success('SOA upload success!', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
            navigate(`/garages/${garage.id}/billing`, { replace: true });
          } else {
            setLoading(false);
            setIsOpenUL(false);
            toast.error('SOA upload failed!', {
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
        }
      }
    } catch (error) {
      setLoading(false);
      setIsOpenUL(false);
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
  const handlePayment = async data => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${apiUrl}/v2/garage/billings/${data.id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.token()}`,
          },
        },
      );
      if (response.status === 200) {
        setLoading(false);
        setIsOpenBillingForm(false);
        toast.success('Credit Payment updated successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate(`/garages/${garage.id}/billing`, { replace: true });
      } else {
        setLoading(false);
        setIsOpenBillingForm(false);
        toast.error('Credit Payment update failed!', {
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
      setIsOpenBillingForm(false);
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
    <LoadingOverlay
      active={navigation.state === 'loading' || loading === true}
      className="m-4 p-4 flex flex-col md:flex-row gap-2"
    >
      <GarageUploadSOA
        show={isOpenUL}
        handleClose={() => setIsOpenUL(false)}
        handlePDFChange={handlePDFChange}
        handleUpload={handleUpload}
      />
      <GarageDownloadSOA
        show={isOpenDL}
        handleClose={() => setIsOpenDL(false)}
        data={downloadable}
      />
      <GarageBillingForm
        show={isOpenBillingForm}
        handleClose={() => setIsOpenBillingForm(false)}
        data={selectedBilling}
        handlePayment={handlePayment}
      />

      <div className="w-full md:w-2/6 md:order-1 space-y-2">
        <Card className="hover:shadow-md p-4">
          <div className="text-primary-400 mb-4 tracking-wide text-center underline decoration-secondary-500 underline-offset-4">
            {garage.shop_name} Billings
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
          </div>
        </Card>
        <Card className="hover:shadow-md p-4">
          <p className="text-sm text-secondary-500 font-semibold mb-2">
            Garage Credit
          </p>
          <div className="space-y-1 text-primary-400 mb-4">
            <span className="flex items-center text-sm justify-between">
              <p className="font-light">Billed Balance </p>
              <p>{renderCurrency(garage.credit.billed_balance)}</p>
            </span>
            <span className="flex items-center text-sm justify-between">
              <p className="font-light">Outstanding Balance </p>
              <p>{renderCurrency(garage.credit.outstanding_balance)}</p>
            </span>
            <span className="flex items-center text-sm justify-between">
              <p className="font-light">Payment Due date </p>
              <p>{renderDate(garage.credit.payment_duedate)}</p>
            </span>
          </div>
        </Card>
      </div>

      <div className="w-full md:h-4/6">
        <Card className="rounded-xl">
          <div className="h-full rounded-xl shadow-lg overflow-auto">
            <table className="w-full min-w-max table-auto text-right rounded-xl overflow-x-scroll">
              <thead>
                <tr>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs text-center">
                    Action
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Invoice #
                  </th>

                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Billing Period
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Billed Balance
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Amount Paid
                  </th>
                  <th className="bg-primary-500 py-4 px-4 font-semibold text-secondary-500 leading-none text-xs">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {billing.data.data.data.map(billing => (
                  <tr
                    key={billing.id}
                    className="even:bg-slate-50 bg-slate-200 text-gray-900 hover:bg-primary-100 hover:text-primary-500"
                  >
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-center space-x-2"
                      >
                        <Tooltip content="Upload SOA" className="text-xs">
                          <button
                            onClick={() => handleOpenUL(billing)}
                            className="relative inline-block px-4 py-2 font-bold group"
                          >
                            <span className="absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                            <span className="absolute rounded-lg inset-0 w-full h-full bg-primary-500 border-2 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500"></span>
                            <span className="relative text-secondary-500 group-hover:text-primary-500 flex items-center justify-center text-xs">
                              <ArrowUpTrayIcon className="h4 w-4" />
                            </span>
                          </button>
                        </Tooltip>
                        <Tooltip content="Download SOA" className="text-xs">
                          <button
                            onClick={() => handleOpenDL(billing)}
                            disabled={billing.files.length === 0}
                            className="relative inline-block px-4 py-2 font-bold group"
                          >
                            <span
                              className={`absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform ${
                                billing.files.length === 0
                                  ? 'translate-x-0 translate-y-0 group-hover:-translate-x-0 group-hover:-translate-y-0'
                                  : 'translate-x-1 translate-y-1'
                              } bg-primary-200 `}
                            ></span>
                            <span
                              className={`absolute rounded-lg inset-0 w-full h-full border-2 ${
                                billing.files.length === 0
                                  ? 'bg-primary-100 border-primary-200'
                                  : 'bg-primary-500 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500'
                              } `}
                            ></span>
                            <span
                              className={`relative text-secondary-500 ${
                                billing.files.length === 0
                                  ? ''
                                  : 'group-hover:text-primary-500'
                              } flex items-center justify-center text-xs`}
                            >
                              <ArrowDownTrayIcon className="h4 w-4" />
                            </span>
                          </button>
                        </Tooltip>
                        <Tooltip content="Update Payment" className="text-xs">
                          <button
                            onClick={() => handleOpenBillingForm(billing)}
                            disabled={billing.status === 'paid'}
                            className="relative inline-block px-4 py-2 font-bold group"
                          >
                            <span
                              className={`absolute rounded-lg inset-0 w-full h-full transition duration-200 ease-out transform ${
                                billing.status === 'paid'
                                  ? 'translate-x-0 translate-y-0 group-hover:-translate-x-0 group-hover:-translate-y-0'
                                  : 'translate-x-1 translate-y-1'
                              } bg-primary-200 `}
                            ></span>
                            <span
                              className={`absolute rounded-lg inset-0 w-full h-full border-2 ${
                                billing.status === 'paid'
                                  ? 'bg-primary-100 border-primary-200'
                                  : 'bg-primary-500 border-primary-500 group-hover:bg-secondary-500 group-hover:border-primary-500'
                              } `}
                            ></span>
                            <span
                              className={`relative text-secondary-500 ${
                                billing.status === 'paid'
                                  ? ''
                                  : 'group-hover:text-primary-500'
                              } flex items-center justify-center text-xs`}
                            >
                              <CreditCardIcon className="h4 w-4" />
                            </span>
                          </button>
                        </Tooltip>
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {billing.inv}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {dateFormatter(billing.start)} -{' '}
                        {dateFormatter(billing.end)}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {renderCurrency(billing.billed_balance)}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className="text-xs text-primary-500 font-normal"
                      >
                        {renderCurrency(billing.amount_paid)}
                      </Typography>
                    </td>
                    <td className="py-2 px-4">
                      <Typography
                        variant="small"
                        className={`text-xs text-primary-500 font-normal ${
                          billing.status === '1'
                            ? 'text-red-600'
                            : 'text-green-500'
                        }`}
                      >
                        {billing.status === '1' ? 'not paid' : 'paid'}
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
            data={billing.data && billing.data.data}
            onPageChanged={onPageChanged}
            limit={10}
          />
        </div>
      </div>
    </LoadingOverlay>
  );
}
