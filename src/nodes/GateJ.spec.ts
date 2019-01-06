import {GateJ} from "./GateJ";

describe("GateJ", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new GateJ<number>();
      expect(node.i.d_val).toBeDefined();
      expect(node.i.st_open).toBeDefined();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("on input", function () {
    let node: GateJ<number>;

    beforeEach(function () {
      node = new GateJ();
    });

    describe("when gate is open", function () {
      it("should forward input", function () {
        spyOn(node.o.d_val, "send");
        node.i.d_val.send(5, "1");
        node.i.st_open.send(true, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when gate is closed", function () {
      it("should not forward input", function () {
        spyOn(node.o.d_val, "send");
        node.i.d_val.send(5, "1");
        node.i.st_open.send(false, "1");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });
    });
  });
});
