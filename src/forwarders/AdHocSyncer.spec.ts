import {InPort, OutPort} from "../node";
import {AdHocSyncer} from "./AdHocSyncer";

describe("AdHocSyncer", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new AdHocSyncer(3);
      expect(node.in).toEqual({
        1: new InPort(node),
        2: new InPort(node),
        3: new InPort(node)
      });
      expect(node.out).toEqual({
        $: new OutPort(node)
      });
    });

    describe("on missing argument", function () {
      it("should default to 2", function () {
        const node = new AdHocSyncer();
        expect(node.in).toEqual({
          1: new InPort(node),
          2: new InPort(node)
        });
        expect(node.out).toEqual({
          $: new OutPort(node)
        });
      });
    });
  });

  describe("#send()", function () {
    let node: AdHocSyncer;

    beforeEach(function () {
      node = new AdHocSyncer();
    });

    describe("when there are no complete input sets", function () {
      it("should not forward", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in[1] as InPort<number>, 2]]), "2");
        node.send(new Map([[node.in[2] as InPort<number>, 3]]), "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on complete input set", function () {
      beforeEach(function () {
        node.send(new Map([[node.in[1] as InPort<number>, 2]]), "2");
        node.send(new Map([[node.in[2] as InPort<number>, 3]]), "1");
      });

      it("should forward synced inputs", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in[2] as InPort<number>, 4]]), "2");
        expect(node.out.$.send).toHaveBeenCalledWith({1: 2, 2: 4}, "2");
      });
    });
  });
});
