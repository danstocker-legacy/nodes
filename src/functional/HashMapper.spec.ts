import {InPort, OutPort} from "../node";
import {HashMapper} from "./HashMapper";

describe("HashMapper", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new HashMapper([]);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: HashMapper;

    beforeEach(function () {
      node = new HashMapper(["foo", "bar"]);
    });

    it("should send object with fields", function () {
      spyOn(node.out.$, "send");
      node.send(new Map([[node.in.$, [1, 2]]]), "1");
      expect(node.out.$.send).toHaveBeenCalledWith({foo: 1, bar: 2}, "1");
    });

    describe("when input has fewer elements", function () {
      it("should assign undefined to field", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, [1]]]), "1");
        expect(node.out.$.send).toHaveBeenCalledWith({
          bar: undefined,
          foo: 1
        }, "1");
      });
    });

    describe("when input has extra elements", function () {
      it("should discard extra element", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, [1, 2, 3]]]), "1");
        expect(node.out.$.send).toHaveBeenCalledWith({
          bar: 2,
          foo: 1
        }, "1");
      });
    });
  });
});
