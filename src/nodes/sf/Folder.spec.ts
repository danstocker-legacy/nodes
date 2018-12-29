import {Folder} from "./Folder";

describe("Folder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Folder(() => null);
      expect(node.i.i).toBeDefined();
      expect(node.b.i).toBeDefined();
      expect(node.o.d_fold).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Folder<number, number>;

    beforeEach(function () {
      node = new Folder((curr, next) => curr + next, 1);
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

      it("should reset reduced value", function () {
        spyOn(node.o.d_fold, "send");
        node.send(node.i.i, {d_res: true, d_val: 5}, "1");
        expect(node.o.d_fold.send).toHaveBeenCalledWith(6, "1");
      });
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Folder(() => {
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
