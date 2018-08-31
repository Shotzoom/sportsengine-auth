import * as qs from "../../utils/qs";
import { MessageKind } from "./Message";
import { send } from "./send";

interface IRequestConfig {
  id: string;
  callback: string;
  authorize: string;
}

type RequestCallback = (error: Error, response: IResponse) => void;

enum RequestState {
  Idle,
  Pending,
  Complete
}

interface IResponse {
  code: string;
  success: boolean;
}

class Request {
  private config: IRequestConfig;
  private callback: RequestCallback;
  private state: RequestState = RequestState.Idle;

  public constructor(config: IRequestConfig, callback: RequestCallback) {
    if (config == null) {
      throw new TypeError("Expected a request config.");
    }

    if (callback == null) {
      throw new TypeError("Expected a request callback.");
    }

    this.config = config;
    this.callback = callback;
  }

  public get uri(): string {
    const query = qs.stringify({
      client_id: this.config.id,
      redirect_uri: this.config.callback,
      response_type: "code"
    });

    return `${this.config.authorize}?${query}`;
  }

  public send() {
    if (this.state === RequestState.Idle) {
      this.state = RequestState.Pending;

      send(this.uri, (error, response) => {
        if (error != null) {
          this.reject(error);
        } else {
          switch (response.kind) {
            case MessageKind.Code:
              this.resolve({ success: true, code: response.data });
              break;
            default:
              this.resolve({ success: false, code: "" });
          }
        }
      });
    }
  }

  private reject(error: Error) {
    if (this.state !== RequestState.Complete) {
      this.state = RequestState.Complete;
      this.callback(error, null);
    }
  }

  private resolve(response: IResponse) {
    if (this.state !== RequestState.Complete) {
      this.state = RequestState.Complete;
      this.callback(null, response);
    }
  }
}

export default function request(config: IRequestConfig, cb: RequestCallback) {
  return new Request(config, cb).send();
}
