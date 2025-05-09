interface Props {
  width?: number;
  height?: number;
}

export default function HearthIcon({ width = 24, height = 24 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d="M21 8.75C21 6.26472 18.9013 4.25 16.3125 4.25C14.3769 4.25 12.7153 5.37628 12 6.98342C11.2847 5.37628 9.62312 4.25 7.6875 4.25C5.09867 4.25 3 6.26472 3 8.75C3 15.9706 12 20.75 12 20.75C12 20.75 21 15.9706 21 8.75Z"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
