import config from "@/fumapy.config";
import { getSources } from "fumadocs-python-autodoc/source";
import {
  setShikiConfigContext,
  setSourcesContext,
} from "fumadocs-python-autodoc/components";

export const autodocSources = getSources(config);

setSourcesContext(autodocSources);
setShikiConfigContext(config.shiki);
