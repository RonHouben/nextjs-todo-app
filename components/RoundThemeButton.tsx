import { useTheme } from "next-themes";
import { Key } from "../interfaces/Key.enum";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RoundThemeButton() {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div
      className="relative h-6 w-6 m-2 cursor-pointer"
      tabIndex={0}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      onKeyPress={(e) =>
        e.key === Key.Spacebar
          ? setTheme(theme === "light" ? "dark" : "light")
          : null
      }
    >
      <div className={theme === "light" ? "hidden" : ""}>
        <Image layout="fill" src="/images/icon-sun.svg" />
      </div>
      <div className={theme === "dark" ? "hidden" : ""}>
        <Image layout="fill" src="/images/icon-moon.svg" />
      </div>
    </div>
  );
}
