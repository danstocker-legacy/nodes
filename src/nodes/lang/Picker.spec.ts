import {Picker} from "./Picker";

describe("Picker", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Picker();
      expect(node.i.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Picker<number>;

    beforeEach(function () {
      node = new Picker();
    });

    describe("when ref is truthy", function () {
      it("should forward value", function () {
        spyOn(node.out.$, "send");
        node.send(node.i.$, {$: 2, include: true}, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(2, "1");
      });
    });

    describe("when ref is falsy", function () {
      it("should not forward value", function () {
        spyOn(node.out.$, "send");
        node.send(node.i.$, {$: 2, include: false}, "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });
  });
});
