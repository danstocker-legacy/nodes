import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Mapper(String);
      expect(node.i.d_val).toBeDefined();
      expect(node.o.b_d_val).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Mapper<number, string>;

    beforeEach(function () {
      node = new Mapper(String);
    });

    it("should", function () {
      spyOn(node.o.d_val, "send");
      node.send(node.i.d_val, 5, "1");
      expect(node.o.d_val.send).toHaveBeenCalledWith("5", "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new Mapper(() => {
          throw new Error("foo");
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.o.b_d_val, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.b_d_val.send).toHaveBeenCalledWith(5, "1");
      });

      it("should send error to output", function () {
        spyOn(node.o.ev_err, "send");
        node.send(node.i.d_val, 5, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
      });
    });
  });
});
