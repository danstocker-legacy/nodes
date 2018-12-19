import {SFolder} from "./SFolder";

describe("SFolder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new SFolder(() => null);
      expect(node.i.mul).toBeDefined();
      expect(node.o.b_mul).toBeDefined();
      expect(node.o.d_fold).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: SFolder<number, number>;

    beforeEach(function () {
      node = new SFolder((curr, next) => curr + next, 1);
    });

    describe("before first truthy signal", function () {
      it("should apply callback to initial value", function () {
        spyOn(node.o.d_fold, "send");
        node.send(node.i.mul, {ev_res: false, d_val: 5}, "1");
        expect(node.o.d_fold.send).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when 'ev_res' is falsy", function () {
      beforeEach(function () {
        node.send(node.i.mul, {ev_res: false, d_val: 2}, "1");
        node.send(node.i.mul, {ev_res: false, d_val: 3}, "2");
      });

      it("should apply callback to last reduced value", function () {
        spyOn(node.o.d_fold, "send");
        node.send(node.i.mul, {ev_res: false, d_val: 5}, "3");
        expect(node.o.d_fold.send).toHaveBeenCalledWith(11, "3");
      });
    });

    describe("when 'ev_res' is truthy", function () {
      beforeEach(function () {
        node.send(node.i.mul, {ev_res: false, d_val: 2}, "1");
        node.send(node.i.mul, {ev_res: false, d_val: 3}, "2");
      });

      it("should reset reduced value", function () {
        spyOn(node.o.d_fold, "send");
        node.send(node.i.mul, {ev_res: true, d_val: 5}, "1");
        expect(node.o.d_fold.send).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new SFolder(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.o.b_mul, "send");
        node.send(node.i.mul, {ev_res: false, d_val: 5}, "1");
        expect(node.o.b_mul.send).toHaveBeenCalledWith({
          d_val: 5,
          ev_res: false
        }, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.mul, {ev_res: false, d_val: 5}, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
