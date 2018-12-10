import {Joiner} from "./Joiner";

describe("Joiner", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Joiner<{ foo: number, bar: boolean }>(["foo", "bar"]);
      expect(node.i.foo).toBeDefined();
      expect(node.i.bar).toBeDefined();
      expect(node.o.sync).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Joiner<{ foo: number, bar: boolean }>;

    beforeEach(function () {
      node = new Joiner(["foo", "bar"]);
    });

    describe("until there is a complete input set", function () {
      it("should not send to output", function () {
        spyOn(node.o.sync, "send");
        node.send(node.i.foo, 1, "1");
        node.send(node.i.bar, true, "2");
        expect(node.o.sync.send).not.toHaveBeenCalled();
      });
    });

    describe("on completing an input set", function () {
      beforeEach(function () {
        node.send(node.i.foo, 1, "1");
        node.send(node.i.bar, true, "2");
      });

      it("should send complete set to output", function () {
        spyOn(node.o.sync, "send");
        node.send(node.i.foo, 2, "2");
        expect(node.o.sync.send).toHaveBeenCalledWith({
          bar: true,
          foo: 2
        }, "2");
      });
    });
  });
});
