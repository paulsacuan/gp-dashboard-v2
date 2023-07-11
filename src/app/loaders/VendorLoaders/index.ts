import axios from 'axios';
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

// vendor page index
export async function vendorsLoader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const vendors = await axios.get(`${apiUrl}/v2/vendors/all${url.search}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  return { vendors, search };
}

// single vendor page index
export async function singleVendorLoader({ params }) {
  const id = params.id;

  if (id) {
    const vendor = await axios.get(`${apiUrl}/v2/vendor/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.token()}`,
      },
    });

    return { vendor: vendor.data.data };
  } else {
    return { vendor: {} };
  }
}

export async function vendorUsersLoader({ params, request }) {
  const id = params.id;
  const url = new URL(request.url);

  const apiLink =
    url.search === ''
      ? `${apiUrl}/v2/users?vendor_id=${id}`
      : `${apiUrl}/v2/users${url.search}&vendor_id=${id}`;

  const users = await axios.get(`${apiLink}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  const vendor = await axios.get(`${apiUrl}/v2/vendor/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  return { users, vendor: vendor.data.data };
}
