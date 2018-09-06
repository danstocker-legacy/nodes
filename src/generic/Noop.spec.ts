import {Noop} from "./Noop";

describe("Noop", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const noop = new Noop();
      expect(noop.ports.in.node).toBe(noop);
      expect(noop.ports.out).toBeDefined();
    });
  });

  describe("#send()", function () {
    let noop: Noop<number>;

    beforeEach(function () {
      noop = new Noop();
    });

    describe("when ending to send port", function () {
      it("should send value to out port", function () {
        spyOn(noop.ports.out, "send");
        noop.send(new Map([[noop.ports.in, 5]]));
        expect(noop.ports.out.send).toHaveBeenCalledWith(5, undefined);
      });
    });
  });
});
