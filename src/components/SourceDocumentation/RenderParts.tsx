export const Parameter = ({ name, arg }) => {
  return (
    <>
      <b>{name}</b> : <i>{arg.annotation}</i>
      <p className="parameter-description">{arg.description}</p>
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
        <i>{returns.annotation}</i>
        <p className="parameter-description">{returns.description}</p>
      </ul>
    </div>
  );
};

export const InstanceVariables = ({ variables }) => {
  return (
    <div className="parameters">
      <b>Variables:</b>
      <ul>
        {Object.keys(variables).map((name, index) => {
          return (
            <li key={`variable_${index}`}>
              <b>{name}</b> : <i>{variables[name]['annotation']}</i>
              <p className="parameter-description">{variables[name]['description']}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
