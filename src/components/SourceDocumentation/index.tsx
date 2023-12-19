import jsonData from '@site/static/reference_guide.json';
import CodeBlock from '@theme/CodeBlock';
import './styles.scss';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

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

const RenderMethod = (method: { name: string; obj: Method; isNotMethod: boolean }) => {
  const name = method.name;
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
        <h3 id={name} style={{ display: 'inline-block' }}>
          <span>{name}</span>
        </h3>
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
          <div className="parameters">
            <b>Parameters:</b>
            <ul>
              {Object.entries(obj.arguments).map(([arg, content], index) => {
                return (
                  <li key={`args_${index}`}>
                    <b>{arg}</b> : <i>{content.annotation}</i>
                    <p className="parameter-description">{content.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RENDER RETURNS */}
          <div className="parameters">
            <b>Returns:</b>
            <ul>
              <i>{obj.returns.annotation}</i>
              <p className="parameter-description">{obj.returns.description}</p>
            </ul>
          </div>
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

const Constructor = ({ cls }) => {
  const source_code = cls['constructor']['source']['code'];
  const starting_line_number = cls['constructor']['source']['lines'][0];
  const signature = cls['constructor']['signature'];
  const name = cls['name'];
  const [sourceIsVisible, setSourceIsVisible] = useState(false);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <SourceCodeButton
          sourceIsVisible={sourceIsVisible}
          setSourceIsVisible={setSourceIsVisible}
        />
      </div>
      <Signature name={name} signature={signature} sourceIsVisible={sourceIsVisible} />
      <SourceCode
        source_code={source_code}
        starting_line_number={starting_line_number}
        sourceIsVisible={sourceIsVisible}
      />
    </>
  );
};

const InheritedFrom = ({ cls }) => {
  const allInheritedClasses = Object.entries(cls['inherits_from']);
  const inheritedMethods = allInheritedClasses.map(
    ([parent, values]: [string, string[]], index) => ({
      name: parent,
      link: `/docs/autoDocs/${parent.split('.').slice(1).join('/')}`,
      inheritedMember: values.map((value) => ({
        type: value[0],
        name: value[1],
        link: `/docs/autoDocs/${parent.split('.').slice(1).join('/')}#${value[1]}`,
      })),
    })
  );
  console.log(inheritedMethods[0].link);

  return (
    <>
      {inheritedMethods.map((parent, index) => (
        <li key={`parent_${index}`}>
          <Link to={parent.link}>{parent.name}</Link>
          <div className="inherited-members-grid">
            {parent.inheritedMember.map((member, index) => (
              <Link className="grid-item" key={`inherited_${index}`} to={member.link}>
                {member.name}
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
  data: JSON;
  classFullName: string;
  directCls: JSON;
}) => {
  const getSubDataFromFullName = (fullName: string) => {
    const split = fullName.split('.');
    let subData = data;
    for (let i = 1; i < split.length - 1; i++) {
      subData = subData['submodules'][split[i]];
    }
    subData = subData['classes'][split[split.length - 1]];
    return subData;
  };

  let cls = {};
  if (directCls) {
    cls = directCls;
  } else {
    cls = getSubDataFromFullName(classFullName);
  }
  const methods = cls['methods'];

  return (
    <div>
      <p>{cls['docstring']}</p>
      <Constructor cls={cls} />

      {Object.keys(cls['inherits_from']).length > 0 && (
        <div>
          <b>Inherits from:</b>
          <ul>
            <InheritedFrom cls={cls} />
          </ul>
        </div>
      )}

      {/* Render Class Variables */}
      <div className="parameters">
        <b>Variables:</b>
        <ul>
          {Object.keys(cls['variables']).map((variable, index) => {
            return (
              <li key={`variable_${index}`}>
                <b>{variable}</b> : <i>{cls['variables'][variable]['annotation']}</i>
                <p className="parameter-description">{cls['variables'][variable]['description']}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Render Methods */}
      <div className="methods">
        {Object.keys(methods).map((key) => RenderMethod({ name: key, obj: methods[key] }))}
      </div>
    </div>
  );
};

export const RenderModule = ({ data, moduleFullName }: { data: JSON; moduleFullName: string }) => {
  const getSubDataFromFullName = (fullName: string) => {
    const split = fullName.split('.');
    let subData = data;
    for (let i = 1; i < split.length - 1; i++) {
      subData = subData['submodules'][split[i]];
    }
    subData = subData['submodules'][split[split.length - 1]];
    return subData;
  };

  const module = getSubDataFromFullName(moduleFullName);
  const classes = module['classes'];
  const functions = module['functions'];
  const docstring = module['docstring'];

  return (
    <div>
      {docstring != 'None' && <p>{docstring}</p>}

      {/* Render Functions */}
      <div className="functions">
        {Object.entries(functions).map(([name, obj], index) => (
          <div key={`function_${index}`}>
            <RenderMethod name={name} obj={obj} isNotMethod={true} />
          </div>
        ))}
      </div>
    </div>
  );
};
