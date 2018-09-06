import {Debouncer} from "./Debouncer";

describe("Debouncer", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const debouncer: Debouncer<any> = new Debouncer(1000);
      expect(debouncer.ports.in.node).toBe(debouncer);
      expect(debouncer.ports.out).toBeDefined();
    });

    describe("#send()", function () {
      let debouncer: Debouncer<number>;

      beforeEach(function () {
        debouncer = new Debouncer(500);
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe("after last input", function () {
        it("should pass values to output", function () {
          spyOn(debouncer.ports.out, "send");
          debouncer.send(new Map([[debouncer.ports.in, 5]]));
          debouncer.send(new Map([[debouncer.ports.in, 6]]));
          debouncer.send(new Map([[debouncer.ports.in, 7]]));
          jasmine.clock().tick(501);
          expect(debouncer.ports.out.send)
          .toHaveBeenCalledWith([5, 6, 7], undefined);
        });
      });

      describe("on new input within delay", function () {
        it("should restart timer", function () {
          spyOn(debouncer.ports.out, "send");
          debouncer.send(new Map([[debouncer.ports.in, 5]]));
          jasmine.clock().tick(499);
          debouncer.send(new Map([[debouncer.ports.in, 6]]));
          jasmine.clock().tick(499);
          debouncer.send(new Map([[debouncer.ports.in, 7]]));
          jasmine.clock().tick(501);
          expect(debouncer.ports.out.send)
          .toHaveBeenCalledWith([5, 6, 7], undefined);
        });
      });
    });
  });
});
