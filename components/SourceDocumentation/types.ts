interface ModuleInterface {
  name: string;
  path: string;
  filepaths: string;
  description: string | null;
  docstring: SectionInterface[] | null;
  modules: { [key: string]: ModuleInterface };
  attributes: AttributeInterface[];
  classes: { [key: string]: ClassInterface };
  functions: { [key: string]: FunctionInterface };
}

interface ClassInterface {
  name: string;
  path: string;
  description: string | null;
  docstring: SectionInterface[] | null;
  parameters: ParameterInterface[];
  attributes: AttributeInterface[];
  functions: { [key: string]: FunctionInterface };
  source: string;
  inherited_members: { [key: string]: { kind: string; path: string }[] };
}

interface FunctionInterface {
  name: string;
  path: string;
  signature: string;
  description: string | null;
  docstring: SectionInterface[] | null;
  parameters: ParameterInterface[];
  returns: ReturnInterface;
  source: string;
}

interface AttributeInterface {
  name: string;
  annotation: string | null;
  description: string | null;
  value: string | null;
}

interface SectionInterface {
  kind: string;
  value: any;
  title?: string;
}

interface ParameterInterface {
  name: string;
  annotation: string | null;
  description: string | null;
  value: string | null;
}

interface ReturnInterface {
  name: string;
  annotation: string | null;
  description: string | null;
}

export type {
  ModuleInterface,
  ClassInterface,
  FunctionInterface,
  AttributeInterface,
  SectionInterface,
  ParameterInterface,
  ReturnInterface,
};
