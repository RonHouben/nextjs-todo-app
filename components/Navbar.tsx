import { signout, useSession } from "next-auth/client";
import ProfileIconButton from "./IconButton";
import ThemeSwitcherButton from "./ThemeSwitcherButton";

interface Props {
  pageTitle?: string;
}

export default function Navbar({ pageTitle }: Props) {
  const session = useSession();
  const user = session[0]?.user;

  console.log("session", session);

  return (
    <div className="flex justify-between items-center pb-10">
      {user && (
        <ProfileIconButton
          alt="Go to Profile"
          src={user?.image || "/icons/unknown-user-icon.png"}
          size="2xl"
          onClick={signout}
          focusable
          className={!user?.image ? "bg-purple-200 " : ""}
        />
      )}
      <h1 className="uppercase">{pageTitle || null}</h1>
      <ThemeSwitcherButton />
    </div>
  );
}
