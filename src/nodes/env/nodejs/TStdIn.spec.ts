import {connect} from "../../../node";
import {Std$In, TStdIn} from "./TStdIn";

describe("Std$In", () => {
  it("should be singleton", () => {
    expect(Std$In()).toBe(Std$In());
  });

  describe("on stdin readable", () => {
    let node: TStdIn;

    beforeEach(() => {
      node = Std$In();
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
