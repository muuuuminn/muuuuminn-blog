const config = {
  "*.@(ts|tsx)": "bash -c tsc",
  "*.@(js|ts|tsx)": "biome lint src",
  "**/__tests__/?(*.)+(spec|test).[jt]s?(x)": "jest --ci",
};

module.exports = config;
