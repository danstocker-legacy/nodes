import {InPort, OutPort} from "../node";
import {Reducer} from "./Reducer";
import {sum} from "./reducerCallbacks";

describe("Reducer", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Reducer<number, number>(sum, 0);
      expect(node.in).toEqual({
        $: new InPort(node),
        ref: new InPort(node)
      });
      expect(node.out).toEqual({
        $: new OutPort(node)
      });
    });
  });

  describe("#send()", function () {
    let node: Reducer<number, number>;

    beforeEach(function () {
      node = new Reducer(sum, 0);
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
