import {TOutBundle} from "../port";
import {ISource} from "./ISource";
import {MSource} from "./MSource";

describe("MSource", function () {
  class TestSource implements ISource {
    public readonly out: TOutBundle<{ foo: number }>;

    constructor() {
      MSource.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add out property", function () {
      const node = new TestSource();
      expect(node.out).toBeDefined();
    });
  });
});
