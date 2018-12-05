import {Muxer} from "./Muxer";

describe("Muxer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Muxer<{ foo: number, bar: number }>(["foo", "bar"]);
      expect(node.i.foo).toBeDefined();
      expect(node.i.bar).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Muxer<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = new Muxer(["foo", "bar"]);
    });

    it("should send multiplexed input to output", function () {
      spyOn(node.out.$, "send");
      node.send(node.i.foo, 5, "1");
      expect(node.out.$.send).toHaveBeenCalledWith({
        $: 5,
        name: "foo"
      }, "1");
    });
  });
});
