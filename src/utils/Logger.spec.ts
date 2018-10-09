import {Logger} from "./Logger";

describe("Logger", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: Logger = new Logger();
      expect(node.in.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Logger;

    beforeEach(function () {
      node = new Logger();
    });

    it("should pass value to console.log", function () {
      spyOn(console, "log");
      node.send(new Map([[node.in.$, 5]]));
      // tslint:disable:no-console
      expect(console.log).toHaveBeenCalledWith(5);
    });
  });
});
