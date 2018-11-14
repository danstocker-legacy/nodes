import {Interval} from "./Interval";

describe("Interval", function () {
  beforeEach(function () {
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Interval(0);
      expect(node.out.$).toBeDefined();
    });
  });

  describe("between intervals", function () {
    let node: Interval;

    beforeEach(function () {
      node = new Interval(500);
      jasmine.clock().tick(100);
    });

    it("should not send to output", function () {
      spyOn(node.out.$, "send");
      jasmine.clock().tick(100);
      expect(node.out.$.send).not.toHaveBeenCalled();
    });
  });

  describe("on interval", function () {
    let node: Interval;

    beforeEach(function () {
      node = new Interval(500);
    });

    it("should send null to output", function () {
      spyOn(node.out.$, "send");
      jasmine.clock().tick(500);
      expect(node.out.$.send).toHaveBeenCalledWith(true, null);
    });
  });
});
