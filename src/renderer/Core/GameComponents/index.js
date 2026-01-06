const req = require.context("./", true, /.js$/);
export const components = req
  .keys()
  .filter(key => key !== "./index.js")
  .map(req)
  .reduce((acc, module) => {
    return { ...acc, ...module };
  }, {});
console.log("Available components:", components);
