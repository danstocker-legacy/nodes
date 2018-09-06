import {Noop} from "../generic";
import {InPort, Inputs, OutPort} from "../node";
import {InputTracker} from "./InputTracker";

describe("InputTracker", function () {
  describe("#send()", function () {
    let inputTracker: InputTracker;
    let sum: number;
    let aPort: InPort<number>;
    let bPort: InPort<number>;

    beforeEach(function () {
      const node = new Noop<number>();
      aPort = new InPort(node);
      bPort = new InPort(node);
      inputTracker = new InputTracker((inputs: Inputs) =>
        sum = (inputs.get(aPort) || 0) + (inputs.get(bPort) || 0));
    });

    it("should use last input values", function () {
      inputTracker.send(new Map([[aPort, 5]]));
      expect(sum).toBe(5);
      inputTracker.send(new Map([[bPort, 4]]));
      expect(sum).toBe(9);
      inputTracker.send(new Map([[aPort, 3]]));
      expect(sum).toBe(7);
    });
  });
});
