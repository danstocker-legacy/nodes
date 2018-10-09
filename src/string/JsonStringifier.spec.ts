import {JsonStringifier} from "./JsonStringifier";

describe("JsonStringifier", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: JsonStringifier<object> = new JsonStringifier();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: JsonStringifier<object>;

    describe("when pretty is false", function () {
      beforeEach(function () {
        node = new JsonStringifier();
      });

      it("should send stringified value to out port", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, {foo: "bar"}]]));
        expect(node.out.$.send)
        .toHaveBeenCalledWith("{\"foo\":\"bar\"}", undefined);
      });
    });

    describe("when pretty is true", function () {
      beforeEach(function () {
        node = new JsonStringifier(true);
      });

      it("should send pretty stringified value to out port", function () {
        spyOn(node.out.$, "send");
        node.send(new Map([[node.in.$, {foo: "bar"}]]));
        expect(node.out.$.send)
        .toHaveBeenCalledWith("{\n  \"foo\": \"bar\"\n}", undefined);
      });
    });
  });
});
