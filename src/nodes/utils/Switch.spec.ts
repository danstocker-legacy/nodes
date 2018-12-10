import {Switch} from "./Switch";

describe("Switch", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Switch<"foo" | "bar" | "baz", number>(["foo", "bar", "baz"]);
      expect(node.i.mul).toBeDefined();
      expect(node.o.b_mul).toBeDefined();
      expect(node.o.foo).toBeDefined();
      expect(node.o.bar).toBeDefined();
      expect(node.o.baz).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Switch<"foo" | "bar" | "baz", number>;

    beforeEach(function () {
      node = new Switch(["foo", "bar", "baz"]);
    });

    describe("when sending to `synced`", function () {
      it("should forward to specified output", function () {
        spyOn(node.o.foo, "send");
        spyOn(node.o.bar, "send");
        spyOn(node.o.baz, "send");
        node.send(node.i.mul, {st_pos: "bar", d_val: 5}, "1");
        expect(node.o.foo.send).not.toHaveBeenCalled();
        expect(node.o.bar.send).toHaveBeenCalledWith(5, "1");
        expect(node.o.baz.send).not.toHaveBeenCalled();
      });

      describe("on invalid st_pos", function () {
        it("should bounce inputs", function () {
          spyOn(node.o.b_mul, "send");
          node.send(node.i.mul, {st_pos: "quux", d_val: 5} as any, "1");
          expect(node.o.b_mul.send).toHaveBeenCalledWith({
            d_val: 5,
            st_pos: "quux"
          }, "1");
        });
      });
    });

    describe("when sending to `d_val`", function () {
      describe("when position is valid", function () {
        beforeEach(function () {
          node.send(node.i.st_pos, "bar", "2");
        });

        it("should forward to matching output", function () {
          spyOn(node.o.foo, "send");
          spyOn(node.o.bar, "send");
          spyOn(node.o.baz, "send");
          node.send(node.i.d_val, 5, "1");
          expect(node.o.foo.send).not.toHaveBeenCalled();
          expect(node.o.bar.send).toHaveBeenCalledWith(5, "1");
          expect(node.o.baz.send).not.toHaveBeenCalled();
        });
      });
    });
  });
});
