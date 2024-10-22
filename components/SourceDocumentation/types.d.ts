export type ArgumentObj = {
    [key: string]: {
        annotation: string | null;
        description: string | null;
        default: string | null;
    };
};

export type MethodObj = {
    name?: string;
    docstring?: string;
    signature: string | JSX.Element;
    returns?: {
        annotation: string | null;
        description: string | null;
    };
    arguments: ArgumentObj;
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
    annotation: string | null;
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
    inherits_from:
    | { [key: string]: { module: string; members: string[][] } | undefined }
    | undefined;
    examples: string[] | null;
};

export type ModuleObj = {
    name: string;
    slug: string[];
    classes: ClassObj[];
    docstring: string;
    functions: MethodObj[];
    submodules: ModuleObj[];
    constants?: PropertyObj[];
    examples?: string[] | null;
};

export type GenericArgument = {
    name: string;
    annotation?: string | null;
    description?: string | null;
    default?: string | null;
};
