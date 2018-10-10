import {Stringifier} from "./Stringifier";

describe("Stringifier", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: Stringifier<any> = new Stringifier();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Stringifier<number>;

    beforeEach(function () {
      node = new Stringifier();
    });

    it("should send stringified value to out port", function () {
      spyOn(node.out.$, "send");
      node.send(new Map([[node.in.$, 5]]));
      expect(node.out.$.send).toHaveBeenCalledWith("5", undefined);
    });
  });
});
