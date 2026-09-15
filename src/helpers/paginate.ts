// helpers/paginate.ts

import { Pagination } from "@/types/pagination";

export function paginate<T>(
  data: T[],
  page: number,
  limit: number
): { data: T[]; pagination: Pagination } {
  const total = data.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: data.slice(start, end),
    pagination: {
      limit,
      current: page,
      items: total,
      pages: Math.ceil(total / limit),
      next: end < total ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    },
  };
}