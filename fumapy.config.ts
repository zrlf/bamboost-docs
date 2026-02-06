import { Config } from "fumadocs-python-autodoc/source";

const config: Config = {
  shiki: {
    lang: "python",
    themes: {
      dark: "vitesse-dark",
      light: "vitesse-light",
    },
  },
  jsonPath: "lib",
  sources: {
    bamboost: {
      baseUrl: "apidocs",
      title: "API Reference",
      pkgName: "bamboost",
      options: {
        className: "route-api",
      },
      sortClassMethods: true,
      gitUrl: "https://github.com/smec-ethz/bamboost/tree/main/bamboost",
      excludeModules: [],
    },
  },
};

export default config;
