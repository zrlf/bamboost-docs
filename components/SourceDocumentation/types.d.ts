export type ArgumentObj = {
  [key: string]: {
    annotation: string | null;
    description: string | null;
    default: string | null;
  };
};

export type ReturnObj = {
  annotation: string | null;
  description: string | null;
};

export type MethodObj = {
  name: string;
  docstring?: string;
  signature: string | JSX.Element;
  returns: ReturnObj;
  arguments: ArgumentObj;
  source: {
    code: string;
    lines: number[] | null;
  };
  props?: {
    isClassMethod?: boolean;
  };
  examples: string[];
};

export type PropertyObj = {
  name: string;
  annotation: string | null;
  description: string | null;
  default: string | null;
  source?: {
    code: string;
    lines: number[] | null;
  };
};

export type ClassObj = {
  name: string;
  short_description: string;
  docstring: string;
  constructor: MethodObj;
  methods: { [key: string]: MethodObj | undefined };
  properties: PropertyObj[];
  inherits_from: { [key: string]: { module: string; members: string[][] } };
  examples: string[] | null;
};

export type ModuleObj = {
  name: string;
  slug: string[];
  classes: ClassObj[];
  docstring: string;
  short_description: string;
  functions: MethodObj[];
  submodules: ModuleObj[];
  attributes: PropertyObj[];
  examples?: string[] | null;
  version?: string;
};

export type GenericArgument = {
  name: string;
  annotation?: string | null;
  description?: string | null;
  default?: string | null;
};
