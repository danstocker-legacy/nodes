import {OutPort} from "../node/index";
import {Synchronizer} from "./Synchronizer";

describe("Synchronizer", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const synchronizer = new Synchronizer(2);
      expect(synchronizer.ports.in1.node).toBe(synchronizer);
      expect(synchronizer.ports.in2.node).toBe(synchronizer);
      expect(synchronizer.ports.out1.node).toBe(synchronizer);
      expect(synchronizer.ports.out2.node).toBe(synchronizer);
    });

    it("should set count", function () {
      const synchronizer = new Synchronizer(2);
      expect(synchronizer.count).toBe(2);
    });
  });

  describe("#send()", function () {
    let synchronizer: Synchronizer;

    beforeEach(function () {
      synchronizer = new Synchronizer(2);
    });

    describe("on incomplete input set(s)", function () {
      it("should not forward inputs", function () {
        spyOn(OutPort.prototype, "send");
        synchronizer.ports.in1.send("foo", 1);
        synchronizer.ports.in2.send("quux", 2);
        expect(OutPort.prototype.send).not.toHaveBeenCalled();
      });
    });

    describe("on complete input set", function () {
      beforeEach(function () {
        synchronizer.ports.in1.send("foo", 1);
        synchronizer.ports.in2.send("quux", 2);
      });

      it("should forward input set", function () {
        spyOn(synchronizer.ports.out1, "send");
        spyOn(synchronizer.ports.out2, "send");
        synchronizer.ports.in1.send("baz", 2);
        expect(synchronizer.ports.out1.send).toHaveBeenCalledWith("baz", 2);
        expect(synchronizer.ports.out2.send).toHaveBeenCalledWith("quux", 2);
        synchronizer.ports.in2.send("bar", 1);
        expect(synchronizer.ports.out1.send).toHaveBeenCalledWith("foo", 1);
        expect(synchronizer.ports.out2.send).toHaveBeenCalledWith("bar", 1);
      });
    });
  });
});
