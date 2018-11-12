import {Logger} from "./Logger";

describe("Logger", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: Logger = new Logger();
      expect(node.in.log).toBeDefined();
      expect(node.in.warn).toBeDefined();
      expect(node.in.err).toBeDefined();
      expect(node.out.log).toBeDefined();
      expect(node.out.warn).toBeDefined();
      expect(node.out.err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Logger;

    beforeEach(function () {
      node = new Logger();
    });

    it("should forward log", function () {
      spyOn(node.out.log, "send");
      node.send(node.in.log, 5, "1");
      expect(node.out.log.send).toHaveBeenCalledWith(5, "1");
    });

    it("should forward warn", function () {
      spyOn(node.out.warn, "send");
      node.send(node.in.warn, 5, "1");
      expect(node.out.warn.send).toHaveBeenCalledWith(5, "1");
    });

    it("should forward err", function () {
      spyOn(node.out.err, "send");
      node.send(node.in.err, 5, "1");
      expect(node.out.err.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
