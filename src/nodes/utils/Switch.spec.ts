import {Switch} from "./Switch";

describe("Switch", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Switch<"foo" | "bar" | "baz", number>(["foo", "bar", "baz"]);
      expect(node.i.$).toBeDefined();
      expect(node.out.foo).toBeDefined();
      expect(node.out.bar).toBeDefined();
      expect(node.out.baz).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Switch<"foo" | "bar" | "baz", number>;

    beforeEach(function () {
      node = new Switch(["foo", "bar", "baz"]);
    });

    it("should forward to specified output", function () {
      spyOn(node.out.foo, "send");
      spyOn(node.out.bar, "send");
      spyOn(node.out.baz, "send");
      node.i.$.send({case: "bar", $: 5}, "1");
      expect(node.out.foo.send).not.toHaveBeenCalled();
      expect(node.out.bar.send).toHaveBeenCalledWith(5, "1");
      expect(node.out.baz.send).not.toHaveBeenCalled();
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
