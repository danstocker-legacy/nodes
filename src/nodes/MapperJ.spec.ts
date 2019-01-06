import {MapperJ} from "./MapperJ";

describe("MapperJ", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new MapperJ<{ foo: number, bar: number }, number>(["foo", "bar"], () => null);
      expect(node.i.foo).toBeDefined();
      expect(node.i.bar).toBeDefined();
      expect(node.b.foo).toBeDefined();
      expect(node.b.bar).toBeDefined();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("on input", function () {
    let node: MapperJ<{ foo: number, bar: number }, number>;

    beforeEach(function () {
      node = new MapperJ(["foo", "bar"], ({foo, bar}) => foo + bar);
    });

    it("should emit mapped value", function () {
      spyOn(node.o.d_val, "send");
      node.i.foo.send(1, "1");
      node.i.bar.send(2, "1");
      expect(node.o.d_val.send).toHaveBeenCalledWith(3, "1");
    });

    describe("when callback throws", function () {
      beforeEach(function () {
        node = new MapperJ(["foo", "bar"], () => {
          throw new Error();
        });
      });

      it("should bounce inputs", function () {
        spyOn(node.b.foo, "send");
        spyOn(node.b.bar, "send");
        node.i.foo.send(1, "1");
        node.i.bar.send(2, "1");
        expect(node.b.foo.send).toHaveBeenCalledWith(1, "1");
        expect(node.b.bar.send).toHaveBeenCalledWith(2, "1");
      });

      it("should emit error", function () {
        spyOn(node.o.ev_err, "send");
        node.i.foo.send(1, "1");
        node.i.bar.send(2, "1");
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error", "1");
      });
    });
  });
});
