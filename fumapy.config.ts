import { BundledTheme, CodeToHastOptions, BundledLanguage } from "shiki";

interface Source {
    baseUrl: string;
    title: string;
    pkgName: string;
    options?: Record<string, any>;
    sortClassMethods?: boolean;
    gitUrl?: string;
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
            dark: "vitesse-dark",
            light: "vitesse-light",
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
            sortClassMethods: true,
            gitUrl: "https://gitlab.com/cmbm-ethz/bamboost/-/blob/next/bamboost",
        },
    },
};

export default config;
