export enum MessageKind {
  Uknown,
  Cancel,
  Code
}

export default class Message {
  public kind: MessageKind;
  public data: any;

  public constructor (kind: MessageKind, data: any) {
    this.kind = kind;
    this.data = data;
  }

  static fromJSON(value: string) {
    const message = JSON.parse(value);
    let kind = MessageKind.Uknown;
    let data = {};

    if (message != null) {
      if (message.kind != null) {
        kind = message.kind;
      }

      if (message.data != null) {
        data = message.data;
      }
    }

    return new Message(kind, data);
  }
}
