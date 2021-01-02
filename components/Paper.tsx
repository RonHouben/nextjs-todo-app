import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}
export default function Paper({ children, className }: Props) {
  return (
    <div
      className={`${className} flex w-full h-full rounded-md p-3 shadow-lg bg-light-0 dark:bg-dark`}
    >
      {children}
    </div>
  );
}
