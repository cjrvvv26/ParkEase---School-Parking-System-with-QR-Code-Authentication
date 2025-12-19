const filterDefinedData = (obj, fieldMap) => {
  const nested = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null && value === "" && value === undefined) continue;

    const parentKey = fieldMap[key];
    if (parentKey) {
      nested[parentKey] = nested[parentKey] || {};
      nested[parentKey][key] = value;
    } else {
      nested[key] = value;
    }
  }

  const convertIntoDotNotation = (obj, parent = "", result = {}) => {
    for (const [key, value] of Object.entries(obj)) {
      const path = parent ? `${parent}.${key}` : key;
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        convertIntoDotNotation(value, path, result);
      } else {
        result[path] = value;
      }
    }

    return result;
  };

  nested.updatedAt = new Date();
  return convertIntoDotNotation(nested);
};

module.exports = filterDefinedData;
