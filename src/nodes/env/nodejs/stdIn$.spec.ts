import {connect} from "../../../node";
import {stdIn$, TStdIn} from "./stdIn$";

describe("stdIn$", () => {
  it("should be singleton", function () {
    expect(stdIn$()).toBe(stdIn$());
  });

  describe("on stdin readable", () => {
    let node: TStdIn;

    beforeEach(() => {
      node = stdIn$();
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
