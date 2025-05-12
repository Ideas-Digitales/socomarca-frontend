'use server';

import { Product } from '@/interfaces/product.interface';
import { productos } from '@/mock/products';

export const fetchGetProducts = async () => {
  const response = await new Promise((resolver) => {
    setTimeout(() => {
      resolver(productos);
    }, 1000);
  });

  const products = response as Product[];

  return {
    ok: true,
    data: products,
    error: null,
  };
};
