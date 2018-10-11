import {rdc} from "../functional";
import {Aggregator} from "./Aggregator";

describe("Aggregator", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Aggregator<number, number>(rdc.sum, 0);
      expect(node.in.ref).toBeDefined();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Aggregator<number, number>;

    beforeEach(function () {
      node = new Aggregator(rdc.sum, 0);
    });

    describe("when ref changes", function () {
      it("should send first input", function () {
        spyOn(node.out.$, "send");
        node.in.ref.send(1, "1");
        node.in.$.send(5, "1");
        expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
      });
    });

    describe("when ref doesn't change", function () {
      beforeEach(function () {
        node.in.ref.send(1, "1");
        node.in.$.send(5, "1");
      });

      it("should send reduced value", function () {
        spyOn(node.out.$, "send");
        node.in.ref.send(1, "2");
        node.in.$.send(3, "2");
        expect(node.out.$.send).toHaveBeenCalledWith(8, "2");
      });
    });
  });
});
