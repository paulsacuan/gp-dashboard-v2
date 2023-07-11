import axios from 'axios';
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

export async function userLoader({ params }) {
  const userId = params.user_id;

  const user = await axios.get(`${apiUrl}/v2/user/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  return { user: user.data.data };
}
