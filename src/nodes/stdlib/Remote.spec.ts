import * as net from "net";
import {Remote} from "./Remote";

describe("Remote", function () {
  let onConnect: () => void;
  let onClose: () => void;
  let onWrite: (err: Error) => void;
  const socket = {
    connect: () => null,
    connecting: false,
    on: (event, cb) => {
      switch (event) {
        case "connect":
          onConnect = cb;
          break;
        case "close":
          onClose = cb;
          break;
      }
    },
    write: (data, cb) => {
      onWrite = cb;
    }
  };

  beforeEach(function () {
    spyOn(net, "Socket").and.returnValue(socket);
    Remote.clear();
  });

  describe(".instance()", function () {
    it("should cache instances by host & port", function () {
      const node = Remote.instance("127.0.0.1", 8124);
      expect(Remote.instance("127.0.0.1", 8124)).toBe(node);
      expect(Remote.instance("127.0.0.1", 9000)).not.toBe(node);
    });
  });

  describe(".clear()", function () {
    it("should clear instance cache", function () {
      const node = Remote.instance("127.0.0.1", 8124);
      Remote.clear();
      expect(Remote.instance("127.0.0.1", 8124)).not.toBe(node);
    });
  });

  describe("constructor", function () {
    it("should assign host property", function () {
      const node = Remote.instance("127.0.0.1", 8124);
      expect(node.host).toBe("127.0.0.1");
    });

    it("should assign port property", function () {
      const node = Remote.instance("127.0.0.1", 8124);
      expect(node.port).toBe(8124);
    });

    it("should add ports", function () {
      const node = Remote.instance("127.0.0.1", 8124);
      expect(node.i.$).toBeDefined();
      expect(node.o.$).toBeDefined();
      expect(node.si.touch).toBeDefined();
      expect(node.so.connected).toBeDefined();
      expect(node.re.$).toBeDefined();
      expect(node.e.err).toBeDefined();
    });
  });

  describe("on connection", function () {
    let node: Remote;

    beforeEach(function () {
      node = Remote.instance("127.0.0.1", 8124);
    });

    it("should send connected flag to output", function () {
      spyOn(node.so.connected, "send");
      onConnect();
      expect(node.so.connected.send).toHaveBeenCalledWith(true);
    });
  });

  describe("on close", function () {
    let node: Remote;

    beforeEach(function () {
      node = Remote.instance("127.0.0.1", 8124);
    });

    it("should send connected flag to output", function () {
      spyOn(node.so.connected, "send");
      onClose();
      expect(node.so.connected.send).toHaveBeenCalledWith(false);
    });

    describe("when there are inputs buffered", function () {
      beforeEach(function () {
        onConnect();
        node.i.$.send("foo", "1");
        node.i.$.send("bar", "2");
        node.i.$.send("baz", "3");
      });

      it("should bounce buffered inputs", function () {
        const spy = spyOn(node.re.$, "send");
        onClose();
        expect(spy.calls.allArgs()).toEqual([
          ["foo", "1"],
          ["bar", "2"],
          ["baz", "3"]
        ]);
      });
    });
  });

  describe("#send()", function () {
    let node: Remote;

    beforeEach(function () {
      node = Remote.instance("127.0.0.1", 8124);
    });

    describe("when sending value", function () {
      describe("when connected", function () {
        beforeEach(function () {
          onConnect();
        });

        it("should write wrapped & JSON stringified input to socket", function () {
          const spy = spyOn(socket, "write");
          node.send(node.i.$, "foo", "1");
          expect(spy.calls.argsFor(0)[0]).toBe(`{"value":"foo","tag":"1"}`);
        });
      });

      describe("when not connected", function () {
        it("should bounce inputs", function () {
          spyOn(node.re.$, "send");
          node.send(node.i.$, "foo", "1");
          expect(node.re.$.send).toHaveBeenCalledWith("foo", "1");
        });
      });
    });

    describe("when sending touch", function () {
      describe("when not connected", function () {
        it("should attempt to connect socket", function () {
          spyOn(socket, "connect");
          node.send(node.si.touch, null);
          expect(socket.connect).toHaveBeenCalledWith(8124, "127.0.0.1");
        });
      });

      describe("when connected", function () {
        beforeEach(function () {
          onConnect();
        });

        it("should not attempt to connect socket", function () {
          spyOn(socket, "connect");
          node.send(node.si.touch, null);
          expect(socket.connect).not.toHaveBeenCalled();
        });
      });

      describe("when socket is connecting", function () {
        beforeEach(function () {
          socket.connecting = true;
        });

        afterEach(function () {
          socket.connecting = false;
        });

        it("should not attempt to connect socket", function () {
          spyOn(socket, "connect");
          node.send(node.si.touch, null);
          expect(socket.connect).not.toHaveBeenCalled();
        });
      });
    });
  });
});
