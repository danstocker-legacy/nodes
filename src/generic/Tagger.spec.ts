import {Tagger} from "./Tagger";

describe("Tagger", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const tagger = new Tagger(() => "");
      expect(tagger.in.$.node).toBe(tagger);
      expect(tagger.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let tagger: Tagger<number>;

    beforeEach(function () {
      tagger = new Tagger((value: number, tag: string) => tag + value);
    });

    it("should forward input with new tag", function () {
      spyOn(tagger.out.$, "send");
      tagger.send(new Map([[tagger.in.$, 5]]), "foo");
      expect(tagger.out.$.send).toHaveBeenCalledWith(5, "foo5");
    });
  });
});
