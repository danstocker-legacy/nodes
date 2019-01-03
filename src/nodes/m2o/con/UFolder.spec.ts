import {UFolder} from "./UFolder";

describe("UFolder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new UFolder(() => null);
      expect(node.i.i).toBeDefined();
      expect(node.b.i).toBeDefined();
      expect(node.o.d_fold).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: UFolder<number, number>;

    beforeEach(function () {
      node = new UFolder((curr, next) => curr + next, 1);
    });

    describe("when 'd_res' is falsy", function () {
      beforeEach(function () {
        node.send(node.i.i, {d_res: false, d_val: 2}, "1");
        node.send(node.i.i, {d_res: false, d_val: 3}, "2");
      });

      it("should not emit", function () {
        spyOn(node.o.d_fold, "send");
        node.send(node.i.i, {d_res: false, d_val: 5}, "3");
        expect(node.o.d_fold.send).not.toHaveBeenCalled();
      });
    });

    describe("when 'd_res' is truthy", function () {
      beforeEach(function () {
        node.send(node.i.i, {d_res: false, d_val: 2}, "1");
        node.send(node.i.i, {d_res: false, d_val: 3}, "2");
      });

      it("should emit folded value", function () {
        spyOn(node.o.d_fold, "send");
        node.send(node.i.i, {d_res: true, d_val: 5}, "3");
        expect(node.o.d_fold.send).toHaveBeenCalledWith(11, "3");
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new UFolder(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.b.i, "send");
        node.send(node.i.i, {d_res: false, d_val: 5}, "1");
        expect(node.b.i.send).toHaveBeenCalledWith({
          d_res: false,
          d_val: 5
        }, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.i, {d_res: false, d_val: 5}, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
