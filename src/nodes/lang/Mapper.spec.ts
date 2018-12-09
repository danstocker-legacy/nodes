import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Mapper(String);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
      expect(node.re.$).toBeDefined();
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
      beforeEach(function () {
        node = new Mapper(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.re.$, "send");
        node.send(node.i.$, 5, "1");
        expect(node.re.$.send).toHaveBeenCalledWith(5, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.$, 5, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
