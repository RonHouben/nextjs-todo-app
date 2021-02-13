interface Props {
  orientation: "vertical" | "horizontal";
}

export default function ThreeDots({ orientation }: Props) {
  return (
    <div
      className={`flex ${
        orientation === "vertical" ? "flex-col" : "flex-row"
      } cursor-grab gap-1`}
    >
      <div className="rounded-full w-1 h-1 dark:bg-dark-5 bg-light-2" />
      <div className="rounded-full w-1 h-1 dark:bg-dark-5 bg-light-2" />
      <div className="rounded-full w-1 h-1 dark:bg-dark-5 bg-light-2" />
    </div>
  );
}
