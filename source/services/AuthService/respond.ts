import Message, { MessageKind } from "./Message";

interface Response {
  code: string;
  nonce: string;
}

interface ResponseResult {
  response: Response;
  success: boolean;
}

type ResponseCompleteCallback = (error: Error, result: ResponseResult) => void;

export default function respond(response: Response, callback: ResponseCompleteCallback = () => {}): void {
  if (response == null) {
    throw new TypeError("Expected reponse.");
  }

  if (callback == null) {
    throw new TypeError("Expected callback.");
  }

  const message = new Message(MessageKind.Code, response.nonce, response.code);

  if (window.opener == null) {
    callback(null, { response, success: false });
  } else {
    window.opener.postMessage(JSON.stringify(message), window.location.origin);
    callback(null, { response, success: true });
  }
}
