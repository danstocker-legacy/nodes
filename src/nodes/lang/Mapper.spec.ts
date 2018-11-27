import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Mapper("String");
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Mapper<number, string>;

    beforeEach(function () {
      node = new Mapper("String");
    });

    it("should", function () {
      spyOn(node.out.$, "send");
      node.send(node.in.$, 5, "1");
      expect(node.out.$.send).toHaveBeenCalledWith("5", "1");
    });

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Mapper(`() => {
          throw error;
        }`);
      });

      it("should bounce inputs", function () {
        spyOn(node.bounced.$, "send");
        node.send(node.in.$, 5, "1");
        expect(node.bounced.$.send).toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
