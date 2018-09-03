import {ChangeFilter} from "./ChangeFilter";

describe("ChangeFilter", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const changeFilter: ChangeFilter<number> = new ChangeFilter();
      expect(changeFilter.ports.in.node).toBe(changeFilter);
      expect(changeFilter.ports.out.node).toBe(changeFilter);
    });
  });

  describe("#send()", function () {
    let changeFilter: ChangeFilter<number>;

    beforeEach(function () {
      changeFilter = new ChangeFilter();
      changeFilter.send(5, changeFilter.ports.in);
    });

    describe("when sending same value", function () {
      it("should not pass value to output", function () {
        spyOn(changeFilter.ports.out, "send");
        changeFilter.send(5, changeFilter.ports.in);
        expect(changeFilter.ports.out.send).not.toHaveBeenCalled();
      });
    });

    describe("when sending different value", function () {
      it("should pass value to output", function () {
        spyOn(changeFilter.ports.out, "send");
        changeFilter.send(6, changeFilter.ports.in);
        expect(changeFilter.ports.out.send)
        .toHaveBeenCalledWith(6, undefined);
      });
    });

    describe("with custom equals", function () {
      beforeEach(function () {
        changeFilter = new ChangeFilter((a, b) => (a % 2) === (b % 2));
        changeFilter.send(5, changeFilter.ports.in);
      });

      describe("when sending equivalent value", function () {
        it("should not pass value to output", function () {
          spyOn(changeFilter.ports.out, "send");
          changeFilter.send(7, changeFilter.ports.in);
          expect(changeFilter.ports.out.send).not.toHaveBeenCalled();
        });
      });

      describe("when sending non-equivalent value", function () {
        it("should pass value to output", function () {
          spyOn(changeFilter.ports.out, "send");
          changeFilter.send(6, changeFilter.ports.in);
          expect(changeFilter.ports.out.send)
          .toHaveBeenCalledWith(6, undefined);
        });
      });
    });
  });
});
