import {Switch} from "./Switch";

describe("Switch", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Switch<"foo" | "bar" | "baz", number>(["foo", "bar", "baz"]);
      expect(node.i.d_val).toBeDefined();
      expect(node.i.st_pos).toBeDefined();
      expect(node.b.st_pos).toBeDefined();
      expect(node.o.d_mux).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Switch<"foo" | "bar" | "baz", number>;

    beforeEach(function () {
      node = new Switch(["foo", "bar", "baz"]);
    });

    describe("when sending to 'd_val'", function () {
      describe("when position is valid", function () {
        beforeEach(function () {
          node.send(node.i.st_pos, "bar", "2");
        });

        it("should forward to matching output", function () {
          spyOn(node.o.d_mux, "send");
          node.send(node.i.d_val, 5, "1");
          expect(node.o.d_mux.send).toHaveBeenCalledWith({
            port: "bar",
            val: 5
          }, "1");
        });
      });
    });

    describe("when sending to 'st_pos'", function () {
      describe("when position is invalid", function () {
        it("should bounce input", function () {
          spyOn(node.b.st_pos, "send");
          node.send(node.i.st_pos, "quux" as any, "1");
          expect(node.b.st_pos.send).toHaveBeenCalledWith("quux", "1");
        });
      });
    });
  });
});
