import {Demuxer} from "./Demuxer";

describe("Demuxer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Demuxer<{ foo: number, bar: number }>(["foo", "bar"]);
      expect(node.i.$).toBeDefined();
      expect(node.o.foo).toBeDefined();
      expect(node.o.bar).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Demuxer<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = new Demuxer(["foo", "bar"]);
    });

    it("should send multiplexed input to output", function () {
      spyOn(node.o.foo, "send");
      node.send(node.i.$, {name: "foo", $: 5}, "1");
      expect(node.o.foo.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
