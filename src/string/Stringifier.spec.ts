import {Stringifier} from "./Stringifier";

describe("Stringifier", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const stringifier: Stringifier<any> = new Stringifier();
      expect(stringifier.in.$.node).toBe(stringifier);
      expect(stringifier.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let stringifier: Stringifier<number>;

    beforeEach(function () {
      stringifier = new Stringifier();
    });

    it("should send stringified value to out port", function () {
      spyOn(stringifier.out.$, "send");
      stringifier.send(new Map([[stringifier.in.$, 5]]));
      expect(stringifier.out.$.send).toHaveBeenCalledWith("5", undefined);
    });
  });
});
