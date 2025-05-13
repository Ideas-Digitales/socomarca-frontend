import MinusIcon from '../icons/MinusIcon';

export default function CategoryFilterDesktop() {
  return (
    <div className="flex flex-col items-start bg-white">
      <div className="flex w-[200px] h-[48px] p-3 items-center justify-between gap-[10px]">
        <span className='w-[124px] items-start gap-[10px] font-bold uppercase'>Categoría</span>
        <MinusIcon color='#84CC16' />
      </div>
    </div>
  );
}
