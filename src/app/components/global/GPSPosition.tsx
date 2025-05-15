import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function GPSPosition() {
  return (
    <div className="flex w-full py-[10px] px-3 justify-between items-center bg-lime-50 text-lime-700">
      <MapPinIcon width={24} height={24} />
      <span className="font-medium">8179, Maria Isabel</span>
      <ArrowRightIcon width={24} height={24} />
    </div>
  );
}
