import {Filter} from "./Filter";

describe("Filter", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Filter();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Filter<number>;

    beforeEach(function () {
      node = new Filter();
    });

    describe("when ref is truthy", function () {
      it("should forward value", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, {val: 2, incl: true}, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(2, "1");
      });
    });

    describe("when ref is falsy", function () {
      it("should not forward value", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, {val: 2, incl: false}, "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });
  });
});
