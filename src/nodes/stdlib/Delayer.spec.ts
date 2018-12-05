import {Delayer} from "./Delayer";

describe("Delayer", function () {
  beforeEach(function () {
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Delayer(0);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Delayer<number>;

    beforeEach(function () {
      node = new Delayer(500);
    });

    describe("until delay has passed", function () {
      beforeEach(function () {
        node.send(node.i.$, 5, "1");
      });

      it("should not forward", function () {
        spyOn(node.o.$, "send");
        jasmine.clock().tick(499);
        expect(node.o.$.send).not.toHaveBeenCalled();
      });
    });

    describe("when delay has passed", function () {
      beforeEach(function () {
        node.send(node.i.$, 5, "1");
      });

      it("should forward", function () {
        spyOn(node.o.$, "send");
        jasmine.clock().tick(500);
        expect(node.o.$.send).toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
