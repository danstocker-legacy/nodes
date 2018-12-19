import {SSwitch} from "./SSwitch";

describe("SSwitch", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new SSwitch<"foo" | "bar" | "baz", number>(["foo", "bar", "baz"]);
      expect(node.i.i).toBeDefined();
      expect(node.b.i).toBeDefined();
      expect(node.o.d_mux).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: SSwitch<"foo" | "bar" | "baz", number>;

    beforeEach(function () {
      node = new SSwitch(["foo", "bar", "baz"]);
    });

    it("should forward to specified output", function () {
      spyOn(node.o.d_mux, "send");
      node.send(node.i.i, {st_pos: "bar", d_val: 5}, "1");
      expect(node.o.d_mux.send).toHaveBeenCalledWith({
        port: "bar",
        val: 5
      }, "1");
    });

    describe("on invalid 'st_pos'", function () {
      it("should bounce inputs", function () {
        spyOn(node.b.i, "send");
        node.send(node.i.i, {st_pos: "quux", d_val: 5} as any, "1");
        expect(node.b.i.send).toHaveBeenCalledWith({
          d_val: 5,
          st_pos: "quux"
        }, "1");
      });
    });
  });
});
