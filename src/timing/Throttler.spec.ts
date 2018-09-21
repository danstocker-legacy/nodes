import {Throttler} from "./Throttler";

describe("Throttler", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new Throttler<any>(1000);
      expect(node.in.$.node).toBe(node);
      expect(node.out.$).toBeDefined();
    });

    describe("#send()", function () {
      let node: Throttler<number>;

      beforeEach(function () {
        node = new Throttler(500);
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe("after delay", function () {
        it("should pass values to output", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 5]]));
          jasmine.clock().tick(250);
          node.send(new Map([[node.in.$, 6]]));
          jasmine.clock().tick(249);
          node.send(new Map([[node.in.$, 7]]));
          jasmine.clock().tick(2);
          expect(node.out.$.send)
          .toHaveBeenCalledWith([5, 6, 7], undefined);
        });
      });
    });
  });
});
