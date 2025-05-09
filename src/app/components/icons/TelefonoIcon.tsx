interface Props {
  width?: number;
  height?: number;
}

export default function TelefonoIcon({ width, height }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : '25'}
      height={height ? height : '24'}
      viewBox={`0 0 ${width ? width : '25'} ${height ? height : '24'}`}
      fill="none"
    >
      <path
        d="M2.74463 6.75C2.74463 15.0343 9.46036 21.75 17.7446 21.75H19.9946C21.2373 21.75 22.2446 20.7426 22.2446 19.5V18.1284C22.2446 17.6121 21.8933 17.1622 21.3925 17.037L16.9693 15.9312C16.5302 15.8214 16.068 15.9855 15.7964 16.3476L14.8262 17.6412C14.5446 18.0166 14.0576 18.1827 13.617 18.0212C10.31 16.8098 7.68478 14.1846 6.47339 10.8777C6.31197 10.437 6.47799 9.94998 6.85343 9.6684L8.14705 8.69818C8.50916 8.4266 8.67324 7.96445 8.56346 7.52533L7.45767 3.10215C7.33246 2.60133 6.88248 2.25 6.36626 2.25H4.99463C3.75199 2.25 2.74463 3.25736 2.74463 4.5V6.75Z"
        stroke="#6CB409"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
