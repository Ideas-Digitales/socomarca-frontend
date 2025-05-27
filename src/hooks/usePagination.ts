import { useState, useMemo } from 'react';
import { PaginationMeta } from '@/stores/base/types';

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    const productPaginationMeta: PaginationMeta = {
      current_page: currentPage,
      from: startIndex + 1,
      last_page: totalPages,
      links: [],
      path: '',
      per_page: itemsPerPage,
      to: Math.min(endIndex, items.length),
      total: items.length,
    };

    return {
      paginatedItems,
      productPaginationMeta,
      totalPages,
    };
  }, [items, itemsPerPage, currentPage]);

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return {
    ...paginationData,
    changePage,
  };
}
