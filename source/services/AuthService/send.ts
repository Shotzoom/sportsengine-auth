import listen from "../../utils/listen";
import poll from "../../utils/poll";
import Message, { MessageKind } from "./Message";

interface ChannelCallback {
  (error: Error, message: Message): void
}

class PopupChannel {
  private _uri: string;
  private _callback: ChannelCallback;
  private _window: Window;
  private _closed: boolean = true;
  private _unlisten: () => void;

  public constructor(uri: string, callback: ChannelCallback) {
    if (uri == null || uri === '') {
      throw new TypeError('Expected a uri.');
    }

    if (callback == null) {
      throw new TypeError('Expected callback.');
    }

    this._uri = uri;
    this._callback = callback;
  }

  public send(): void {
    if (this._closed) {
      this._window = window.open(this._uri, '_blank');
      this._unlisten = listen(window, 'message', (e) => this._onMessage(<MessageEvent>e), false);
      this._closed = false;
      poll(() => this._window.closed, () => this._onClose());
    }
  }

  private _close() {
    if (!this._closed) {
      this._unlisten();
      this._window.close();
      this._closed = true;
    }
  }

  private _receive(error: Error, data: any) {
    if (!this._closed) {
      this._callback(error, data);
      this._close();
    }
  }

  private _onClose() {
    this._receive(null, { kind: MessageKind.Cancel, data: null });
  }

  private _onMessage(e: MessageEvent) {
    if (e.origin === window.location.origin) {
      try {
        this._receive(null, Message.fromJSON(e.data));
      } catch(e) {
        this._receive(e, null);
      }
    }
  }
}

export function send(uri: string, cb: (error: Error, message: Message) => void): void {
  new PopupChannel(uri, cb).send();
}
