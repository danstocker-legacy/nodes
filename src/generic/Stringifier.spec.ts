import {Stringifier} from "./Stringifier";

describe("Stringifier", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const stringifier: Stringifier<any> = new Stringifier();
      expect(stringifier.ports.in.node).toBe(stringifier);
      expect(stringifier.ports.out.node).toBe(stringifier);
    });
  });

  describe("#send()", function () {
    let stringifier: Stringifier<number>;

    beforeEach(function () {
      stringifier = new Stringifier();
    });

    it("should send stringified value to out port", function () {
      spyOn(stringifier.ports.out, "send");
      stringifier.send(new Map([[stringifier.ports.in, 5]]));
      expect(stringifier.ports.out.send).toHaveBeenCalledWith("5", undefined);
    });
  });
});
