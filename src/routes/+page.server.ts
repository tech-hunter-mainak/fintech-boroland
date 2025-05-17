import { getUserByEmailOrMobile } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const email = url.searchParams.get('email');
  const mobile = url.searchParams.get('mobile');

  if (email || mobile) {
    const user = await getUserByEmailOrMobile(email || '', mobile || '');
    return {
      user
    };
  }

  return {
    user: null
  };
}; 