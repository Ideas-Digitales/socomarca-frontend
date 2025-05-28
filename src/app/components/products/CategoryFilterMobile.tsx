import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function CategoryFilterMobile() {
  return (
    <div className="w-full h-[36px] items-center px-2">
      <div className=" pl-[9px] pr-auto ">
        <button className="bg-lime-200 flex items-center rounded-3xl gap-[6px] px-[14px] py-[6px] hover:bg-lime-300">
          <AdjustmentsHorizontalIcon width={24} height={24} />
          <label className="text-sm">Seleccionar Categoría</label>
        </button>
      </div>
    </div>
  );
}
