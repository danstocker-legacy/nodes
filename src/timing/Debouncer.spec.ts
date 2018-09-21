import {Debouncer} from "./Debouncer";

describe("Debouncer", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new Debouncer<any>(1000);
      expect(node.in.$.node).toBe(node);
      expect(node.out.$).toBeDefined();
    });

    describe("#send()", function () {
      let node: Debouncer<number>;

      beforeEach(function () {
        node = new Debouncer(500);
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe("after last input", function () {
        it("should pass values to output", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 5]]));
          node.send(new Map([[node.in.$, 6]]));
          node.send(new Map([[node.in.$, 7]]));
          jasmine.clock().tick(501);
          expect(node.out.$.send)
          .toHaveBeenCalledWith([5, 6, 7], undefined);
        });
      });

      describe("on new input within delay", function () {
        it("should restart timer", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 5]]));
          jasmine.clock().tick(499);
          node.send(new Map([[node.in.$, 6]]));
          jasmine.clock().tick(499);
          node.send(new Map([[node.in.$, 7]]));
          jasmine.clock().tick(501);
          expect(node.out.$.send)
          .toHaveBeenCalledWith([5, 6, 7], undefined);
        });
      });
    });
  });
});
