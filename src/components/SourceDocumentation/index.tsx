import { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

import { InstanceVariables, Parameter, ParameterList, ReturnStatement } from './RenderParts';

import './styles.scss';
import styles from './styles.module.scss';
import { classFromString, moduleFromString } from './SubData';
import { parseAnnotation } from './ParseString';

const path = require('path-browserify');
export const basePath = '/docs/autoDocs';

type Method = {
  docstring: string;
  signature: string;
  returns: {
    annotation: string;
    description: string;
  };
  arguments: {
    [key: string]: {
      annotation: string;
      description: string;
      default: string;
    };
  };
  source: {
    code: string;
    lines: number[];
  };
  props: {
    isClassMethod?: boolean;
  };
};

type Class = {
  name: string;
  docstring: string;
  constructor: Method;
  methods: { key: Method };
  variables: { [key: string]: { annotation: string; description: string } };
  inherits_from: {};
};

const RenderMethod = (method: {
  name: string;
  obj: Method;
  isNotMethod?: boolean;
  className?: string;
}) => {
  const name = method.name;
  let displayName = name;
  switch (name) {
    case '__getitem__':
      displayName = `${method.className}[key]`;
      break;
    case '__setitem__':
      displayName = `${method.className}[key] = ...`;
      break;
    case '__len__':
      displayName = `len(${method.className})`;
      break;
    case '__iter__':
      displayName = `iter(${method.className})`;
      break;
    default:
      break;
  }
  const obj = method.obj;
  const [sourceIsVisible, setSourceIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={clsx(!method.isNotMethod && 'method')}>
      {/* RENDER METHOD NAME */}
      <div className="method-title">
        <div onClick={() => setIsExpanded(!isExpanded)}>
          <>
            {!method.isNotMethod &&
              (obj.props.isClassMethod ? (
                <i className="fa-solid fa-c icon"></i>
              ) : (
                <i className="fa-solid fa-m icon"></i>
              ))}
          </>
        </div>
        {method.isNotMethod ? (
          <h2 className={styles.functionTitle} id={name} style={{ display: 'inline-block' }}>
            <span>{displayName}</span>
          </h2>
        ) : (
          <h3 className={styles.functionTitle} id={name} style={{ display: 'inline-block' }}>
            <span>{displayName}</span>
          </h3>
        )}
        <SourceCodeButton
          sourceIsVisible={sourceIsVisible}
          setSourceIsVisible={setSourceIsVisible}
        />
      </div>
      <Signature name={name} signature={obj['signature']} sourceIsVisible={sourceIsVisible} />

      {/* RENDER SOURCE CODE */}
      <SourceCode
        source_code={obj.source.code}
        starting_line_number={obj.source.lines[0]}
        sourceIsVisible={sourceIsVisible}
      />

      {isExpanded && (
        <>
          {/* RENDER DOCSTRING */}
          <p>{obj.docstring}</p>

          {/* RENDER ARGUMENTS */}
          <ParameterList parameters={obj.arguments} />

          {/* RENDER RETURNS */}
          <ReturnStatement returns={obj.returns} />
        </>
      )}
    </div>
  );
};

const Signature = ({ name, signature, sourceIsVisible }) => {
  return (
    <div className={clsx('signature', sourceIsVisible && 'sourceIsVisible')}>
      <CodeBlock language="py">
        {name} {signature}
      </CodeBlock>
    </div>
  );
};

const SourceCode = ({ source_code, starting_line_number, sourceIsVisible }) => {
  return (
    <>
      {sourceIsVisible && (
        <div className="source-code-div">
          <CodeBlock language="py" showLineNumbers startingLineNumber={starting_line_number}>
            {source_code}
          </CodeBlock>
        </div>
      )}
    </>
  );
};

const SourceCodeButton = ({ sourceIsVisible, setSourceIsVisible }) => {
  return (
    <button className="sourceButton" onClick={() => setSourceIsVisible((prev: boolean) => !prev)}>
      {sourceIsVisible ? (
        <>
          <i className="fa-solid fa-chevron-down icon"></i> source code
        </>
      ) : (
        <>
          <i className="fa-solid fa-chevron-right icon"></i> source code
        </>
      )}
    </button>
  );
};

const Constructor = ({ cls, sourceIsVisible }: { cls: Class; sourceIsVisible: boolean }) => {
  const name = cls.name;
  const source_code = cls.constructor.source.code;
  const starting_line_number = cls.constructor.source.lines[0];
  const signature = cls.constructor.signature;
  const args = cls.constructor.arguments;

  return (
    <>
      <Signature name={name} signature={signature} sourceIsVisible={sourceIsVisible} />
      <SourceCode
        source_code={source_code}
        starting_line_number={starting_line_number}
        sourceIsVisible={sourceIsVisible}
      />
      {/* RENDER ARGUMENTS */}
      <div className="parameters">
        <b>Parameters:</b>
        <ul>
          {Object.entries(args).map(([arg, content], index) => {
            if (arg === 'self') return null;
            return (
              <li key={`args_${index}`}>
                <b>{arg}</b> : <code>{parseAnnotation(content.annotation)}</code>
                <p className="parameter-description">{content.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

const InheritedFrom = ({ cls }: { cls: Class }) => {
  const allInheritedClasses = Object.entries(cls.inherits_from);
  const inheritedMethods = allInheritedClasses.map(
    ([parentClass, { module, members }]: [string, { module: string; members: [] }]) => {
      const modulePath = path.join(basePath, module.split('.').slice(1).join('/'));
      return {
        name: [module, parentClass].join('.'),
        link: modulePath,
        inheritedMember: members.map((arr) => ({
          type: arr[0],
          name: arr[1],
          link: `${modulePath}#${arr[1]}`,
        })),
      };
    }
  );

  return (
    <>
      {inheritedMethods.map((parent, index) => (
        <li key={`parent_${index}`}>
          <Link to={parent.link}>{parent.name}</Link>
          <div className="inherited-members-grid">
            {parent.inheritedMember.map((member, index) => (
              <Link className="grid-item" key={`inherited_${index}`} to={member.link}>
                <code>{member.name}</code>
              </Link>
            ))}
          </div>
        </li>
      ))}
    </>
  );
};

export const RenderClass = ({
  data,
  classFullName,
  directCls,
}: {
  data: any;
  classFullName: string;
  directCls: Class;
}) => {
  let cls: Class;
  if (directCls) {
    cls = directCls;
  } else {
    cls = classFromString(classFullName, data);
  }
  const methods = cls.methods;
  const [sourceIsVisible, setSourceIsVisible] = useState(false);

  return (
    <div>
      <p>{cls.docstring}</p>
      <Constructor cls={cls} sourceIsVisible={sourceIsVisible} />

      {Object.keys(cls.inherits_from).length > 0 && (
        <div>
          <b>Inherits from:</b>
          <ul>
            <InheritedFrom cls={cls} />
          </ul>
        </div>
      )}

      {/* Render Class Variables */}
      <InstanceVariables variables={cls.variables} />

      {/* Render Methods */}
      <div className="methods">
        {Object.keys(methods).map((key) => (
          <RenderMethod {...{ name: key, obj: methods[key], className: cls.name }} />
        ))}
      </div>
    </div>
  );
};

export const RenderModule = ({ data, moduleFullName }: { data: JSON; moduleFullName: string }) => {
  const moduleToRender = moduleFromString(moduleFullName, data);
  const functions = moduleToRender['functions'];
  const docstring = moduleToRender['docstring'];

  return (
    <div>
      {docstring != 'None' && <p>{docstring}</p>}

      {/* Render Functions */}
      <div className="functions">
        {Object.entries(functions).map(([name, obj]: [string, Method], index) => (
          <div key={`function_${index}`}>
            <RenderMethod name={name} obj={obj} isNotMethod={true} />
          </div>
        ))}
      </div>
    </div>
  );
};
