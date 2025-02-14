import { FC } from "react";

const NetworkErrorIcon: FC = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.18 40 8 32.82 8 24C8 15.18 15.18 8 24 8C32.82 8 40 15.18 40 24C40 32.82 32.82 40 24 40Z"
      fill="#94a3b8"
    />
    <path
      d="M24 14C19.58 14 16 17.58 16 22H20C20 19.8 21.8 18 24 18C26.2 18 28 19.8 28 22C28 24.2 26.2 26 24 26H22V34H26V29.28C29.36 28.14 32 25.38 32 22C32 17.58 28.42 14 24 14Z"
      fill="#94a3b8"
    />
  </svg>
);

export default NetworkErrorIcon;
