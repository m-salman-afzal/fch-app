export const camelToTitleCase = (s: string) => {
  if (s === s.toUpperCase()) {
    return s.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
  const result = s.replace(/([A-Z])/g, ' $1');

  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const getProperCase = (input: string) => {
  if (input.split('_').length <= 1) {
    return camelToTitleCase(input);
  }

  let camelCaseStr = input
    .toLowerCase()
    .replace(/(_\w)/g, match => match[1].toUpperCase());

  let properCaseStr = camelCaseStr
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());

  return properCaseStr
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
