import {InPort, Inputs} from "../node";
import {Syncer} from "./Syncer";

describe("Syncer", function () {
  const process = jasmine.createSpy();

  class MySyncer extends Syncer {
    public in: {
      a: InPort<number>,
      b: InPort<number>
    };

    constructor() {
      super();
      this.openInPort("a", new InPort(this));
      this.openInPort("b", new InPort(this));
    }

    public process(inputs: Inputs, tag?: string): void {
      process(inputs, tag);
    }
  }

  describe("#send()", function () {
    let node: MySyncer;

    beforeEach(function () {
      node = new MySyncer();
    });

    describe("when there are no complete input sets", function () {
      it("should not invoke #process()", function () {
        process.calls.reset();
        node.send(new Map([[node.in.a, 5]]), "1");
        expect(process).not.toHaveBeenCalled();

        process.calls.reset();
        node.send(new Map([[node.in.b, 4]]), "2");
        expect(process).not.toHaveBeenCalled();
      });
    });

    describe("on completing an input set", function () {
      beforeEach(function () {
        node.send(new Map([[node.in.a, 5]]), "1");
        node.send(new Map([[node.in.b, 4]]), "2");
      });

      it("should invoke #process() with complete input set", function () {
        process.calls.reset();
        node.send(new Map([[node.in.a, 3]]), "2");
        expect(process).toHaveBeenCalledWith(
          new Map([[node.in.a, 3], [node.in.b, 4]]), "2");

        process.calls.reset();
        node.send(new Map([[node.in.b, 2]]), "1");
        expect(process).toHaveBeenCalledWith(
          new Map([[node.in.a, 5], [node.in.b, 2]]), "1");
      });
    });

    describe("on closing port", function () {
      describe("when closed port is the one w/o value yet", function () {
        beforeEach(function () {
          node.send(new Map([[node.in.a, 5]]), "1");
        });

        it("should process inputs", function () {
          spyOn(node, "process");
          // @ts-ignore
          node.closeInPort("b");
          expect(node.process).toHaveBeenCalledWith(
            new Map([[node.in.a, 5]]), "1");
        });
      });
    });
  });
});
