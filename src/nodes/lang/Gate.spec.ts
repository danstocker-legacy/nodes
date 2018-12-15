import {Gate} from "./Gate";

describe("Gate", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Gate();
      expect(node.i.mul).toBeDefined();
      expect(node.i.d_val).toBeDefined();
      expect(node.i.st_open).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.b_mul).toBeDefined();
      expect(node.o.b_d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Gate<number>;

    beforeEach(function () {
      node = new Gate();
    });

    describe("when sending to `mul`", function () {
      describe("when `open` is truthy", function () {
        it("should forward value", function () {
          spyOn(node.o.d_val, "send");
          node.send(node.i.mul, {d_val: 2, st_open: true}, "1");
          expect(node.o.d_val.send).toHaveBeenCalledWith(2, "1");
        });
      });

      describe("when `open` is falsy", function () {
        it("should not forward value", function () {
          spyOn(node.o.d_val, "send");
          node.send(node.i.mul, {d_val: 2, st_open: false}, "1");
          expect(node.o.d_val.send).not.toHaveBeenCalled();
        });

        it("should bounce input", function () {
          spyOn(node.o.b_mul, "send");
          node.send(node.i.mul, {d_val: 2, st_open: false}, "1");
          expect(node.o.b_mul.send)
          .toHaveBeenCalledWith({d_val: 2, st_open: false}, "1");
        });
      });
    });

    describe("when sending to `d_val`", function () {
      describe("when gate is open", function () {
        beforeEach(function () {
          node.send(node.i.st_open, true, "1");
        });

        it("should forward value", function () {
          spyOn(node.o.d_val, "send");
          node.send(node.i.d_val, 2, "2");
          expect(node.o.d_val.send).toHaveBeenCalledWith(2, "2");
        });
      });

      describe("when gate is closed", function () {
        beforeEach(function () {
          node.send(node.i.st_open, false, "1");
        });

        it("should not forward value", function () {
          spyOn(node.o.d_val, "send");
          node.send(node.i.d_val, 2, "2");
          expect(node.o.d_val.send).not.toHaveBeenCalled();
        });

        it("should bounce input", function () {
          spyOn(node.o.b_d_val, "send");
          node.send(node.i.d_val, 2, "2");
          expect(node.o.b_d_val.send).toHaveBeenCalledWith(2, "2");
        });
      });
    });
  });
});
