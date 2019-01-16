import {noop} from "../utils";
import {connect, disconnect, TInPort, TOutPort} from "./index";

describe("connect", function () {
  let outPort: TOutPort<number>;
  let inPort: TInPort<number>;

  beforeEach(function () {
    outPort = new Set();
    inPort = noop;
  });

  it("should add port to connections", function () {
    connect(outPort, inPort);
    expect(outPort.has(inPort)).toBeTruthy();
  });
});

describe("disconnect", function () {
  let outPort: TOutPort<number>;
  let inPort1: TInPort<number>;
  let inPort2: TInPort<number>;

  beforeEach(function () {
    outPort = new Set();
    inPort1 = () => null;
    inPort2 = () => null;
    connect(outPort, inPort1);
    connect(outPort, inPort2);
  });

  describe("on specifying port", function () {
    it("should remove port from connections", function () {
      disconnect(outPort, inPort1);
      expect(outPort.has(inPort1)).toBeFalsy();
      expect(outPort.has(inPort2)).toBeTruthy();
    });
  });

  describe("on omitting port", function () {
    it("should remove all ports from connections", function () {
      disconnect(outPort);
      expect(outPort.size).toBe(0);
    });
  });
});
