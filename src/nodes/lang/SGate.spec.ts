import {SGate} from "./SGate";

describe("SGate", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new SGate();
      expect(node.i.i).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.b_i).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: SGate<number>;

    beforeEach(function () {
      node = new SGate();
    });

    describe("when 'st_open' is truthy", function () {
      it("should forward value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.i, {d_val: 2, st_open: true}, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(2, "1");
      });
    });

    describe("when 'st_open' is falsy", function () {
      it("should not forward value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.i, {d_val: 2, st_open: false}, "1");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });

      it("should bounce input", function () {
        spyOn(node.o.b_i, "send");
        node.send(node.i.i, {d_val: 2, st_open: false}, "1");
        expect(node.o.b_i.send)
        .toHaveBeenCalledWith({d_val: 2, st_open: false}, "1");
      });
    });
  });
});
