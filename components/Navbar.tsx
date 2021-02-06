import { signout, useSession } from "next-auth/client";
import { firebaseClient } from "../lib/firebaseClient";
import ProfileIconButton from "./IconButton";
import ThemeSwitcherButton from "./ThemeSwitcherButton";

interface Props {
  pageTitle?: string;
}

export default function Navbar({ pageTitle }: Props) {
  const [session, loading] = useSession();
  const user = session?.user;

  const handleLogout = () => {
    // log analytics event
    firebaseClient.analytics().logEvent("logout");
    // sign the user out
    signout();
  };

  return (
    <div className="flex justify-between items-center pb-10">
      {user && (
        <ProfileIconButton
          alt="Go to Profile"
          src={user?.image}
          size="2xl"
          onClick={handleLogout}
          focusable
          className={loading ? "animate-pulse" : ""}
        />
      )}
      <h1 className="uppercase">{pageTitle || null}</h1>
      <ThemeSwitcherButton />
    </div>
  );
}
