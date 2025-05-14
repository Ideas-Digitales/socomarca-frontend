import AdjustmentsIcon from "../icons/AdjustmentsIcon";

export default function CategoryFilterMobile() {
  return (
    <div className="flex w-full h-[36px] py-[6px] pl-[9px] pr-auto gap-[6px] items-center">
      <AdjustmentsIcon />
      <label className="text-[14px]">Seleccionar Categoría</label>
    </div>
  )
}