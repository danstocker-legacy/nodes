import {Logger} from "./Logger";

describe("Logger", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: Logger = new Logger();
      expect(node.i.d_log).toBeDefined();
      expect(node.i.d_warn).toBeDefined();
      expect(node.i.d_err).toBeDefined();
      expect(node.o.d_log).toBeDefined();
      expect(node.o.d_warn).toBeDefined();
      expect(node.o.d_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Logger;

    beforeEach(function () {
      node = new Logger();
    });

    it("should forward log", function () {
      spyOn(node.o.d_log, "send");
      node.send(node.i.d_log, 5, "1");
      expect(node.o.d_log.send).toHaveBeenCalledWith(5, "1");
    });

    it("should forward warn", function () {
      spyOn(node.o.d_warn, "send");
      node.send(node.i.d_warn, 5, "1");
      expect(node.o.d_warn.send).toHaveBeenCalledWith(5, "1");
    });

    it("should forward err", function () {
      spyOn(node.o.d_err, "send");
      node.send(node.i.d_err, 5, "1");
      expect(node.o.d_err.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
