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
            sortClassMethods: true,
            gitUrl: "https://gitlab.com/cmbm-ethz/bamboost/-/blob/main/bamboost",
        },
        bamboostcli: {
            baseUrl: "api-tui",
            title: "API TUI",
            pkgName: "bamboostcli",
            options: {
                className: "route-tui",
            },
            gitUrl: "https://gitlab.com/zrlf/bamboost-tui/-/tree/main/bamboostcli",
        },
    },
};

export default config;
