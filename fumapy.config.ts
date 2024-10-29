import { ModuleInterface } from "./fumapy/components/SourceDocumentation/types";
import { BundledTheme, CodeToHastOptions, BundledLanguage } from "shiki";

interface Source {
  baseUrl: string;
  title: string;
  sourceFile: ModuleInterface;
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
      baseUrl: "/apidocs",
      title: "API Reference",
      sourceFile: require("@/api.json"),
      options: {
        className: "route-api",
      },
    },
    bamboostcli: {
      baseUrl: "/api-tui",
      title: "API TUI",
      sourceFile: require("@/api-tui.json"),
      options: {
        className: "route-tui",
      },
    },
  },
};

export default config;
