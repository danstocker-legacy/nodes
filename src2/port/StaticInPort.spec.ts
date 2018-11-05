import {Noop} from "../lang";
import {StaticInPort} from "./StaticInPort";

describe("StaticInPort", function () {
  describe("constructor", function () {
    it("should set property 'static'", function () {
      const node = new Noop();
      const port = new StaticInPort("foo", node);
      expect(port.static).toBe(true);
    });
  });
});
