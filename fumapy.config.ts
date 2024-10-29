import { ModuleInterface } from "./components/SourceDocumentation/types";

interface Source {
  baseUrl: string;
  title: string;
  sourceFile: ModuleInterface;
}

interface Config {
  sources: {
    [key: string]: Source;
  };
}

const config: Config = {
  sources: {
    bamboost: {
      baseUrl: "/apidocs",
      title: "API Reference",
      sourceFile: require("@/api.json"),
    }
  },
};

export default config;
