import * as net from "net";
import {Remote} from "./Remote";

describe("Remote", function () {
  let onConnect: () => void;
  let onClose: () => void;
  let onError: (err: Error) => void;
  let onWrite: (err: Error) => void;
  const socket = {
    connect: () => null,
    connecting: false,
    end: () => null,
    on: (event, cb) => {
      switch (event) {
        case "connect":
          onConnect = cb;
          break;
        case "close":
          onClose = cb;
          break;
        case "error":
          onError = cb;
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
      const node = Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888);
      expect(Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888)
      ).toBe(node);
      expect(Remote.instance(
        "192.168.0.101", 8890, "127.0.0.1", 8888)
      ).not.toBe(node);
    });
  });

  describe(".clear()", function () {
    it("should clear instance cache", function () {
      const node = Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888);
      Remote.clear();
      expect(Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888)
      ).not.toBe(node);
    });
  });

  describe("constructor", function () {
    it("should add ports", function () {
      const node = Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888);
      expect(node.i.d_wrap).toBeDefined();
      expect(node.i.st_conn).toBeDefined();
      expect(node.o.d_wrap).toBeDefined();
      expect(node.o.st_conn).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
      expect(node.re.d_wrap).toBeDefined();
    });
  });

  describe("on connection", function () {
    let node: Remote;

    beforeEach(function () {
      node = Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888);
    });

    it("should send `st_conn` flag to output", function () {
      spyOn(node.o.st_conn, "send");
      onConnect();
      expect(node.o.st_conn.send).toHaveBeenCalledWith(true);
    });
  });

  describe("on close", function () {
    let node: Remote;

    beforeEach(function () {
      node = Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888);
    });

    it("should send `st_conn` flag to output", function () {
      spyOn(node.o.st_conn, "send");
      onClose();
      expect(node.o.st_conn.send).toHaveBeenCalledWith(false);
    });

    describe("when there are inputs buffered", function () {
      beforeEach(function () {
        onConnect();
        node.i.d_wrap.send("foo", "1");
        node.i.d_wrap.send("bar", "2");
        node.i.d_wrap.send("baz", "3");
      });

      it("should bounce buffered inputs", function () {
        const spy = spyOn(node.re.d_wrap, "send");
        onClose();
        expect(spy.calls.allArgs()).toEqual([
          ["foo", "1"],
          ["bar", "2"],
          ["baz", "3"]
        ]);
      });
    });
  });

  describe("on error", function () {
    let node: Remote;

    beforeEach(function () {
      node = Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888);
    });

    it("should emit error", function () {
      spyOn(node.o.ev_err, "send");
      onError(new Error("foo"));
      expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo");
    });

    describe("when there are inputs buffered", function () {
      beforeEach(function () {
        onConnect();
        node.i.d_wrap.send("foo", "1");
        node.i.d_wrap.send("bar", "2");
        node.i.d_wrap.send("baz", "3");
      });

      it("should bounce buffered inputs", function () {
        const spy = spyOn(node.re.d_wrap, "send");
        onError(new Error("foo"));
        expect(spy.calls.allArgs()).toEqual([
          ["foo", "1"],
          ["bar", "2"],
          ["baz", "3"]
        ]);
      });
    });
  });

  describe("on writing to socket", function () {
    let node: Remote;

    beforeEach(function () {
      node = Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888);
      onConnect();
      node.send(node.i.d_wrap, "foo", "1");
    });

    describe("on error", function () {
      it("should emit error", function () {
        spyOn(node.o.ev_err, "send");
        onWrite(new Error("foo"));
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo");
      });

      it("should bounce affected input", function () {
        spyOn(node.re.d_wrap, "send");
        onWrite(new Error("foo"));
        expect(node.re.d_wrap.send).toHaveBeenCalledWith("foo", "1");
      });
    });
  });

  describe("#send()", function () {
    let node: Remote;

    beforeEach(function () {
      node = Remote.instance(
        "192.168.0.101", 8889, "127.0.0.1", 8888);
    });

    describe("when sending value", function () {
      describe("when connected", function () {
        beforeEach(function () {
          onConnect();
        });

        it("should write wrapped & JSON stringified input to socket", function () {
          const spy = spyOn(socket, "write");
          node.send(node.i.d_wrap, "foo", "1");
          expect(spy.calls.argsFor(0)[0]).toBe(`{"value":"foo","tag":"1"}`);
        });
      });

      describe("when not connected", function () {
        it("should bounce inputs", function () {
          spyOn(node.re.d_wrap, "send");
          node.send(node.i.d_wrap, "foo", "1");
          expect(node.re.d_wrap.send).toHaveBeenCalledWith("foo", "1");
        });
      });
    });

    describe("when sending `st_conn`", function () {
      describe("(true)", function () {
        describe("when not connected", function () {
          it("should attempt to connect socket", function () {
            spyOn(socket, "connect");
            node.send(node.i.st_conn, true);
            expect(socket.connect).toHaveBeenCalledWith(8889, "192.168.0.101");
          });
        });

        describe("when connected", function () {
          beforeEach(function () {
            onConnect();
          });

          it("should not attempt to connect socket", function () {
            spyOn(socket, "connect");
            node.send(node.i.st_conn, true);
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
            node.send(node.i.st_conn, true);
            expect(socket.connect).not.toHaveBeenCalled();
          });
        });
      });

      describe("(false)", function () {
        describe("when not connected", function () {
          it("should not close connection", function () {
            spyOn(socket, "end");
            node.send(node.i.st_conn, false);
            expect(socket.end).not.toHaveBeenCalled();
          });
        });

        describe("when connected", function () {
          beforeEach(function () {
            onConnect();
          });

          it("should close connection", function () {
            spyOn(socket, "end");
            node.send(node.i.st_conn, false);
            expect(socket.end).toHaveBeenCalled();
          });
        });

        describe("when socket is connecting", function () {
          beforeEach(function () {
            socket.connecting = true;
          });

          afterEach(function () {
            socket.connecting = false;
          });

          it("should close connection", function () {
            spyOn(socket, "end");
            node.send(node.i.st_conn, false);
            expect(socket.end).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
