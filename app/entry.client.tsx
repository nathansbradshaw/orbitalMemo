import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { ThemeProvider } from "@material-tailwind/react";

hydrate(
  <ThemeProvider>
    <RemixBrowser />
  </ThemeProvider>,
  document
);
