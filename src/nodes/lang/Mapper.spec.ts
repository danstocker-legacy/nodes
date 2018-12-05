import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Mapper(String);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Mapper<number, string>;

    beforeEach(function () {
      node = new Mapper(String);
    });

    it("should", function () {
      spyOn(node.o.$, "send");
      node.send(node.i.$, 5, "1");
      expect(node.o.$.send).toHaveBeenCalledWith("5", "1");
    });

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Mapper(() => {
          throw error;
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, 5, "1");
        expect(node.re.$.send).toHaveBeenCalledWith(5, "1");
      });
    });
  });
});
