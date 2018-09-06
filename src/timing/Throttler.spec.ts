import {Throttler} from "./Throttler";

describe("Throttler", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const debouncer: Throttler<any> = new Throttler(1000);
      expect(debouncer.ports.in.node).toBe(debouncer);
      expect(debouncer.ports.out).toBeDefined();
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
          spyOn(throttler.ports.out, "send");
          throttler.send(new Map([[throttler.ports.in, 5]]));
          jasmine.clock().tick(250);
          throttler.send(new Map([[throttler.ports.in, 6]]));
          jasmine.clock().tick(249);
          throttler.send(new Map([[throttler.ports.in, 7]]));
          jasmine.clock().tick(2);
          expect(throttler.ports.out.send)
          .toHaveBeenCalledWith([5, 6, 7], undefined);
        });
      });
    });
  });
});
