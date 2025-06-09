import { CartItem } from '@/interfaces/product.interface';

interface Props {
  cartItem: CartItem;
}

export default function VerPedidoItemCard({ cartItem }: Props) {
  return (
    <li className="flex w-full h-[104px] p-3 items-center gap-2 border-b-[1px] border-solid border-slate-300">
      <img
        src={cartItem.image}
        alt={cartItem.name}
        className="w-[77px] h-[80px]"
      />
      <div className="flex max-w-[169px] w-full flex-col items-start gap-[2px]">
        <span className="text-xs font-medium text-slate-500">
          {cartItem.brand.name}
        </span>
        <p className="text-sm">{cartItem.name}</p>
        <p className="text-xs text-slate-500">Cantidad: {cartItem.quantity}</p>
      </div>
      <div className="flex h-[74px] flex-col justify-center items-end gap-[6px] flex-1-0-0">
        <div className="flex justify-end items-center gap-3">
          {/* Price */}
          <span className="text-slate-600 text-sm font-medium">
            {cartItem.price.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP',
            })}
          </span>
        </div>
      </div>
    </li>
  );
}
