import jsonData from '@site/static/reference_guide.json';
import CodeBlock from '@theme/CodeBlock';
import './styles.scss';
import { useRef, useState } from 'react';
import clsx from 'clsx';

const RenderMethod = (method: { name: string; obj: Object }) => {
  const name = method.name;
  const obj = method.obj;
  const [sourceIsVisible, setSourceIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="method">
      {/* RENDER METHOD NAME */}
      <div className="method-title">
        <div onClick={() => setIsExpanded(!isExpanded)}>
          <i className="fa-solid fa-circle-notch icon"></i>
        </div>
        <h3 id={name} style={{ display: 'inline-block' }}>
          <span>{name}</span>
        </h3>
        <SourceCodeButton sourceIsVisible={sourceIsVisible} setSourceIsVisible={setSourceIsVisible} />
      </div>
      <Signature name={name} signature={obj['signature']} sourceIsVisible={sourceIsVisible} />

      {/* RENDER SOURCE CODE */}
      <SourceCode
        source_code={obj['source']['code']}
        starting_line_number={obj['source']['lines'][0]}
        sourceIsVisible={sourceIsVisible}
      />

      {isExpanded && (
        <>
          {/* RENDER DOCSTRING */}
          <p>{obj['docstring']}</p>

          {/* RENDER ARGUMENTS */}
          <div className="parameters">
            <b>Parameters:</b>
            <ul>
              {Object.keys(obj['arguments']).map((arg, index) => {
                return (
                  <li key={`args_${index}`}>
                    <b>{arg}</b> : <i>{obj['arguments'][arg]['annotation']}</i>
                    <p className="parameter-description">{obj['arguments'][arg]['description']}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RENDER RETURNS */}
          <div className="parameters">
            <b>Returns:</b>
            <ul>
              <i>{obj['returns']['annotation']}</i>
              <p className="parameter-description">{obj['returns']['description']}</p>
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
        <SourceCodeButton sourceIsVisible={sourceIsVisible} setSourceIsVisible={setSourceIsVisible} />
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

export const RenderClass = ({ cls }) => {
  const methods = cls['methods'];

  return (
    <div>
      <p>{jsonData['docstring']}</p>
      <Constructor cls={cls} />
      <div className="methods">{Object.keys(methods).map((key) => RenderMethod({ name: key, obj: methods[key] }))}</div>
    </div>
  );
};
