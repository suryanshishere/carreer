export const generatePostCodeVersion = (
  postCode: string,
  version: string = "main"
) => {
  return postCode + "_1_" + version;
};
