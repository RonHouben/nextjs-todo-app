import React from "react";
import { useTheme } from "next-themes";
import IconButton from "./IconButton";

export default function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme();

  return (
    <React.Fragment>
      {theme === "light" && (
        <IconButton
          alt="Switch to Dark Mode"
          src="/icons/icon-moon.svg"
          size="lg"
          onClick={() => setTheme("dark")}
        />
      )}
      {theme === "dark" && (
        <IconButton
          alt="Switch to Light Mode"
          src="/icons/icon-sun.svg"
          size="lg"
          onClick={() => setTheme("light")}
        />
      )}
    </React.Fragment>
  );
}
