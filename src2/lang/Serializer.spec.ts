import {Serializer} from "./Serializer";

describe("Serializer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Serializer();
      expect(node.in.$).toBeDefined();
      expect(node.in.tag).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Serializer<number>;

    beforeEach(function () {
      node = new Serializer();
    });

    describe("until first value is received", function () {
      it("should not forward", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.tag, null, "1");
        node.send(node.in.tag, null, "2");
        node.send(node.in.tag, null, "3");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("when passing input not matching next tag", function () {
      beforeEach(function () {
        node.send(node.in.tag, null, "1");
        node.send(node.in.tag, null, "2");
        node.send(node.in.tag, null, "3");
      });

      it("should ot forward", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, 5, "2");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("when passing input matching next tag", function () {
      beforeEach(function () {
        node.send(node.in.tag, null, "1");
        node.send(node.in.tag, null, "2");
        node.send(node.in.tag, null, "3");
        node.send(node.in.$, 5, "2");
      });

      it("should release all available inputs", function () {
        const spy = spyOn(node.out.$, "send");
        node.send(node.in.$, 8, "1");
        const allArgs = spy.calls.allArgs();
        expect(allArgs).toEqual([
          [8, "1"],
          [5, "2"]
        ]);
      });
    });

    describe("when inputs precede corresponding tags", function () {
      beforeEach(function () {
        node.send(node.in.$, 5, "1");
      });

      it("should not forward until tag arrives", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.$, 3, "2");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });

      describe("and passing tag for which input is present", function () {
        it("should release input", function () {
          spyOn(node.out.$, "send");
          node.send(node.in.tag, null, "1");
          expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
        });
      });
    });
  });
});