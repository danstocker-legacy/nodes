import {ChangeFilter} from "./ChangeFilter";

describe("ChangeFilter", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new ChangeFilter<number>();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: ChangeFilter<number>;

    beforeEach(function () {
      node = new ChangeFilter();
      node.send(new Map([[node.in.$, 5]]));
    });

    describe("when sending same value", function () {
      it("should not pass value to output", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, 5]]));
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("when sending different value", function () {
      it("should pass value to output", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, 6]]));
        expect(node.out.$.send)
        .toHaveBeenCalledWith(6, undefined);
      });
    });

    describe("with custom equals", function () {
      beforeEach(function () {
        node = new ChangeFilter((a, b) => (a % 2) === (b % 2));
        node.send(new Map([[node.in.$, 5]]));
      });

      describe("when sending equivalent value", function () {
        it("should not pass value to output", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 7]]));
          expect(node.out.$.send).not.toHaveBeenCalled();
        });
      });

      describe("when sending non-equivalent value", function () {
        it("should pass value to output", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 6]]));
          expect(node.out.$.send)
          .toHaveBeenCalledWith(6, undefined);
        });
      });
    });
  });
});
