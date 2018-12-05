import {Ticker} from "./Ticker";

describe("Ticker", function () {
  beforeEach(function () {
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Ticker(0);
      expect(node.o.$).toBeDefined();
    });
  });

  describe("between intervals", function () {
    let node: Ticker;

    beforeEach(function () {
      node = new Ticker(500);
      jasmine.clock().tick(100);
    });

    it("should not send to output", function () {
      spyOn(node.o.$, "send");
      jasmine.clock().tick(100);
      expect(node.o.$.send).not.toHaveBeenCalled();
    });
  });

  describe("on interval", function () {
    let node: Ticker;

    beforeEach(function () {
      node = new Ticker(500);
    });

    it("should send true to output", function () {
      spyOn(node.o.$, "send");
      jasmine.clock().tick(500);
      expect(node.o.$.send).toHaveBeenCalledWith(true, null);
    });
  });
});
