import {Logger} from "./Logger";

describe("Logger", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: Logger = new Logger();
      expect(node.i.log).toBeDefined();
      expect(node.i.warn).toBeDefined();
      expect(node.i.err).toBeDefined();
      expect(node.o.log).toBeDefined();
      expect(node.o.warn).toBeDefined();
      expect(node.o.err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Logger;

    beforeEach(function () {
      node = new Logger();
    });

    it("should forward log", function () {
      spyOn(node.o.log, "send");
      node.send(node.i.log, 5, "1");
      expect(node.o.log.send).toHaveBeenCalledWith(5, "1");
    });

    it("should forward warn", function () {
      spyOn(node.o.warn, "send");
      node.send(node.i.warn, 5, "1");
      expect(node.o.warn.send).toHaveBeenCalledWith(5, "1");
    });

    it("should forward err", function () {
      spyOn(node.o.err, "send");
      node.send(node.i.err, 5, "1");
      expect(node.o.err.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
