import {TOutPorts} from "../port";
import {ISource} from "./ISource";
import {Source} from "./Source";

describe("Source", function () {
  class TestSource implements ISource {
    public readonly out: TOutPorts<{ foo: number }>;

    constructor() {
      Source.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add out property", function () {
      const node = new TestSource();
      expect(node.out).toBeDefined();
    });
  });
});
