import { BundledTheme, CodeToHastOptions, BundledLanguage } from "shiki";

interface Source {
  baseUrl: string;
  title: string;
  pkgName: string;
  options?: Record<string, any>;
}

interface Config {
  shiki: CodeToHastOptions<BundledLanguage, BundledTheme>;
  excludeModules: string[];
  sources: {
    [key: string]: Source;
  };
}

const config: Config = {
  shiki: {
    lang: "python",
    themes: {
      dark: "everforest-dark",
      light: "github-light",
    },
  },
  excludeModules: ["bamboost._version"],
  sources: {
    bamboost: {
      baseUrl: "apidocs",
      title: "API Reference",
      pkgName: "bamboost",
      options: {
        className: "route-api",
      },
    },
    bamboostcli: {
      baseUrl: "api-tui",
      title: "API TUI",
      pkgName: "bamboostcli",
      options: {
        className: "route-tui",
      },
    },
  },
};

export default config;
