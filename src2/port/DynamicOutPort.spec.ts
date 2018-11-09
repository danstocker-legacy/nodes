import {Noop} from "../atomic";
import {DynamicOutPort} from "./DynamicOutPort";

describe("DynamicOutPort", function () {
  describe("constructor", function () {
    it("should set property 'dynamic'", function () {
      const node = new Noop();
      const port = new DynamicOutPort(1, node);
      expect(port.dynamic).toBe(true);
    });
  });
});
