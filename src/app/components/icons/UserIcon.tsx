interface Props {
  width?: number;
  height?: number;
}

export default function UserIcon({ width = 24, height = 25 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d="M15.7498 6.5C15.7498 8.57107 14.0709 10.25 11.9998 10.25C9.92877 10.25 8.24984 8.57107 8.24984 6.5C8.24984 4.42893 9.92877 2.75 11.9998 2.75C14.0709 2.75 15.7498 4.42893 15.7498 6.5Z"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.50098 20.6182C4.57128 16.5369 7.90171 13.25 11.9998 13.25C16.0981 13.25 19.4286 16.5371 19.4987 20.6185C17.2159 21.666 14.6762 22.25 12.0002 22.25C9.32384 22.25 6.78394 21.6659 4.50098 20.6182Z"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
