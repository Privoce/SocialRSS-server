import { IPaginationMeta, Pagination as P } from 'nestjs-typeorm-paginate'
import { Pagination } from '~/shared/interfaces/paginator.interface'

export function transformDataToPaginate<T = any>(
  data: P<T, IPaginationMeta>,
): Pagination<T> {
  const { totalItems, currentPage, itemCount, totalPages } = data.meta
  return {
    data: data.items,
    pagination: {
      total: totalItems,
      currentPage: currentPage,
      totalPage: totalPages,
      size: itemCount,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  }
}
