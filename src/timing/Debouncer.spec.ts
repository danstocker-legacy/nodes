import {Debouncer} from "./Debouncer";

describe("Debouncer", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new Debouncer<any>(1000);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    beforeEach(function () {
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    describe("when callback & initial are specified", function () {
      let node: Debouncer<number>;

      beforeEach(function () {
        node = new Debouncer(500, (current, next) => current + next, 0);
      });

      describe("after last input", function () {
        it("should pass reduced to output", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 5]]), "1");
          node.send(new Map([[node.in.$, 6]]), "2");
          node.send(new Map([[node.in.$, 7]]), "3");
          jasmine.clock().tick(501);
          expect(node.out.$.send)
          .toHaveBeenCalledWith(18, "3");
        });
      });

      describe("on new input within delay", function () {
        it("should restart timer", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 5]]), "1");
          jasmine.clock().tick(499);
          node.send(new Map([[node.in.$, 6]]), "2");
          jasmine.clock().tick(499);
          node.send(new Map([[node.in.$, 7]]), "3");
          jasmine.clock().tick(501);
          expect(node.out.$.send)
          .toHaveBeenCalledWith(18, "3");
        });
      });
    });

    describe("when callback & initial are not specified", function () {
      let node: Debouncer<number>;

      beforeEach(function () {
        node = new Debouncer(500);
      });

      describe("after last input", function () {
        it("should pass values to output", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 5]]), "1");
          node.send(new Map([[node.in.$, 6]]), "2");
          node.send(new Map([[node.in.$, 7]]), "3");
          jasmine.clock().tick(501);
          expect(node.out.$.send)
          .toHaveBeenCalledWith([5, 6, 7], "3");
        });
      });
    });
  });
});
