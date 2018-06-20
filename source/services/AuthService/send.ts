import listen from "../../utils/listen";
import poll from "../../utils/poll";
import Message, { MessageKind } from "./Message";

type ChannelCallback = (error: Error, message: Message) => void;

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
  private nonce: string;
  private callback: ChannelCallback;
  private window: Window;
  private closed: boolean = true;
  private unlisten: () => void;

  public constructor(
    uri: string,
    nonce: string,
    callback: ChannelCallback
  ) {
    if (uri == null || uri === "") {
      throw new TypeError("Expected a uri.");
    }

    if (nonce == null || nonce === "") {
      throw new TypeError("Expected a nonce.");
    }

    if (callback == null) {
      throw new TypeError("Expected callback.");
    }

    this.uri = uri;
    this.nonce = nonce;
    this.callback = callback;
  }

  public send(): void {
    if (this.closed) {
      this.window = window.open(this.uri, "SportsEngine Authorization", getWindowFeatures());
      this.unlisten = listen(window, "message", (e) => this.onMessage(e as MessageEvent), false);
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
    this.receive(null, new Message(MessageKind.Cancel, this.nonce, null));
  }

  private onMessage(e: MessageEvent) {
    if (e.origin === window.location.origin) {
      try {
        const message = Message.fromJSON(e.data);

        if (message.nonce === this.nonce) {
          this.receive(null, message);
        }
      } catch (e) {
        this.receive(e, null);
      }
    }
  }
}

export function send(
  uri: string,
  nonce: string,
  cb: (error: Error, message: Message) => void
): void {
  new PopupChannel(uri, nonce, cb).send();
}
