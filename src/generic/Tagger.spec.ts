import {Tagger} from "./Tagger";

describe("Tagger", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const tagger = new Tagger(() => "");
      expect(tagger.ports.in.node).toBe(tagger);
      expect(tagger.ports.out.node).toBe(tagger);
    });
  });

  describe("#send()", function () {
    let tagger: Tagger<number>;

    beforeEach(function () {
      tagger = new Tagger((value: number, tag: string) => tag + value);
    });

    it("should forward input with new tag", function () {
      spyOn(tagger.ports.out, "send");
      tagger.send(new Map([[tagger.ports.in, 5]]), "foo");
      expect(tagger.ports.out.send).toHaveBeenCalledWith(5, "foo5");
    });
  });
});
