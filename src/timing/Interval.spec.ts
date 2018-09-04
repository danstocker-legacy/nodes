import {Interval} from "./Interval";

describe("Interval", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const interval: Interval = new Interval(1000);
      expect(interval.ports.out.node).toBe(interval);
    });

    it("should start timer", function () {
      const interval: Interval = new Interval(1000);
      expect(interval.timer).toBeDefined();
    });
  });

  describe("#send()", function () {
    let interval: Interval;

    beforeEach(function () {
      interval = new Interval(500);
    });

    it("should throw error", function () {
      expect(function () {
        interval.send();
      }).toThrow();
    });
  });

  describe("#onInterval()", function () {
    let interval: Interval;

    beforeEach(function () {
      jasmine.clock().install();
      interval = new Interval(500);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it("should send null to output", function () {
      spyOn(interval.ports.out, "send");
      const BuiltInDate = global.Date;
      spyOn(global, "Date").and.callFake(() => new BuiltInDate());
      jasmine.clock().tick(501);
      expect(interval.ports.out.send).toHaveBeenCalledWith(null, +new Date());
    });
  });
});
