import axios from 'axios';
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

// garage page index
export async function garageLoader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const garages = await axios.get(`${apiUrl}/v2/garages/all${url.search}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  return { garages, search };
}

export async function singleGarageLoader({ params }) {
  const id = params.id;

  if (id) {
    const garage = await axios.get(`${apiUrl}/v2/garages/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.token()}`,
      },
    });

    const salesUser = await axios.get(
      `${apiUrl}/v2/users?type=sales_user&list=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.token()}`,
        },
      },
    );
    return { garage: garage.data.data, salesUser: salesUser.data };
  } else {
    const salesUser = await axios.get(
      `${apiUrl}/v2/users?type=sales_user&list=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.token()}`,
        },
      },
    );
    return { salesUser: salesUser.data };
  }
}

export async function garageBillingsLoader({ params, request }) {
  const id = params.id;

  const url = new URL(request.url);

  const apiLink =
    url !== null
      ? `${apiUrl}/v2/garage/credit-billings/${id}${url.search}`
      : `${apiUrl}/v2/garage/credit-billings/${id}`;
  const billings = await axios.get(apiLink, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });

  const garage = await axios.get(`${apiUrl}/v2/garages/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });

  return { billing: billings, garage: garage.data.data };
}

export async function garageUsersLoader({ params, request }) {
  const id = params.id;
  const url = new URL(request.url);

  const apiLink =
    url.search === ''
      ? `${apiUrl}/v2/users?garage_id=${id}`
      : `${apiUrl}/v2/users${url.search}&garage_id=${id}`;

  const users = await axios.get(`${apiLink}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  const garage = await axios.get(`${apiUrl}/v2/garages/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  return { users, garage: garage.data.data };
}

export async function garageUserLoader({ params }) {
  const userId = params.user_id;

  const user = await axios.get(`${apiUrl}/v2/user/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  return { user: user.data.data };
}
