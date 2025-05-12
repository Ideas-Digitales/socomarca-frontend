interface Props {
  width?: number;
  height?: number;
}

export default function SearchIcon({ width = 23, height = 24 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d="M20.0456 21L15.0851 15.8033M15.0851 15.8033C16.3806 14.4461 17.182 12.5711 17.182 10.5C17.182 6.35786 13.9767 3 10.0229 3C6.069 3 2.86377 6.35786 2.86377 10.5C2.86377 14.6421 6.069 18 10.0229 18C11.9998 18 13.7896 17.1605 15.0851 15.8033Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
