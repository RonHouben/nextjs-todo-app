import RoundThemeButton from "./RoundThemeButton";

interface Props {
  pageTitle: string;
}

export default function Navbar({ pageTitle }: Props) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-light-0 font-bold text-3xl tracking-navigation">
        {pageTitle.toUpperCase()}
      </div>
      <RoundThemeButton />
    </div>
  );
}
