// CSS Module mapper that just returns the
// class name back as-is (rather than with
// some unique name).
module.exports = new Proxy(
  {},
  {
    get(target, key) {
      if (key === '__esModule') {
        return false;
      }

      return key;
    },
  },
);
