const filterDefinedData = (obj = {}, fieldMap = {}) => {
  // ✅ guard
  if (!obj || typeof obj !== "object") return {};

  const nested = {};

  for (const [key, value] of Object.entries(obj)) {
    // ✅ correct filtering
    if (value === null || value === "" || value === undefined) continue;

    const parentKey = fieldMap[key];

    if (parentKey) {
      nested[parentKey] ??= {};
      nested[parentKey][key] = value;
    } else {
      nested[key] = value;
    }
  }

  // ✅ return empty object if nothing valid
  if (Object.keys(nested).length === 0) {
    return {};
  }

  nested.updatedAt = new Date();

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

  return convertIntoDotNotation(nested);
};

module.exports = filterDefinedData;
