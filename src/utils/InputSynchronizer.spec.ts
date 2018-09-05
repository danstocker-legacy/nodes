import {Noop} from "../generic";
import {InPort} from "../node";
import {InputSynchronizer} from "./InputSynchronizer";

describe("InputSynchronizer", function () {
  describe("#send()", function () {
    let inputSynchronizer: InputSynchronizer;
    let cb;

    beforeEach(function () {
      cb = jasmine.createSpy();
      inputSynchronizer = new InputSynchronizer(2, cb);
    });

    describe("on completing input set", function () {
      let node1: Noop<number>;
      let node2: Noop<number>;
      let port1: InPort<number>;
      let port2: InPort<number>;

      beforeEach(function () {
        node1 = new Noop();
        port1 = new InPort(node1);
        node2 = new Noop();
        port2 = new InPort(node2);
        inputSynchronizer.send(new Map([[port1, 5]]), 1);
        inputSynchronizer.send(new Map([[port2, 6]]), 2);
      });

      it("should invoke callback", function () {
        inputSynchronizer.send(new Map([[port2, 4]]), 1);
        expect(cb).toHaveBeenCalledWith(new Map([[port1, 5], [port2, 4]]), 1);
      });
    });
  });
});
