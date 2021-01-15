import ThemeSwitcherButton from "./ThemeSwitcherButton";

interface Props {
  pageTitle?: string;
}

export default function Navbar({ pageTitle }: Props) {
  return (
    <div className="flex justify-between items-center pb-10">
      <h1 className="uppercase">{pageTitle || null}</h1>
      <ThemeSwitcherButton />
    </div>
  );
}
