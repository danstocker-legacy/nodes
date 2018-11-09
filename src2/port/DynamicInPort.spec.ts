import {Noop} from "../atomic";
import {DynamicInPort} from "./DynamicInPort";

describe("DynamicInPort", function () {
  describe("constructor", function () {
    it("should set property 'dynamic'", function () {
      const node = new Noop();
      const port = new DynamicInPort(1, node);
      expect(port.dynamic).toBe(true);
    });
  });
});
