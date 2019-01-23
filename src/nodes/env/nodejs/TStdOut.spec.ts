import {Std$Out, TStdOut} from "./TStdOut";

describe("Std$Out", () => {
  it("should be singleton", () => {
    expect(Std$Out()).toBe(Std$Out());
  });

  describe("on input (d_val)", () => {
    let node: TStdOut;

    beforeEach(() => {
      node = Std$Out();
    });

    it("should write to stdout", () => {
      spyOn(process.stdout, "write");
      node.i.d_val("foo");
      expect(process.stdout.write).toHaveBeenCalledWith("foo");
    });
  });
});
