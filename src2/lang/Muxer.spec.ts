import {Muxer} from "./Muxer";

describe("Muxer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Muxer<{ foo: number, bar: number }>(["foo", "bar"]);
      expect(node.in.foo).toBeDefined();
      expect(node.in.bar).toBeDefined();
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
      node.send(node.in.foo, 5, "1");
      expect(node.out.$.send).toHaveBeenCalledWith({
        name: "foo",
        value: 5
      }, "1");
    });
  });
});
