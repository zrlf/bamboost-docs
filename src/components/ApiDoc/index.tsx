import React from 'react';
import jsonData from '@site/static/bamboost-api-doc.json';
import CodeBlock from '@theme/CodeBlock';
import './styles.scss';

const isEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

interface Arguments {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export const Function = ({ name, parentName, props }) => {
  let args: Arguments[] = props.arguments;

  return (
    <div className="function">
      <div className="function-header">
        <h3 id={name}>
          <span className="function-header-title">{name}</span>
        </h3>
        <CodeBlock language="python">{props.signature}</CodeBlock>
      </div>
      <p>
        <b>Return:</b> [{props.return.type}] - {props.return.description}
      </p>
      <p>{props.description}</p>
      <table>
        <thead>
          <tr>
            <th>Argument</th>
            <th>Type</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        {args && (
          <tbody>
            {args.map((arg, index) => {
              return (
                <tr key={`func_${index}`}>
                  <td>{arg.name}</td>
                  <td>{arg.type}</td>
                  <td>{arg.description}</td>
                  <td>{arg.default}</td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
};

export const Class = ({ name, moduleName, obj }) => {
  let data = (obj && obj.classes[name]) || jsonData[moduleName].classes[name];
  return (
    <div data-search-children>
      <h2 id={name} className="header-class">
        {name}
      </h2>
      {data.methods &&
        Object.keys(data.methods).map((methodName, index) => {
          let method = data.methods[methodName];
          return <Function key={`class_${index}`} name={methodName} parentName={name} props={method} />;
        })}
    </div>
  );
};

export const Module = ({ moduleString }) => {
  let moduleArray = moduleString.split('.');
  console.log(moduleArray);
  let parentModule = jsonData[moduleArray[0]];
  for (let i = 1; i < moduleArray.length; i++) {
    parentModule = parentModule.modules[moduleArray[i]];
  }
  return BamboostModule({ moduleName: moduleArray[moduleArray.length - 1], parentModule });
};

export default function BamboostModule({ moduleName, parentModule }) {
  let data = parentModule || jsonData[moduleName];
  let classes = data.classes;
  let methods = data.methods;

  return (
    <div data-search-children>
      <ul>
        {!isEmpty(data.modules) &&
          Object.keys(data.modules).map((moduleName, index) => {
            return (
              <li key={`a1lk_${index}`}>
                <a
                  href={`#${moduleName}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(`#${moduleName}`).scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}>
                  {moduleName}
                </a>
              </li>
            );
          })}
      </ul>

      {!isEmpty(data.modules) &&
        Object.keys(data.modules).map((moduleName, index) => {
          return (
            <div key={`b2l_${index}`}>
              <h2 id={moduleName}>{moduleName}</h2>
              <BamboostModule key={index} moduleName={moduleName} parentModule={data.modules[moduleName]} />
            </div>
          );
        })}

      <div>
        {!isEmpty(classes) &&
          Object.keys(classes).map((className, index) => {
            return <Class key={`agi_${index}`} name={className} moduleName={moduleName} obj={data} />;
          })}
      </div>

      <div>
        {!isEmpty(methods) &&
          Object.keys(methods).map((methodName, index) => (
            <Function key={`oij_${index}`} name={methodName} parentName={moduleName} props={methods[methodName]} />
          ))}
      </div>
    </div>
  );
}
