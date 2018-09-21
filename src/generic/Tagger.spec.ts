import {Tagger} from "./Tagger";

describe("Tagger", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new Tagger(() => "");
      expect(node.in.$.node).toBe(node);
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Tagger<number>;

    beforeEach(function () {
      node = new Tagger((value: number, tag: string) => tag + value);
    });

    it("should forward input with new tag", function () {
      spyOn(node.out.$, "send");
      node.send(new Map([[node.in.$, 5]]), "foo");
      expect(node.out.$.send).toHaveBeenCalledWith(5, "foo5");
    });
  });
});
