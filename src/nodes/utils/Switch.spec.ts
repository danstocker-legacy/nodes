import {Switch} from "./Switch";

describe("Switch", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Switch<"foo" | "bar" | "baz", number>(["foo", "bar", "baz"]);
      expect(node.i.$).toBeDefined();
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

    it("should forward to specified output", function () {
      spyOn(node.o.foo, "send");
      spyOn(node.o.bar, "send");
      spyOn(node.o.baz, "send");
      node.i.$.send({case: "bar", $: 5}, "1");
      expect(node.o.foo.send).not.toHaveBeenCalled();
      expect(node.o.bar.send).toHaveBeenCalledWith(5, "1");
      expect(node.o.baz.send).not.toHaveBeenCalled();
    });

    describe("on invalid case", function () {
      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, {case: "quux", $: 5} as any, "1");
        expect(node.re.$.send).toHaveBeenCalledWith({
          $: 5,
          case: "quux"
        }, "1");
      });
    });
  });
});
