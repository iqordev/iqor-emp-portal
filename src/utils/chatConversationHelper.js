import sha256 from "js-sha256";

export const getUniqueName = (tags, domainId) => {
  let currentTags = [...tags, domainId];
  var hash = sha256.create();
  hash.update(currentTags.sort().join(","));
  const uniqueName = hash.hex();
  return uniqueName;
};
