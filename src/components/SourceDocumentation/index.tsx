import { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import { Prism } from 'prism-react-renderer';

import {
  Examples,
  InstanceVariables,
  Parameter,
  ParameterList,
  ReturnStatement,
} from './RenderParts';

import './styles.scss';
import styles from './styles.module.scss';
import { classFromString, moduleFromString } from './SubData';
import { parseAnnotation } from './ParseString';
import CodeBlockJSX from '@site/src/theme/CodeBlock/Content/Element';

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
  examples: string[];
};

type Class = {
  name: string;
  short_description: string;
  docstring: string;
  constructor: Method;
  methods: { key: Method };
  variables: { [key: string]: { annotation: string; description: string } };
  inherits_from: {};
  examples: string[];
};

const RenderMethod = (method: {
  name: string;
  obj: Method;
  isNotMethod?: boolean;
  parentClassName?: string;
}) => {
  const name = method.name;
  let displayName = name;
  // switch (name) {
  //   case '__getitem__':
  //     displayName = `${method.className}[key]`;
  //     break;
  //   case '__setitem__':
  //     displayName = `${method.className}[key] = ...`;
  //     break;
  //   case '__len__':
  //     displayName = `len(${method.className})`;
  //     break;
  //   case '__iter__':
  //     displayName = `iter(${method.className})`;
  //     break;
  //   default:
  //     break;
  // }
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
          <h2
            className={styles.functionTitle}
            id={`${method.parentClassName || ''}_${name}`}
            style={{ display: 'inline-block' }}>
            <span>{displayName}</span>
          </h2>
        ) : (
          <h3
            className={styles.functionTitle}
            id={`${method.parentClassName || ''}_${name}`}
            style={{ display: 'inline-block' }}>
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
          {obj.docstring.split('\n\n').map((block, index) => (
            <p key={`docstring_${name}_${index}`}>{block}</p>
          ))}

          {/* RENDER ARGUMENTS */}
          <ParameterList parameters={obj.arguments} />

          {/* RENDER RETURNS */}
          <ReturnStatement returns={obj.returns} />

          {/* RENDER EXAMPLES */}
          {obj.examples.length > 0 && <Examples examples={obj.examples} />}
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

const SourceCodeButton = ({ sourceIsVisible, setSourceIsVisible, ...props }) => {
  return (
    <div className="sourceButton">
      <button onClick={() => setSourceIsVisible((prev: boolean) => !prev)} {...props}>
        {sourceIsVisible ? (
          <div>
            <i className="fa-solid fa-chevron-down icon-source"></i> source code
          </div>
        ) : (
          <div>
            <i className="fa-solid fa-chevron-right icon-source"></i> source code
          </div>
        )}
      </button>
    </div>
  );
};

const Constructor = ({ cls, sourceIsVisible }: { cls: Class; sourceIsVisible: boolean }) => {
  const name = cls.name;
  const source_code = cls.constructor.source.code;
  const starting_line_number = cls.constructor.source.lines?.[0] || 0;
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
  ...props
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

  const classBaseName = classFullName.split('.').slice(-1)[0];
  const classPath = classFullName.split('.').slice(0, -1).join('.');

  console.log(cls.constructor.arguments);

  return (
    <div {...props}>
      {/* RENDER CLASS NAME */}
      <div
        id={cls.name}
        className="spacing-header"
        style={{
          fontFamily: 'Fira Code',
          fontWeight: 'normal',
          position: 'relative',
        }}>
        class{' '}
        <span style={{ color: 'var(--secondary)' }}>
          {classPath}.
          <h2 id={classBaseName.toLowerCase()} style={{ display: 'inline', fontSize: '1em' }}>
            {classBaseName}
          </h2>
          <CodeBlock language="py" className={styles.codeInline}>
            {cls.constructor.signature}
          </CodeBlock>
        </span>
        <SourceCodeButton
          sourceIsVisible={sourceIsVisible}
          setSourceIsVisible={setSourceIsVisible}
          style={{ position: 'absolute', top: '0', width: '10em', right: '0' }}
        />
      </div>
      <SourceCode
        source_code={cls.constructor.source.code}
        starting_line_number={cls.constructor.source.lines?.[0] || 0}
        sourceIsVisible={sourceIsVisible}
      />

      {/* <Constructor cls={cls} sourceIsVisible={sourceIsVisible} /> */}
      {/* <div className="method-title"> */}
      {/*   <b */}
      {/*     className={styles.functionTitle} */}
      {/*     id={`${cls.name}_constructor`} */}
      {/*     style={{ display: 'inline-block', padding: '0.5em', paddingLeft: '0.8em' }}> */}
      {/*     <i>class</i> {cls.name} */}
      {/*   </b> */}
      {/*   <SourceCodeButton */}
      {/*     sourceIsVisible={sourceIsVisible} */}
      {/*     setSourceIsVisible={setSourceIsVisible} */}
      {/*   /> */}
      {/* </div> */}

      <div className={styles.classContainer}>
        {/* RENDER DOCSTRING */}
        {/* Split string at \n and create paragraphs */}
        {cls.docstring.split('\n\n').map((block, index) => (
          <p key={`docstring_${cls.name}_${index}`}>{block}</p>
        ))}

        {/* RENDER ARGUMENTS */}
        {cls.constructor.arguments.length > 0 && (
          <div className="parameters">
            <b>Parameters:</b>
            <ul>
              {Object.entries(cls.constructor.arguments).map(([arg, content], index) => {
                if (arg === 'self') return null;
                return (
                  <li key={`args_${cls.name}_${index}`}>
                    <b>{arg}</b> : <code>{parseAnnotation(content.annotation)}</code>
                    <p className="parameter-description">{content.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Render Examples */}
        {cls.examples.length > 0 && <Examples examples={cls.examples} />}

        {/* Render Inherited Classes */}
        {Object.keys(cls.inherits_from).length > 0 && (
          <div>
            <b>Inherits from:</b>
            <ul>
              <InheritedFrom cls={cls} />
            </ul>
          </div>
        )}

        {/* Render Class Variables */}
        {cls.variables.length > 0 && <InstanceVariables variables={cls.variables} />}

        {/* Render Methods */}
        <div className="methods">
          {Object.keys(methods).map((key) => (
            <RenderMethod {...{ name: key, obj: methods[key], parentClassName: cls.name }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const RenderModule = ({ data, moduleFullName }: { data: JSON; moduleFullName: string }) => {
  const moduleToRender = moduleFromString(moduleFullName, data);
  const functions = moduleToRender['functions'];
  const docstring = moduleToRender['docstring'];
  const classes = moduleToRender['classes'];

  return (
    <div>
      {/* <div className={clsx('table-of-contents', styles.tableOfContents, 'thin-scrollbar')} /> */}
      {docstring != 'None' && <p>{docstring}</p>}

      {/* Render Classes TOC */}
      <h1 className="spacing-header">Classes</h1>
      <table>
        <tbody>
          {Object.entries(classes).map(([name, cls]: [string, Class], index) => (
            <tr key={`${moduleToRender['name']}_classes_${index}`}>
              <td>
                <Link to={`#${name.toLowerCase()}`} className={styles.codeLink}>
                  {name}
                </Link>
              </td>
              <td>{cls.docstring.split('\n\n')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render Functions TOC */}
      <h1 className="spacing-header">Functions</h1>
      <table>
        <tbody>
          {Object.entries(functions).map(([name, method]: [string, Method], index) => (
            <tr key={`${moduleToRender['name']}_functions_${index}`}>
              <td>
                <Link to={`#${name.toLowerCase()}`} className={styles.codeLink}>
                  {name}
                </Link>
              </td>
              <td>{method.docstring.split('\n\n')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className="spacing-header">Module Contents</h1>

      {/* Render Classes */}
      <div className="classes">
        {Object.entries(classes).map(([name, cls]: [string, Class], index) => (
          <>
            <RenderClass
              data={data}
              classFullName={`${moduleFullName}.${name}`}
              directCls={cls}
              key={`class_${index}`}
            />
          </>
        ))}
      </div>

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
