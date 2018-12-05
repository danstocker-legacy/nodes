import {TOutBundle} from "../port";
import {ISource} from "./ISource";
import {MSource} from "./MSource";

describe("MSource", function () {
  class TestSource implements ISource {
    public readonly o: TOutBundle<{ foo: number, bar: boolean }>;

    constructor() {
      MSource.init.call(this, ["foo", "bar"]);
    }
  }

  describe("init()", function () {
    it("should add o bundle", function () {
      const node = new TestSource();
      expect(node.o).toBeDefined();
      expect(node.o.foo).toBeDefined();
      expect(node.o.bar).toBeDefined();
    });
  });
});
