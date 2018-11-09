import {Splitter} from "./Splitter";

describe("Splitter", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Splitter<{ foo: number, bar: boolean }>(["foo", "bar"]);
      expect(node.in.$).toBeDefined();
      expect(node.out.foo).toBeDefined();
      expect(node.out.bar).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Splitter<{ foo: number, bar: boolean }>;

    beforeEach(function () {
      node = new Splitter(["foo", "bar"]);
    });

    it("should send split input to output ports", function () {
      spyOn(node.out.foo, "send");
      spyOn(node.out.bar, "send");
      node.send(node.in.$, {foo: 5, bar: true}, "1");
      expect(node.out.foo.send).toHaveBeenCalledWith(5, "1");
      expect(node.out.bar.send).toHaveBeenCalledWith(true, "1");
    });
  });
});
