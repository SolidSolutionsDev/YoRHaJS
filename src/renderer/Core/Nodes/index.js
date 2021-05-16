const req = require.context("./", true, /.js$/);
export const nodes = req
  .keys()
  .map(req)
  .reduce((acc, module) => {
    return { ...acc, ...module };
  }, {});
console.log("Available nodes:", nodes);
