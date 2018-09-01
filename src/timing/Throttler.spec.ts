import {Throttler} from "./Throttler";

describe("Throttler", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const debouncer: Throttler<any> = new Throttler(1000);
      expect(debouncer.ports.in.node).toBe(debouncer);
      expect(debouncer.ports.out.node).toBe(debouncer);
    });

    describe("#in()", function () {
      let debouncer;

      beforeEach(function () {
        debouncer = new Throttler(500);
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe("after delay", function () {
        it("should pass values to output", function () {
          spyOn(debouncer.ports.out, "send");
          debouncer.in(debouncer.ports.in, 5);
          jasmine.clock().tick(250);
          debouncer.in(debouncer.ports.in, 6);
          jasmine.clock().tick(249);
          debouncer.in(debouncer.ports.in, 7);
          jasmine.clock().tick(2);
          expect(debouncer.ports.out.send).toHaveBeenCalledWith([5, 6, 7]);
        });
      });
    });
  });
});
