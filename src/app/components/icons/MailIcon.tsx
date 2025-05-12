interface Props {
  width?: number;
  height?: number;
}

export default function MailIcon({ width = 64, height = 64 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d="M58 18V46C58 49.3137 55.3137 52 52 52H12C8.68629 52 6 49.3137 6 46V18M58 18C58 14.6863 55.3137 12 52 12H12C8.68629 12 6 14.6863 6 18M58 18V18.6472C58 20.7308 56.9191 22.6652 55.1446 23.7572L35.1446 36.0649C33.2161 37.2516 30.7839 37.2516 28.8554 36.0649L8.85542 23.7572C7.08093 22.6652 6 20.7308 6 18.6472V18"
        stroke="#84CC16"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
