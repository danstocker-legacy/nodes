import {Folder} from "./Folder";

describe("Folder", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Folder(() => null);
      expect(node.i.d_val).toBeDefined();
      expect(node.i.ev_res).toBeDefined();
      expect(node.b.d_val).toBeDefined();
      expect(node.o.d_fold).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Folder<number, number>;

    beforeEach(function () {
      node = new Folder((curr, next) => curr + next, 1);
    });

    describe("when sending to 'd_val'", function () {
      describe("when callback throws", function () {
        beforeEach(function () {
          node = new Folder(() => {
            throw new Error("foo");
          });
        });

        it("should bounce inputs", function () {
          spyOn(node.b.d_val, "send");
          node.send(node.i.d_val, 5, "1");
          expect(node.b.d_val.send).toHaveBeenCalledWith(5, "1");
        });

        it("should send error to output", function () {
          spyOn(node.o.ev_err, "send");
          node.send(node.i.d_val, 5, "1");
          expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo", "1");
        });
      });
    });

    describe("when sending to 'ev_res'", function () {
      beforeEach(function () {
        node.i.d_val.send(5, "1");
        node.i.d_val.send(3, "2");
      });

      it("should send current folded value", function () {
        spyOn(node.o.d_fold, "send");
        node.send(node.i.ev_res, null, "3");
        expect(node.o.d_fold.send).toHaveBeenCalledWith(9, "3");
      });
    });
  });
});
