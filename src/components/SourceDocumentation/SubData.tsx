export const moduleFromString = (fullName: string, data: any) => {
  const split = fullName.split('.');
  let subData = data;
  for (let i = 1; i < split.length - 1; i++) {
    subData = subData['submodules'][split[i]];
  }
  subData = subData['submodules'][split[split.length - 1]];
  return subData;
};

export const classFromString = (fullName: string, data: any) => {
  const split = fullName.split('.');
  let subData = data;
  for (let i = 1; i < split.length - 1; i++) {
    subData = subData['submodules'][split[i]];
  }
  subData = subData['classes'][split[split.length - 1]];
  return subData;
};
