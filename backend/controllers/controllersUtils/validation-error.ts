
const validationError = (errors: any) => {
  const errorMessages = errors
    .array()
    .map((error: { msg: string }) => error.msg)
    .join(", ");
  return errorMessages !== "Invalid value" ? errorMessages : "Invalid inputs!";
};

export default validationError;
