import {Noop} from "../nodes";
import {InPort} from "./InPort";

describe("InPort", function () {
  describe("#send()", function () {
    let local: Noop<number>;
    let localPort: InPort<number>;

    beforeEach(function () {
      local = new Noop();
      localPort = new InPort("foo", local);
    });

    it("should send value to node", function () {
      spyOn(local, "send");
      localPort.send(5, "1");
      expect(local.send).toHaveBeenCalledWith(localPort, 5, "1");
    });
  });
});
