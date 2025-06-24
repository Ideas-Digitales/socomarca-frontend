import useStore from '../base';

// Hook para obtener solo los productos
export const useProducts = () => useStore((state) => state.products);

// Hook para obtener productos filtrados
export const useFilteredProducts = () =>
  useStore((state) => state.filteredProducts);

// Hook para obtener el estado de carga de productos
export const useProductsLoading = () =>
  useStore((state) => state.isLoadingProducts);

// Hook para obtener información de paginación
export const usePagination = () =>
  useStore((state) => ({
    currentPage: state.currentPage,
    meta: state.productPaginationMeta,
    links: state.productPaginationLinks,
  }));

// Hook para obtener las acciones de productos
export const useProductActions = () =>
  useStore((state) => ({
    fetchProducts: state.fetchProducts,
    setProducts: state.setProducts,
    setFilteredProducts: state.setFilteredProducts,
    setSearchTerm: state.setSearchTerm,
  }));

// Hook para obtener acciones de paginación
export const usePaginationActions = () =>
  useStore((state) => ({
    setProductPage: state.setProductPage,
    nextPage: state.nextPage,
    prevPage: state.prevPage,
  }));

// Hook combinado para componentes de lista de productos
export const useProductList = () => {
  const products = useFilteredProducts();
  const isLoading = useProductsLoading();
  const pagination = usePagination();
  const actions = useProductActions();
  const paginationActions = usePaginationActions();

  return {
    products,
    isLoading,
    pagination,
    actions,
    paginationActions,
  };
};

// Hook para obtener un producto específico por ID
export const useProduct = (productId: number) =>
  useStore(
    (state) =>
      state.products.find((product) => product.id === productId) ||
      state.filteredProducts.find((product) => product.id === productId)
  );

// Hook para búsqueda
export const useSearch = () =>
  useStore((state) => ({
    searchTerm: state.searchTerm,
    setSearchTerm: state.setSearchTerm,
  }));
