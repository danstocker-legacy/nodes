import * as net from "net";
import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";
import {IConnectionInfo} from "./IConnectionInfo";

interface ISocketInputs {
  /** Value to be sent to remote server. */
  d_val: Buffer | string;

  /** Whether socket *should be* connected. */
  st_conn: boolean;
}

interface ISocketOutputs {
  /** Values received from remote server. */
  d_val: Buffer | string;

  /** Bounced wrapped value. */
  b_d_val: Buffer | string;

  /** Whether socket *is* connected. */
  st_conn: boolean;

  /** Information re. new connection. */
  ev_conn: IConnectionInfo;

  /** Information re. closed connection. */
  ev_disc: IConnectionInfo;

  /** Error message. */
  ev_err: string;
}

export class Socket implements ISink, ISource {
  public readonly i: TInBundle<ISocketInputs>;
  public readonly o: TOutBundle<ISocketOutputs>;
  private readonly host: string;
  private readonly port: number;
  private readonly socket: net.Socket;
  private readonly buffer: Map<string, any>;
  private connected: boolean;

  /**
   * @param host
   * @param port
   */
  constructor(host: string, port: number) {
    MSink.init.call(this, ["d_val", "st_conn"]);
    MSource.init.call(this, [
      "d_val", "b_d_val", "st_conn", "ev_conn", "ev_disc", "ev_err"]);

    const socket = new net.Socket();
    socket.on("connect", () => this.onConnect());
    socket.on("close", () => this.onClose());
    socket.on("error", (err: Error) => this.onError(err));

    this.host = host;
    this.port = port;
    this.socket = socket;
    this.buffer = new Map();
    this.connected = false;
  }

  public send(
    port: IInPort<ValueOf<ISocketInputs>>,
    value: ValueOf<ISocketInputs>,
    tag?: string
  ): void {
    const socket = this.socket;
    const connected = this.connected;
    switch (port) {
      case this.i.d_val:
        const val = value as Buffer | string;
        if (connected) {
          const buffer = this.buffer;
          buffer.set(tag, value);
          socket.write(val, "utf8", (err: Error) => this.onWrite(err, val, tag));
        } else {
          // socket is not connected
          // bouncing inputs
          this.o.b_d_val.send(val, tag);
        }
        break;

      case this.i.st_conn:
        const conn = value as boolean;
        if (conn && !connected && !socket.connecting) {
          // socket is not connected and is not in the process of connecting
          // attempting to open connection
          socket.connect(this.port, this.host);
        } else if (!conn && (connected || socket.connecting)) {
          // TODO: Can we call end() while connecting?
          // socket is connected or is in the process of connecting
          // closing connection
          socket.end();
        }
        break;
    }
  }

  /**
   * Bounces all buffered inputs.
   */
  private bounceAll() {
    const buffer = this.buffer;
    if (buffer.size > 0) {
      const port = this.o.b_d_val;
      for (const [tag, value] of this.buffer.entries()) {
        port.send(value, tag);
      }
    }
  }

  /**
   * Handles socket connection.
   * Sets connected state and sends true `connected` flag to output.
   */
  private onConnect(): void {
    const connected = true;
    this.connected = connected;
    this.o.st_conn.send(connected);
  }

  /**
   * Handles socket closure.
   * Sets connected state, emits false 'connected' flag, and bounces all
   * buffered inputs.
   */
  private onClose(): void {
    const connected = false;
    this.connected = connected;
    this.o.st_conn.send(connected);
    this.bounceAll();
  }

  /**
   * Handles socket errors.
   * Emits stringified error.
   * @param err
   */
  private onError(err: Error): void {
    this.o.ev_err.send(String(err));
    this.bounceAll();
  }

  /**
   * Handles socket write outcome.
   * Bounces input and emits stringified error on error. Removes affected input
   * from buffer.
   * @param err
   * @param value
   * @param tag
   */
  private onWrite(err: Error, value: Buffer | string, tag?: string): void {
    if (err) {
      this.o.b_d_val.send(value, tag);
      this.o.ev_err.send(String(err));
    }
    this.buffer.delete(tag);
  }
}
