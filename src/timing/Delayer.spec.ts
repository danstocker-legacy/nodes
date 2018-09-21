import {Delayer} from "./Delayer";

describe("Delayer", function () {
  describe("constructor", function () {
    it("should set ports", function () {
      const node = new Delayer<any>(1000);
      expect(node.in.$.node).toBe(node);
      expect(node.out).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Delayer<number>;

    beforeEach(function () {
      node = new Delayer(500);
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    describe("when delay has not passed", function () {
      it("should not invoke output", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, 5]]));
        jasmine.clock().tick(499);
        expect(node.out.$.send).not.toHaveBeenCalledWith(5, undefined);
      });
    });

    describe("when delay passed", function () {
      it("should pass value to output", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, 5]]));
        jasmine.clock().tick(501);
        expect(node.out.$.send).toHaveBeenCalledWith(5, undefined);
      });
    });
  });
});
