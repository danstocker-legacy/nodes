import {TInBundle} from "../port";
import {IMutable} from "./IMutable";
import {MMutable} from "./MMutable";

describe("MMutable", function () {
  class TestMutable implements IMutable {
    public readonly si: TInBundle<{ foo: number, bar: boolean }>;

    constructor() {
      MMutable.init.call(this, ["foo", "bar"]);
    }
  }

  describe("init()", function () {
    it("should add si bundle", function () {
      const node = new TestMutable();
      expect(node.si).toBeDefined();
      expect(node.si.foo).toBeDefined();
      expect(node.si.bar).toBeDefined();
    });
  });
});
