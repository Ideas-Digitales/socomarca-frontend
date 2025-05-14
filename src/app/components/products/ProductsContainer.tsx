import { Product } from '@/interfaces/product.interface';
import ProductCard from './ProductCard';
import CategoryFilterDesktop from './CategoryFilterDesktop';
import useStore from '@/stores/useStore';

interface Props {
  products: Product[];
}

export default function ProductsContainer({ products }: Props) {
  const { isMobile } = useStore();

  return (
    <div className="flex items-start gap-4 flex-1-0-0 max-w-7xl mx-auto w-full px-4">
      {!isMobile && <CategoryFilterDesktop />}
      <div className="flex flex-col flex-1-0-0  w-full sm:max-w-[582px] sm:mr-auto">
        {!isMobile && (
          <div className="flex py-[10px] items-center gap-2 h-[44px]">
            <span className="font-semibold ">
              Arroz y legumbres (180 productos)
            </span>
          </div>
        )}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      c
    </div>
  );
}
