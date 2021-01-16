import Image, { ImageProps } from "next/image";

type Size = "sm" | "md" | "lg" | "xl" | "2xl";

interface Props {
  alt: string;
  src: ImageProps["src"];
  size?: Size;
  square?: boolean;
  shadow?: boolean;
  focusable?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function IconButton({
  alt,
  src,
  size = "md",
  square,
  shadow,
  focusable = true,
  onClick,
  className,
}: Props) {
  const sizeClassName: string = getSizeClassName(size);

  return (
    <button
      className={`p-3 m-0.5 select-none focus:animate-pulse hover:animate-pulse focus:bg-gray-300 hover:bg-gray-300 focus:bg-opacity-50 hover:bg-opacity-50 cursor-pointer
      ${sizeClassName} ${!square ? "rounded-full" : ""} ${
        shadow ? "shadow-md" : ""
      } ${className}`}
      tabIndex={focusable ? 0 : undefined}
      onClick={onClick}
    >
      <div className="relative h-full w-full ">
        <Image
          priority
          layout="fill"
          src={src}
          className={!square ? "rounded-full" : ""}
          alt={alt}
          title={alt}
        />
      </div>
    </button>
  );
}

function getSizeClassName(size: Size): string {
  switch (size) {
    case "sm":
      return "h-10 w-10";
    case "md":
      return "h-11 w-11";
    case "lg":
      return "h-12 w-12";
    case "xl":
      return "h-16 w-16";
    case "2xl":
      return "h-20 w-20";
  }
}
