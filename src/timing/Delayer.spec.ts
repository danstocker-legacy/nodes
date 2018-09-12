import {Delayer} from "./Delayer";

describe("Delayer", function () {
  describe("constructor", function () {
    it("should set ports", function () {
      const delayer: Delayer<any> = new Delayer(1000);
      expect(delayer.in.$.node).toBe(delayer);
      expect(delayer.out).toBeDefined();
    });
  });

  describe("#send()", function () {
    let delayer: Delayer<number>;

    beforeEach(function () {
      delayer = new Delayer(500);
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    describe("when delay has not passed", function () {
      it("should not invoke output", function () {
        spyOn(delayer.out.$, "send");
        delayer.send(new Map([[delayer.in.$, 5]]));
        jasmine.clock().tick(499);
        expect(delayer.out.$.send).not.toHaveBeenCalledWith(5, undefined);
      });
    });

    describe("when delay passed", function () {
      it("should pass value to output", function () {
        spyOn(delayer.out.$, "send");
        delayer.send(new Map([[delayer.in.$, 5]]));
        jasmine.clock().tick(501);
        expect(delayer.out.$.send).toHaveBeenCalledWith(5, undefined);
      });
    });
  });
});
