import {Stringifier} from "./Stringifier";

describe("Stringifier", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const noop = new Stringifier();
      expect(noop.ports.in.node).toBe(noop);
      expect(noop.ports.out.node).toBe(noop);
    });
  });

  describe("#in()", function () {
    let stringifier: Stringifier<number>;

    beforeEach(function () {
      stringifier = new Stringifier();
    });

    it("should send stringified value to out port", function () {
      spyOn(stringifier.ports.out, "out");
      stringifier.in(stringifier.ports.in, 5);
      expect(stringifier.ports.out.out).toHaveBeenCalledWith("5");
    });
  });
});
