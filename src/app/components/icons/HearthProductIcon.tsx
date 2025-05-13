interface Props {
  width?: number;
  height?: number;
}

export default function HearthProductIcon({ width = 18, height = 18 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d="M15.1364 6.44318C15.1364 4.74867 13.7055 3.375 11.9404 3.375C10.6206 3.375 9.4877 4.14292 9.00001 5.2387C8.51232 4.14292 7.37941 3.375 6.05967 3.375C4.29456 3.375 2.86365 4.74867 2.86365 6.44318C2.86365 11.3663 9.00001 14.625 9.00001 14.625C9.00001 14.625 15.1364 11.3663 15.1364 6.44318Z"
        stroke="#475569"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
