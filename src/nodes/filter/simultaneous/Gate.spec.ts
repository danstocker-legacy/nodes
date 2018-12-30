import {Gate} from "./Gate";

describe("Gate", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Gate();
      expect(node.i.i).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.b.i).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Gate<number>;

    beforeEach(function () {
      node = new Gate();
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
        spyOn(node.b.i, "send");
        node.send(node.i.i, {d_val: 2, st_open: false}, "1");
        expect(node.b.i.send)
        .toHaveBeenCalledWith({d_val: 2, st_open: false}, "1");
      });
    });
  });
});
