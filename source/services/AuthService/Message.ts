export enum MessageKind {
  Uknown,
  Cancel,
  Code
}

export default class Message {
  public kind: MessageKind;
  public nonce: string;
  public data: any;

  public constructor(kind: MessageKind, nonce: string, data: any) {
    this.kind = kind;
    this.nonce = nonce;
    this.data = data;
  }

  public static fromJSON(value: string) {
    const message = JSON.parse(value);
    let kind = MessageKind.Uknown;
    let nonce = "";
    let data = {};

    if (message != null) {
      if (message.kind != null) {
        kind = message.kind;
      }

      if (message.nonce != null) {
        nonce = message.nonce;
      }

      if (message.data != null) {
        data = message.data;
      }
    }

    return new Message(kind, nonce, data);
  }
}
