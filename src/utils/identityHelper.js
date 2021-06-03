export const getNameWithComma = (name) => {
  if (!name) return;

  const separator = name.indexOf(",");
  const lastName = name.substring(0, separator);
  const firstName = name.substring(separator + 2, name.length);
  return [firstName, lastName];
};

export const getNameWithDomainId = (name) => {
  const separator = name.indexOf(".");
  const firstName = name.substring(0, separator);
  const lastName = name.substring(separator + 1, name.length);
  return [firstName, lastName];
};
