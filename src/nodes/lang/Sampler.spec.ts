import {Sampler} from "./Sampler";

describe("Sampler", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Sampler();
      expect(node.i.d_val).toBeDefined();
      expect(node.i.ev_smp).toBeDefined();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Sampler<number>;

    beforeEach(function () {
      node = new Sampler();
    });

    describe("on receiving value", function () {
      it("should not send to output", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.d_val, 5);
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });
    });

    describe("on receiving ev_smp", function () {
      beforeEach(function () {
        node.send(node.i.d_val, 5);
      });

      it("should release buffered value with tag", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.ev_smp, null, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
