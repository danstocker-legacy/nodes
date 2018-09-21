import {Interval} from "./Interval";

describe("Interval", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: Interval = new Interval(1000);
      expect(node.out.$).toBeDefined();
    });

    it("should start timer", function () {
      const node: Interval = new Interval(1000);
      expect(node.timer).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Interval;

    beforeEach(function () {
      node = new Interval(500);
    });

    it("should throw error", function () {
      expect(function () {
        node.send(new Map());
      }).toThrow();
    });
  });

  describe("#onInterval()", function () {
    let node: Interval;

    beforeEach(function () {
      jasmine.clock().install();
      node = new Interval(500);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it("should send null to output", function () {
      spyOn(node.out.$, "send");
      const BuiltInDate = global.Date;
      spyOn(global, "Date").and.callFake(() => new BuiltInDate());
      jasmine.clock().tick(501);
      const timestamp = +new Date();
      expect(node.out.$.send).toHaveBeenCalledWith(timestamp, `${timestamp}`);
    });
  });
});
