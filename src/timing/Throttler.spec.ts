import {Throttler} from "./Throttler";

describe("Throttler", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new Throttler<any>(1000);
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
      let node: Throttler<number>;

      beforeEach(function () {
        node = new Throttler(500, (current, next) => current + next, 0);
      });

      describe("after delay", function () {
        it("should pass reduced to output", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 5]]), "1");
          jasmine.clock().tick(250);
          node.send(new Map([[node.in.$, 6]]), "2");
          jasmine.clock().tick(249);
          node.send(new Map([[node.in.$, 7]]), "3");
          jasmine.clock().tick(2);
          expect(node.out.$.send).toHaveBeenCalledTimes(1);
          expect(node.out.$.send)
          .toHaveBeenCalledWith(18, "1");
        });
      });
    });

    describe("when callback & initial are not specified", function () {
      let node: Throttler<number>;

      beforeEach(function () {
        node = new Throttler(500);
      });

      describe("after delay", function () {
        it("should pass values to output", function () {
          spyOn(node.out.$, "send");
          node.send(new Map([[node.in.$, 5]]), "1");
          jasmine.clock().tick(250);
          node.send(new Map([[node.in.$, 6]]), "2");
          jasmine.clock().tick(249);
          node.send(new Map([[node.in.$, 7]]), "3");
          jasmine.clock().tick(2);
          expect(node.out.$.send).toHaveBeenCalledTimes(1);
          expect(node.out.$.send)
          .toHaveBeenCalledWith([5, 6, 7], "1");
        });
      });
    });
  });
});
