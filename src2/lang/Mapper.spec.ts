import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Mapper(String);
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Mapper<number, string>;

    beforeEach(function () {
      node = new Mapper(String);
    });

    it("should", function () {
      spyOn(node.out.$, "send");
      node.send(node.in.$, 5, "1");
      expect(node.out.$.send).toHaveBeenCalledWith("5", "1");
    });
  });
});
