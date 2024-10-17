export type MethodObj = {
  name?: string;
  docstring?: string;
  signature: string;
  returns?: {
    annotation: string;
    description: string | null;
  };
  arguments: {
    [key: string]:
      | {
          annotation: string | null;
          description: string | null;
          default: string | null;
        }
      | undefined;
  };
  source: {
    code: string;
    lines: number[] | null;
  };
  props?: {
    isClassMethod?: boolean;
  };
  examples?: string[];
};

export type PropertyObj = {
  name: string;
  annotation: string;
  description: string | null;
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
  examples: string[];
};

export type ModuleObj = {
  name: string;
  classes: ClassObj[];
  docstring: string;
  functions: MethodObj[];
  submodules: ModuleObj[];
  constants?: PropertyObj[];
};

export type GenericArgument = {
  name: string;
  annotation?: string;
  description?: string;
  default?: string;
};
