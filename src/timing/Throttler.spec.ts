import {Throttler} from "./Throttler";

describe("Throttler", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const debouncer: Throttler<any> = new Throttler(1000);
      expect(debouncer.in.$.node).toBe(debouncer);
      expect(debouncer.out.$).toBeDefined();
    });

    describe("#send()", function () {
      let throttler: Throttler<number>;

      beforeEach(function () {
        throttler = new Throttler(500);
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe("after delay", function () {
        it("should pass values to output", function () {
          spyOn(throttler.out.$, "send");
          throttler.send(new Map([[throttler.in.$, 5]]));
          jasmine.clock().tick(250);
          throttler.send(new Map([[throttler.in.$, 6]]));
          jasmine.clock().tick(249);
          throttler.send(new Map([[throttler.in.$, 7]]));
          jasmine.clock().tick(2);
          expect(throttler.out.$.send)
          .toHaveBeenCalledWith([5, 6, 7], undefined);
        });
      });
    });
  });
});
