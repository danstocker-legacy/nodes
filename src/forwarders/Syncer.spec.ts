import {InPort, OutPort} from "../node";
import {Syncer} from "./Syncer";

describe("Syncer", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Syncer(3);
      expect(node.in[0]).toBeDefined();
      expect(node.in[1]).toBeDefined();
      expect(node.in[2]).toBeDefined();
      expect(node.out.$).toBeDefined();
    });

    describe("on missing argument", function () {
      it("should default to 2", function () {
        const node = new Syncer();
        expect(node.in[0]).toBeDefined();
        expect(node.in[1]).toBeDefined();
        expect(node.out.$).toBeDefined();
      });
    });
  });

  describe("#send()", function () {
    let node: Syncer;

    beforeEach(function () {
      node = new Syncer();
    });

    describe("when there are no complete input sets", function () {
      it("should not forward", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in[0] as InPort<number>, 2]]), "2");
        node.send(new Map([[node.in[1] as InPort<number>, 3]]), "1");
        expect(node.out.$.send).not.toHaveBeenCalled();
      });
    });

    describe("on complete input set", function () {
      beforeEach(function () {
        node.send(new Map([[node.in[0] as InPort<number>, 2]]), "2");
        node.send(new Map([[node.in[1] as InPort<number>, 3]]), "1");
      });

      it("should forward synced inputs", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in[1] as InPort<number>, 4]]), "2");
        expect(node.out.$.send).toHaveBeenCalledWith([2, 4], "2");
      });
    });
  });
});
