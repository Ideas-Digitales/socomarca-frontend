import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function CategoryFilterMobile() {
  return (
    <div className=" w-full h-[36px] items-center px-4">
      <div className="py-[6px] pl-[9px] pr-auto flex items-center gap-[6px]">
        <AdjustmentsHorizontalIcon width={24} height={24} />
        <label className="text-[14px]">Seleccionar Categoría</label>
      </div>
    </div>
  );
}
