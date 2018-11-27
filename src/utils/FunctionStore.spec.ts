import {FunctionStore} from "./FunctionStore";

describe("FunctionStore", function () {
  beforeEach(function () {
    FunctionStore.clear();
  });

  describe("get()", function () {
    it("should eval function body", function () {
      const result = FunctionStore.get("() => \"foo\"");
      expect(typeof result).toBe("function");
      expect(result.toString()).toBe("() => \"foo\"");
    });

    describe("on subsequent calls", function () {
      let fn: (...args) => any;

      beforeEach(function () {
        fn = FunctionStore.get("() => \"foo\"");
      });

      it("should return dame function", function () {
        const result = FunctionStore.get("() => \"foo\"");
        expect(result).toBe(fn);
      });
    });

    it("should work with generators", function () {
      expect(function () {
        FunctionStore.get("function* () {}");
      }).not.toThrow();
    });
  });
});
