import listen from "../../utils/listen";
import poll from "../../utils/poll";
import Message, { MessageKind } from "./Message";

interface ChannelCallback {
  (error: Error, message: Message): void
}

const WINDOW_FEATURES = {
  width: 600,
  height: 800
};

function getWindowFeatures() {
  const { width, height } = WINDOW_FEATURES;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;

  return `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
}

class PopupChannel {
  private uri: string;
  private callback: ChannelCallback;
  private window: Window;
  private closed: boolean = true;
  private unlisten: () => void;

  public constructor(uri: string, callback: ChannelCallback) {
    if (uri == null || uri === '') {
      throw new TypeError('Expected a uri.');
    }

    if (callback == null) {
      throw new TypeError('Expected callback.');
    }

    this.uri = uri;
    this.callback = callback;
  }

  public send(): void {
    if (this.closed) {
      this.window = window.open(this.uri, 'SportsEngine Authorization', getWindowFeatures());
      this.unlisten = listen(window, 'message', (e) => this.onMessage(<MessageEvent>e), false);
      this.closed = false;
      poll(() => this.window.closed, () => this.onClose());
    }
  }

  private close() {
    if (!this.closed) {
      this.unlisten();
      this.window.close();
      this.closed = true;
    }
  }

  private receive(error: Error, data: any) {
    if (!this.closed) {
      this.callback(error, data);
      this.close();
    }
  }

  private onClose() {
    this.receive(null, { kind: MessageKind.Cancel, data: null });
  }

  private onMessage(e: MessageEvent) {
    if (e.origin === window.location.origin) {
      try {
        this.receive(null, Message.fromJSON(e.data));
      } catch(e) {
        this.receive(e, null);
      }
    }
  }
}

export function send(uri: string, cb: (error: Error, message: Message) => void): void {
  new PopupChannel(uri, cb).send();
}
