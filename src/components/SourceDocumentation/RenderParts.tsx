import CodeBlock from '@theme/CodeBlock';
import { parseAnnotation, parseString } from './ParseString';
import styles from './styles.module.scss';

export const Parameter = ({ name, arg }) => {
  return (
    <>
      <b>{name}</b> : <code>{parseAnnotation(arg.annotation || 'Any')}</code>
      <p className="parameter-description">{parseString(arg.description)}</p>
    </>
  );
};

export const ParameterList = ({ parameters }) => {
  return (
    <div className="parameters">
      <b>Parameters:</b>
      <ul>
        {Object.entries(parameters).map(([name, arg], index) => {
          return (
            <li key={`args_${index}`}>
              <Parameter name={name} arg={arg} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const ReturnStatement = ({ returns }) => {
  return (
    <div className="parameters">
      <b>Returns:</b>
      <ul>
        <code>{parseAnnotation(returns.annotation)}</code>
        <p className="parameter-description">{parseString(returns.description)}</p>
      </ul>
    </div>
  );
};

type Variable = {
  annotation: string;
  description: string;
};

export const InstanceVariables = ({ variables }: { variables: { [key: string]: Variable } }) => {
  return (
    <div className="parameters">
      <b>Variables:</b>
      <ul>
        {Object.keys(variables).map((name, index) => {
          return (
            <li key={`variable_${index}`}>
              <b>{name}</b> : <code>{parseAnnotation(variables[name].annotation)}</code>
              <p className="parameter-description">{variables[name].description}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const Examples = ({ examples }) => {
  return (
    <div className={styles.examples}>
      <b>Examples:</b>

      <div>
        {examples.map((example, index) => {
          return (
            <CodeBlock className={styles.example} language="py" key={`example_${index}`}>
              {example}
            </CodeBlock>
          );
        })}
      </div>
    </div>
  );
};
