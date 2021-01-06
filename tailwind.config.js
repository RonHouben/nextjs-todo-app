module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: { max: "375px" }
      },
      backgroundImage: (theme) => ({
        "mobile-light": "url('/images/bg-mobile-light.jpg')",
        "mobile-dark": "url('/images/bg-mobile-dark.jpg')",
        "desktop-light": "url('/images/bg-desktop-light.jpg')",
        "desktop-dark": "url('/images/bg-desktop-dark.jpg')",
      }),
      colors: {
        "background-cyan": "hsl(192, 100%, 67%)",
        "background-purple-pink": "hsl(280, 87%, 65%)",
        active: "hsl(220, 98%, 61%)",
        light: {
          background: "hsl(236, 33%, 92%)",
          0: "hsl(0, 0%, 98%)",
          1: "hsl(236, 33%, 92%)",
          2: "hsl(233, 11%, 84%)",
          3: "hsl(236, 9%, 61%)",
          4: "hsl(235, 19%, 35%)",
        },
        dark: {
          background: "hsl(235, 21%, 11%)",
          0: "hsl(235, 21%, 11%)",
          1: "hsl(235, 24%, 19%)",
          2: "hsl(234, 39%, 85%)",
          3: "hsl(236, 33%, 92%)",
          4: "hsl(234, 11%, 52%)",
          5: "hsl(233, 14%, 35%)",
          6: "hsl(237, 14%, 26%)",
        },
      },
      fontSize: {
        body: "1.125rem",
      },
      fontFamily: {
        "josefin-sans": ["Josefin Sans", "sans-serif"],
      },
      letterSpacing: {
        navigation: ".55em",
      },
    },
  },
  variants: {
    extend: {
      gradientColorStops: "hover",
      animation: ['hover', 'focus']
    },
  },
  plugins: [],
};
