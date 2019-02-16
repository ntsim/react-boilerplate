const promises = {};
const resolvers = {};
/**
 * Start a new async task that is expected
 * to resolve some messages.
 *
 * @param {string} taskKey
 */
const startTask = taskKey => {
  promises[taskKey] = new Promise(resolve => {
    resolvers[taskKey] = resolve;
  });
};

/**
 * Resolve the task with its resultant messages.
 *
 * @param {string} taskKey
 * @param {array} errors
 * @param {array} warnings
 */
const resolveTaskMessages = (taskKey, { errors = [], warnings = [] }) => {
  resolvers[taskKey]({
    errors,
    warnings,
  });
};

/**
 * Get the all of the messages for all tasks
 * once they have all been resolved.
 *
 * @returns {Promise<{errors: [], warnings: []}>}
 */
const getMessages = async () => {
  const results = Promise.all(Object.values(this.promises));

  return results.reduce(
    (acc, result) => {
      acc.errors.push(result.errors);
      acc.warnings.push(result.warnings);
      return acc;
    },
    {
      errors: [],
      warnings: [],
    },
  );
};

module.exports = {
  startTask,
  resolveTaskMessages,
  getMessages,
};
