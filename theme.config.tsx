import { useConfig, type DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <div style={{display: 'flex', gap: "0.5rem", alignItems: 'center'}}>
      <img src="/logo_round.png" style={{height: '2rem'}} alt="logo" />
      <span style={{fontWeight: 'bold'}}>BAMBOOST</span>
    </div>
  ),
  project: {
    link: "https://gitlab.com/cmbm-ethz/bamboost",
    icon: (
      <svg width="24" height="24" viewBox="0 0 256 256">
        <path
          fill="currentColor"
          d="m231.9 169.8l-94.8 65.6a15.7 15.7 0 0 1-18.2 0l-94.8-65.6a16.1 16.1 0 0 1-6.4-17.3L45 50a12 12 0 0 1 22.9-1.1L88.5 104h79l20.6-55.1A12 12 0 0 1 211 50l27.3 102.5a16.1 16.1 0 0 1-6.4 17.3Z"
        ></path>
      </svg>
    ),
  },
  darkMode: true,
  backgroundColor: {
    // dark: "17,17,17",
    dark: "20,20,30",
    light: "254,252,252",
  },
  feedback: { content: null },
  docsRepositoryBase: "https://gitlab.com/cmbm-ethz/bamboost",
  color: {
    hue: {
      dark: 108,
      light: 228,
    },
    saturation: {
      dark: 40,
      light: 40,
    },
  },
  toc: {
    backToTop: true,
  },
  nextThemes: {
    defaultTheme: "dark",
  },
  footer: {
    content: (
      <div
        className="flex justify-center md:justify-start"
        style={{ gap: "2rem" }}
      >
        <img src="/logo_round.png" style={{ height: "8rem" }} alt="logo" />
        <div className="items-center" style={{ display: "flex", gap: "8rem" }}>
          <div className="flex flex-col _gap-2">
            <span>2024, bamboost developers</span>
            <span>@ ETH Zürich</span>
          </div>
        </div>
      </div>
    ),
  },
  head: () => {
    const { frontMatter } = useConfig();
    return (
      <>
        <title>{frontMatter.title + " - bamboost"}</title>
        <meta property="og:title" content={frontMatter.title || "Bamboost"} />
      </>
    );
  },
};

export default config;
