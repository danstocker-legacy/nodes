import * as net from "net";
import {Socket} from "./Socket";

describe("Socket", function () {
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
    write: (data, encoding, cb) => {
      onWrite = cb;
    }
  };

  beforeEach(function () {
    spyOn(net, "Socket").and.returnValue(socket);
  });

  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Socket(
        "192.168.0.101", 8889);
      expect(node.i.d_val).toBeDefined();
      expect(node.i.st_conn).toBeDefined();
      expect(node.o.d_val).toBeDefined();
      expect(node.o.b_d_val).toBeDefined();
      expect(node.o.st_conn).toBeDefined();
      expect(node.o.ev_conn).toBeDefined();
      expect(node.o.ev_disc).toBeDefined();
      expect(node.o.ev_err).toBeDefined();
    });
  });

  describe("on connection", function () {
    let node: Socket;

    beforeEach(function () {
      node = new Socket(
        "192.168.0.101", 8889);
    });

    it("should send `st_conn` flag to output", function () {
      spyOn(node.o.st_conn, "send");
      onConnect();
      expect(node.o.st_conn.send).toHaveBeenCalledWith(true);
    });
  });

  describe("on close", function () {
    let node: Socket;

    beforeEach(function () {
      node = new Socket(
        "192.168.0.101", 8889);
    });

    it("should emit connected state", function () {
      spyOn(node.o.st_conn, "send");
      onClose();
      expect(node.o.st_conn.send).toHaveBeenCalledWith(false);
    });

    describe("when there are inputs buffered", function () {
      beforeEach(function () {
        onConnect();
        node.i.d_val.send("foo", "1");
        node.i.d_val.send("bar", "2");
        node.i.d_val.send("baz", "3");
      });

      it("should bounce buffered inputs", function () {
        const spy = spyOn(node.o.b_d_val, "send");
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
    let node: Socket;

    beforeEach(function () {
      node = new Socket(
        "192.168.0.101", 8889);
    });

    it("should emit error", function () {
      spyOn(node.o.ev_err, "send");
      onError(new Error("foo"));
      expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo");
    });

    describe("when there are inputs buffered", function () {
      beforeEach(function () {
        onConnect();
        node.i.d_val.send("foo", "1");
        node.i.d_val.send("bar", "2");
        node.i.d_val.send("baz", "3");
      });

      it("should bounce buffered inputs", function () {
        const spy = spyOn(node.o.b_d_val, "send");
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
    let node: Socket;

    beforeEach(function () {
      node = new Socket(
        "192.168.0.101", 8889);
      onConnect();
      node.send(node.i.d_val, "foo", "1");
    });

    describe("on error", function () {
      it("should emit error", function () {
        spyOn(node.o.ev_err, "send");
        onWrite(new Error("foo"));
        expect(node.o.ev_err.send).toHaveBeenCalledWith("Error: foo");
      });

      it("should bounce affected input", function () {
        spyOn(node.o.b_d_val, "send");
        onWrite(new Error("foo"));
        expect(node.o.b_d_val.send).toHaveBeenCalledWith("foo", "1");
      });
    });
  });

  describe("#send()", function () {
    let node: Socket;

    beforeEach(function () {
      node = new Socket(
        "192.168.0.101", 8889);
    });

    describe("when sending value", function () {
      describe("when connected", function () {
        beforeEach(function () {
          onConnect();
        });

        it("should write input to socket", function () {
          const spy = spyOn(socket, "write");
          node.send(node.i.d_val, "foo", "1");
          expect(spy.calls.argsFor(0)[0]).toBe("foo");
        });
      });

      describe("when not connected", function () {
        it("should bounce inputs", function () {
          spyOn(node.o.b_d_val, "send");
          node.send(node.i.d_val, "foo", "1");
          expect(node.o.b_d_val.send).toHaveBeenCalledWith("foo", "1");
        });
      });
    });

    describe("when sending to 'st_conn'", function () {
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

          it("should emit connected state", function () {
            spyOn(socket, "end");
            node.send(node.i.st_conn, false);
            expect(socket.end).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
