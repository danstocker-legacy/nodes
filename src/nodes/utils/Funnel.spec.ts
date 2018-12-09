import {Funnel} from "./Funnel";

describe("Funnel", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Funnel<"foo" | "bar" | "baz", number>(["foo", "bar", "baz"]);
      expect(node.i.foo).toBeDefined();
      expect(node.i.bar).toBeDefined();
      expect(node.i.baz).toBeDefined();
      expect(node.o.$).toBeDefined();
      expect(node.o.st_pos).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Funnel<"foo" | "bar" | "baz", number>;

    beforeEach(function () {
      node = new Funnel(["foo", "bar", "baz"]);
    });

    it("should forward to specified output", function () {
      spyOn(node.o.$, "send");
      spyOn(node.o.st_pos, "send");
      node.i.foo.send(5, "1");
      expect(node.o.$.send).toHaveBeenCalledWith(5, "1");
      expect(node.o.st_pos.send).toHaveBeenCalledWith("foo", "1");
    });
  });
});
