import {Delayer} from "./Delayer";

describe("Delayer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Delayer(0);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Delayer<number>;

    beforeEach(function () {
      node = new Delayer(500);
    });

    describe("until delay has passed", function () {
      beforeEach(function () {
        jasmine.clock().install();
        node.send(node.in.$, 5, "1");
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("should not forward", function () {
        spyOn(node.out.$, "send");
        jasmine.clock().tick(499);
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("when delay has passed", function () {
      beforeEach(function () {
        jasmine.clock().install();
        node.send(node.in.$, 5, "1");
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("should forward", function () {
        spyOn(node.out.$, "send");
        jasmine.clock().tick(500);
        expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
