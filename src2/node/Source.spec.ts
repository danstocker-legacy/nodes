import {TOutPorts} from "../port";
import {ISource} from "./ISource";
import {Node} from "./Node";
import {Source} from "./Source";

describe("Source", function () {
  class TestSource extends Node implements ISource {
    public readonly out: TOutPorts<{ foo: number }>;

    constructor() {
      super();
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
