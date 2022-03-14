const isCharNumber = (c: string) => {
  return c >= '0' && c <= '9';
};
const processText = (input: string) => {
  let startIndex = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (isCharNumber(input.charAt(i))) {
      startIndex = i;
      break;
    }
  }
  const newInput = input.substring(startIndex);
  let number = parseFloat(newInput);
  return number;
};
export default processText;
