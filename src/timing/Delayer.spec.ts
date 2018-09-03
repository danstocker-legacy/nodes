import {Delayer} from "./Delayer";

describe("Delayer", function () {
  describe("constructor", function () {
    it("should set ports", function () {
      const delayer: Delayer<any> = new Delayer(1000);
      expect(delayer.ports.in.node).toBe(delayer);
      expect(delayer.ports.out.node).toBe(delayer);
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
        spyOn(delayer.ports.out, "send");
        delayer.send(5, delayer.ports.in);
        jasmine.clock().tick(499);
        expect(delayer.ports.out.send).not.toHaveBeenCalledWith(5, undefined);
      });
    });

    describe("when delay passed", function () {
      it("should pass value to output", function () {
        spyOn(delayer.ports.out, "send");
        delayer.send(5, delayer.ports.in);
        jasmine.clock().tick(501);
        expect(delayer.ports.out.send).toHaveBeenCalledWith(5, undefined);
      });
    });
  });
});
