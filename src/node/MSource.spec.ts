import {TOutBundle} from "../port";
import {ISource} from "./ISource";
import {MSource} from "./MSource";

describe("MSource", function () {
  class TestSource implements ISource {
    public readonly o: TOutBundle<{ foo: number }>;

    constructor() {
      MSource.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add o property", function () {
      const node = new TestSource();
      expect(node.o).toBeDefined();
    });
  });
});
