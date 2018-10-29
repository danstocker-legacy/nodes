import {Console} from "./Console";

describe("Console", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: Console = new Console();
      expect(node.in.log).toBeDefined();
      expect(node.in.warn).toBeDefined();
      expect(node.in.error).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Console;

    beforeEach(function () {
      node = new Console();
    });

    // tslint:disable:no-console
    it("should pass log to console.log", function () {
      spyOn(console, "log");
      node.in.log.send(5);
      expect(console.log).toHaveBeenCalledWith(5);
    });

    it("should pass warn to console.warn", function () {
      spyOn(console, "warn");
      node.in.warn.send(5);
      expect(console.warn).toHaveBeenCalledWith(5);
    });

    it("should pass error to console.error", function () {
      spyOn(console, "error");
      node.in.error.send(5);
      expect(console.error).toHaveBeenCalledWith(5);
    });
    // tslint:enable:no-console
  });
});
