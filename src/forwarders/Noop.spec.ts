import {Noop} from "./Noop";

describe("Noop", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const noop = new Noop();
      expect(noop.in.$.node).toBe(noop);
      expect(noop.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let noop: Noop<number>;

    beforeEach(function () {
      noop = new Noop();
    });

    describe("when ending to send port", function () {
      it("should send value to out port", function () {
        spyOn(noop.out.$, "send");
        noop.send(new Map([[noop.in.$, 5]]));
        expect(noop.out.$.send).toHaveBeenCalledWith(5, undefined);
      });
    });
  });
});
