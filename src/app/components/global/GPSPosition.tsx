import ArrowRightIcon from '../icons/ArrowRightIcon';
import GPSIcon from '../icons/GPSIcon';

export default function GPSPosition() {
  return (
    <div className="flex w-full py-[10px] px-3 justify-between items-center bg-lime-50 text-lime-700">
      <GPSIcon />
      <span className="font-medium">8179, Maria Isabel</span>
      <ArrowRightIcon />
    </div>
  );
}
