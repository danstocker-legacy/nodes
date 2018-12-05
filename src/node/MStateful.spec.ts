import {TOutBundle} from "../port";
import {IStateful} from "./IStateful";
import {MStateful} from "./MStateful";

describe("MStateful", function () {
  class TestStateful implements IStateful {
    public readonly so: TOutBundle<{ foo: number, bar: boolean }>;

    constructor() {
      MStateful.init.call(this, ["foo", "bar"]);
    }
  }

  describe("init()", function () {
    it("should add so bundle", function () {
      const node = new TestStateful();
      expect(node.so).toBeDefined();
      expect(node.so.foo).toBeDefined();
      expect(node.so.bar).toBeDefined();
    });
  });
});
