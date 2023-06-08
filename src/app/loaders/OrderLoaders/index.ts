import axios from 'axios';
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

// products page index
export async function orderStatusLoader() {
  const orders = await axios.get(`${apiUrl}/v2/orders/all/status`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  return { orders: orders.data.data };
}
