import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function CategoryFilterMobile() {
  return (
    <div className="flex w-full h-[36px] py-[6px] ml-[9px] mr-auto gap-[6px] items-center px-4">
      <AdjustmentsHorizontalIcon width={24} height={24} />
      <label className="text-[14px]">Seleccionar Categoría</label>
    </div>
  );
}
