'use client';

import CartProductsContainer from "./CartProductsContainer";

export default function CartProductsDesktop() {
  return (
    <div className="w-[370px]">
      <span className="flex w-full h-[44px] py-[10px] px-3 items-start gap-[10px] bg-lime-50 font-semibold text-base">
        Productos agregados en el carro
      </span>
      <CartProductsContainer />
    </div>
  );
}
