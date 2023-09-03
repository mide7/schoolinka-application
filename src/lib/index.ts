import { queryInput } from '@/types';
import * as bcrypt from 'bcrypt';

export const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
);

export async function generateHashedPassword(password: string) {
  const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS);

  return await bcrypt.hash(password, salt);
}

export function queryHelper(input: queryInput) {
  const size =
    typeof Number(input.size) === 'number' && Number(input.size) > 0
      ? Number(input.size)
      : 10;
  const page =
    typeof Number(input.page) === 'number' && Number(input.page) > 0
      ? Number(input.page)
      : 1;

  const skip = page > 1 ? size * (page - 1) : 0;

  const order = input.order ? input.order : 'desc';

  const sort = input.sort ? input.sort : 'id';

  const published = input.published || 'all';

  const search = input.search || undefined;

  return {
    ...input,
    size,
    order,
    sort,
    page,
    skip,
    search,
    published,
  };
}
