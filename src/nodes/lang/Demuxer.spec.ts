import {Demuxer} from "./Demuxer";

describe("Demuxer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Demuxer<{ d_foo: number, d_bar: number }>(["d_foo", "d_bar"]);
      expect(node.i.d_mux).toBeDefined();
      expect(node.o.d_foo).toBeDefined();
      expect(node.o.d_bar).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Demuxer<{ d_foo: number, d_bar: number }>;

    beforeEach(function () {
      node = new Demuxer(["d_foo", "d_bar"]);
    });

    it("should send multiplexed input to output", function () {
      spyOn(node.o.d_foo, "send");
      node.send(node.i.d_mux, {name: "d_foo", val: 5}, "1");
      expect(node.o.d_foo.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
