import {Syncer} from "./Syncer";

describe("Syncer", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Syncer<{ foo: number, bar: boolean }>(["foo", "bar"]);
      expect(node.in.foo).toBeDefined();
      expect(node.in.bar).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Syncer<{ foo: number, bar: boolean }>;

    beforeEach(function () {
      node = new Syncer(["foo", "bar"]);
    });

    describe("until there is a complete input set", function () {
      it("should not send to output", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.foo, 1, "1");
        node.send(node.in.bar, true, "2");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on completing an input set", function () {
      beforeEach(function () {
        node.send(node.in.foo, 1, "1");
        node.send(node.in.bar, true, "2");
      });

      it("should send complete set to output", function () {
        spyOn(node.out.$, "send");
        node.send(node.in.foo, 2, "2");
        expect(node.out.$.send).toHaveBeenCalledWith({
          bar: true,
          foo: 2
        }, "2");
      });
    });
  });
});
