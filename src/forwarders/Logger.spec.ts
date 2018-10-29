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
      node.in.$.send(5);
      // tslint:disable:no-console
      expect(console.log).toHaveBeenCalledWith(5);
      // tslint:enable:no-console
    });

    it("should forward log", function () {
      spyOn(node.out.log, "send");
      node.in.log.send(5, "1");
      expect(node.out.log.send).toHaveBeenCalledWith(5, "1");
    });

    it("should forward warn", function () {
      spyOn(node.out.warn, "send");
      node.in.warn.send(5, "1");
      expect(node.out.warn.send).toHaveBeenCalledWith(5, "1");
    });

    it("should forward error", function () {
      spyOn(node.out.error, "send");
      node.in.error.send(5, "1");
      expect(node.out.error.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
