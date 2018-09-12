import {InPort, Inputs} from "../node";
import {SequencerBase} from "./SequencerBase";

describe("SequencerBase", function () {
  const process = jasmine.createSpy();

  class Sequencer extends SequencerBase {
    public readonly ports: {
      ref: InPort<string>,
      in1: InPort<number>,
      in2: InPort<number>
    };

    constructor() {
      super();
      this.openPort("in1", new InPort(this));
      this.openPort("in2", new InPort(this));
      this.openPort("ref", new InPort(this));
    }

    protected process(inputs: Inputs, tag: string): void {
      process(inputs, tag);
    }
  }

  describe("#send()", function () {
    let node: Sequencer;

    beforeEach(function () {
      node = new Sequencer();
    });

    describe("when only ref received data", function () {
      it("should not invoke #process()", function () {
        process.calls.reset();
        node.send(new Map([[node.ports.ref, null]]), "1");
        node.send(new Map([[node.ports.ref, null]]), "2");
        node.send(new Map([[node.ports.ref, null]]), "3");
        expect(process).not.toHaveBeenCalled();
      });
    });

    describe("when passing input not matching next tag", function () {
      beforeEach(function () {
        node.send(new Map([[node.ports.ref, null]]), "1");
        node.send(new Map([[node.ports.ref, null]]), "2");
        node.send(new Map([[node.ports.ref, null]]), "3");
      });

      it("should not invoke #process()", function () {
        process.calls.reset();
        node.send(new Map([[node.ports.in1, 1]]), "2");
        expect(process).not.toHaveBeenCalled();
      });
    });

    describe("when passing input matching next tag", function () {
      beforeEach(function () {
        node.send(new Map([[node.ports.ref, null]]), "1");
        node.send(new Map([[node.ports.ref, null]]), "2");
        node.send(new Map([[node.ports.ref, null]]), "3");
        node.send(new Map([[node.ports.in1, 2]]), "2");
      });

      it("should invoke #process() on cached inputs", function () {
        process.calls.reset();
        node.send(new Map([[node.ports.in1, 1]]), "1");
        const args = process.calls.allArgs();
        expect(args.length).toBe(2);
        expect(args[0]).toEqual([new Map([[node.ports.in1, 1]]), "1"]);
        expect(args[1]).toEqual([new Map([[node.ports.in1, 2]]), "2"]);
      });
    });
  });
});
