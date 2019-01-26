import {connect} from "../../../node";
import {StdIn$, TStdIn} from "./TStdIn";

describe("StdIn$", () => {
  it("should be singleton", () => {
    expect(StdIn$()).toBe(StdIn$());
  });

  describe("on stdin readable", () => {
    let node: TStdIn;

    beforeEach(() => {
      node = StdIn$();
    });

    it("should emit on d_val", () => {
      spyOn(process.stdin, "read").and.returnValue("foo");
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      process.stdin.emit("readable");
      expect(spy).toHaveBeenCalledWith("foo", undefined);
    });
  });
});
