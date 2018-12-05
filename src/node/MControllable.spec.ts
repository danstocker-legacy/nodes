import {TInBundle} from "../port";
import {IControllable} from "./IControllable";
import {MControllable} from "./MControllable";

describe("MControllable", function () {
  class TestControllable implements IControllable {
    public readonly si: TInBundle<{ foo: number, bar: boolean }>;

    constructor() {
      MControllable.init.call(this, ["foo", "bar"]);
    }
  }

  describe("init()", function () {
    it("should add si bundle", function () {
      const node = new TestControllable();
      expect(node.si).toBeDefined();
      expect(node.si.foo).toBeDefined();
      expect(node.si.bar).toBeDefined();
    });
  });
});
