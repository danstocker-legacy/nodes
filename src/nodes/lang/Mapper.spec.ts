import {Mapper} from "./Mapper";

describe("Mapper", function () {
  describe("constructor", function () {
    it("should add ports", function () {
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

    describe("when callback throws", function () {
      let error: Error;

      beforeEach(function () {
        error = new Error();
        node = new Mapper(() => {
          throw error;
        });
      });

      it("should send error", function () {
        spyOn(node.svc.err, "send");
        node.send(node.in.$, 5, "1");
        expect(node.svc.err.send).toHaveBeenCalledWith({
          payload: {
            err: error,
            node
          },
          type: "CALLBACK_ERROR"
        }, "1");
      });
    });
  });
});
