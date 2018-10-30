import {InPort, Inputs} from "../node";
import {TrackerBase} from "./TrackerBase";

describe("TrackerBase", function () {
  const process = jasmine.createSpy();

  class MyTracker extends TrackerBase {
    public in: {
      a: InPort<number>,
      b: InPort<number>
    };

    constructor() {
      super();
      this.openInPort("a");
      this.openInPort("b");
    }

    public process(inputs: Inputs, tag?: string): void {
      process(inputs, tag);
    }
  }

  describe("#send()", function () {
    let node: MyTracker;

    beforeEach(function () {
      node = new MyTracker();
    });

    describe("on first input", function () {
      it("should forward single input", function () {
        process.calls.reset();
        node.send(new Map([[node.in.a, 5]]), "1");
        expect(process).toHaveBeenCalledWith(new Map([[node.in.a, 5]]), "1");
      });
    });

    describe("on subsequent input", function () {
      beforeEach(function () {
        node.send(new Map([[node.in.a, 5]]), "1");
      });

      describe("from same port", function () {
        it("should replace last input", function () {
          process.calls.reset();
          node.send(new Map([[node.in.a, 3]]), "2");
          expect(process).toHaveBeenCalledWith(new Map([[node.in.a, 3]]), "2");
        });
      });

      describe("from different port", function () {
        it("should include last input(s)", function () {
          process.calls.reset();
          node.send(new Map([[node.in.b, 4]]), "2");
          expect(process).toHaveBeenCalledWith(new Map([[node.in.a, 5], [node.in.b, 4]]), "2");
        });
      });
    });
  });
});
