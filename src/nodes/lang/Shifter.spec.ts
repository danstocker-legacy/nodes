import {Shifter} from "./Shifter";

describe("Shifter", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Shifter();
      expect(node.i.d_val).toBeDefined();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Shifter<number>;

    beforeEach(function () {
      node = new Shifter(2);
    });

    describe("until displacement is reached", function () {
      beforeEach(function () {
        node.send(node.i.d_val, 5, "1");
      });

      it("should send undefined", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.d_val, 2, "2");
        expect(node.o.d_val.send).toHaveBeenCalledWith(undefined, "2");
      });
    });

    describe("after displacement passed", function () {
      beforeEach(function () {
        node.send(node.i.d_val, 5, "1");
        node.send(node.i.d_val, 2, "2");
      });

      it("should forward displaced input value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.d_val, 8, "3");
        expect(node.o.d_val.send).toHaveBeenCalledWith(5, "3");
      });
    });
  });
});
