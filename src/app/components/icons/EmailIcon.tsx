interface Props {
  width?: number;
  height?: number;
}

export default function EmailIcon({ width = 25, height = 24 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d="M22.2446 6.75V17.25C22.2446 18.4926 21.2373 19.5 19.9946 19.5H4.99463C3.75199 19.5 2.74463 18.4926 2.74463 17.25V6.75M22.2446 6.75C22.2446 5.50736 21.2373 4.5 19.9946 4.5H4.99463C3.75199 4.5 2.74463 5.50736 2.74463 6.75M22.2446 6.75V6.99271C22.2446 7.77405 21.8393 8.49945 21.1738 8.90894L13.6738 13.5243C12.9507 13.9694 12.0386 13.9694 11.3154 13.5243L3.81541 8.90894C3.14998 8.49945 2.74463 7.77405 2.74463 6.99271V6.75"
        stroke="#6CB409"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
