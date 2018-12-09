import {Muxer} from "./Muxer";

describe("Muxer", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Muxer<{ d_foo: number, d_bar: number }>(["d_foo", "d_bar"]);
      expect(node.i.d_foo).toBeDefined();
      expect(node.i.d_bar).toBeDefined();
      expect(node.o.d_mux).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Muxer<{ d_foo: number, d_bar: number }>;

    beforeEach(function () {
      node = new Muxer(["d_foo", "d_bar"]);
    });

    it("should send multiplexed input to output", function () {
      spyOn(node.o.d_mux, "send");
      node.send(node.i.d_foo, 5, "1");
      expect(node.o.d_mux.send).toHaveBeenCalledWith({
        name: "d_foo",
        val: 5
      }, "1");
    });
  });
});
