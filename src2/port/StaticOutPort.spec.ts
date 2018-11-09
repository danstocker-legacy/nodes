import {Noop} from "../atomic";
import {StaticOutPort} from "./StaticOutPort";

describe("StaticOutPort", function () {
  describe("constructor", function () {
    it("should set property 'static'", function () {
      const node = new Noop();
      const port = new StaticOutPort("foo", node);
      expect(port.static).toBe(true);
    });
  });
});
