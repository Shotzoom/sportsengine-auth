import Message, { MessageKind } from "./Message";

interface IResponse {
  code: string;
}

interface IResponseResult {
  response: IResponse;
  success: boolean;
}

type ResponseCompleteCallback = (error: Error, result: IResponseResult) => void;

// tslint:disable-next-line:no-empty
export default function respond(response: IResponse, callback: ResponseCompleteCallback = () => {}): void {
  if (response == null) {
    throw new TypeError("Expected reponse.");
  }

  if (callback == null) {
    throw new TypeError("Expected callback.");
  }

  const message = new Message(MessageKind.Code, response.code);

  if (window.opener == null) {
    callback(null, { response, success: false });
  } else {
    window.opener.postMessage(JSON.stringify(message), window.location.origin);
    callback(null, { response, success: true });
  }
}
