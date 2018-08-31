import {Noop} from "./Noop";

describe("Noop", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const noop = new Noop();
      expect(noop.ports.in.node).toBe(noop);
      expect(noop.ports.out.node).toBe(noop);
    });
  });

  describe("#in()", function () {
    let noop: Noop<number>;

    beforeEach(function () {
      noop = new Noop();
    });

    describe("when ending to in port", function () {
      it("should send value to out port", function () {
        spyOn(noop.ports.out, "out");
        noop.in(noop.ports.in, 5);
        expect(noop.ports.out.out).toHaveBeenCalledWith(5);
      });
    });
  });
});
