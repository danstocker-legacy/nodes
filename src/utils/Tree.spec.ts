import {IAny} from "./IAny";
import {Tree} from "./Tree";

describe("Tree", function () {
  describe(".get()", function () {
    it("should return value at path", function () {
      const result = Tree.get({foo: {bar: 5}}, ["foo"]);
      expect(result).toEqual({bar: 5});
    });

    describe("when path is not present", function () {
      it("should return undefined", function () {
        const result = Tree.get({foo: {bar: 5}}, ["foo", "bar", "baz"]);
        expect(result).toBeUndefined();
      });
    });
  });

  describe(".set()", function () {
    it("should set value at path", function () {
      const json: IAny = {};
      Tree.set(json, ["foo", "bar", "baz"], 5);
      expect(json).toEqual({
        foo: {
          bar: {
            baz: 5
          }
        }
      });
    });

    describe("when path already exists", function () {
      it("should overwrite path", function () {
        const json: IAny = {
          foo: {
            bar: {
              baz: 5
            }
          }
        };
        Tree.set(json, ["foo", "bar"], 5);
        expect(json).toEqual({
          foo: {
            bar: 5
          }
        });
      });
    });
  });
});
