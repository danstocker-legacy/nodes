import {Noop} from "../forwarders";
import {InPort} from "../node";
import {InputBuffer} from "./InputBuffer";

describe("InputBuffer", function () {
  describe("constructor", function () {
    it("should set count property", function () {
      const inputBuffer = new InputBuffer(5);
      expect(inputBuffer.count).toBe(5);
    });
  });

  describe("#getCompleteInputs()", function () {
    let inputBuffer: InputBuffer;

    beforeEach(function () {
      inputBuffer = new InputBuffer(2);
    });

    describe("when a set is incomplete", function () {
      beforeEach(function () {
        const node1 = new Noop();
        const node2 = new Noop();
        const port1 = new InPort<number>(node1);
        const port2 = new InPort<number>(node2);
        inputBuffer.setValue("1", port1, 5);
        inputBuffer.setValue("2", port2, 6);
      });

      it("should return undefined", function () {
        expect(inputBuffer.getCompleteInputs()).toBeUndefined();
      });
    });

    describe("when a set is complete", function () {
      let node1: Noop<number>;
      let node2: Noop<number>;
      let port1: InPort<number>;
      let port2: InPort<number>;

      beforeEach(function () {
        node1 = new Noop();
        port1 = new InPort(node1);
        node2 = new Noop();
        port2 = new InPort(node2);
        inputBuffer.setValue("1", port1, 5);
        inputBuffer.setValue("2", port2, 6);
        inputBuffer.setValue("1", port2, 4);
      });

      it("should return undefined", function () {
        const result = inputBuffer.getCompleteInputs();
        expect(result).toEqual(new Map([[port1, 5], [port2, 4]]));
      });
    });
  });
});
