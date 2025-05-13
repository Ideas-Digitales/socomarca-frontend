import { Product } from '@/interfaces/product.interface';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
}

export default function ProductsContainer({ products }: Props) {
  return (
    <div className="flex flex-col flex-1-0-0">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
