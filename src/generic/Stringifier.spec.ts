import {Stringifier} from "./Stringifier";

describe("Stringifier", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const stringifier: Stringifier<any> = new Stringifier();
      expect(stringifier.ports.in.node).toBe(stringifier);
      expect(stringifier.ports.out.node).toBe(stringifier);
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
