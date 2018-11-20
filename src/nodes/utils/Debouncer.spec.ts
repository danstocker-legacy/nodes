import {Debouncer} from "./Debouncer";

describe("Debouncer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Debouncer(0);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Debouncer;

    beforeEach(function () {
      jasmine.clock().install();
      node = new Debouncer(500);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    describe("on new input within delay", function () {
      beforeEach(function () {
        node.send(node.in.$, 5, "1");
      });

      it("should send false with previous tag", function () {
        jasmine.clock().tick(499);
        spyOn(node.out.$, "send");
        node.send(node.in.$, 5, "2");
        expect(node.out.$.send).toHaveBeenCalledWith(false, "1");
      });
    });

    describe("on timer expiry", function () {
      beforeEach(function () {
        node.send(node.in.$, 5, "1");
      });

      it("should send true with last tag", function () {
        spyOn(node.out.$, "send");
        jasmine.clock().tick(500);
        expect(node.out.$.send).toHaveBeenCalledWith(true, "1");
      });
    });
  });
});
