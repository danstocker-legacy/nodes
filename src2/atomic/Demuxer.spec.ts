import {Demuxer} from "./Demuxer";

describe("Demuxer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Demuxer<{ foo: number, bar: number }>(["foo", "bar"]);
      expect(node.in.$).toBeDefined();
      expect(node.out.foo).toBeDefined();
      expect(node.out.bar).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Demuxer<{ foo: number, bar: number }>;

    beforeEach(function () {
      node = new Demuxer(["foo", "bar"]);
    });

    it("should send multiplexed input to output", function () {
      spyOn(node.out.foo, "send");
      node.send(node.in.$, {name: "foo", value: 5}, "1");
      expect(node.out.foo.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
