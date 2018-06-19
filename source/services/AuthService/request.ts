import * as qs from "../../utils/qs";
import { uid } from "../../utils/uid";
import { MessageKind } from "./Message";
import { send } from "./send";

interface RequestConfig {
  id: string;
  callback: string;
  authorize: string;
}

type RequestCallback = (error: Error, response: Response) => void;

enum RequestState {
  Idle,
  Pending,
  Complete,
}

interface Response {
  success: boolean;
  code: string;
}

class Request {
  private config: RequestConfig;
  private callback: RequestCallback;
  private state: RequestState = RequestState.Idle;
  private nonce: string = uid();

  public constructor(config: RequestConfig, callback: RequestCallback) {
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
      state: this.nonce,
      response_type: "code",
      client_id: this.config.id,
      redirect_uri: this.config.callback,
    });

    return `${this.config.authorize}?${query}`;
  }

  public send() {
    if (this.state === RequestState.Idle) {
      this.state = RequestState.Pending;

      send(this.uri, (error, response) => {
        if (error != null) {
          this.reject(error);
        } else if (response.nonce === this.nonce) {
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

  private resolve(response: Response) {
    if (this.state !== RequestState.Complete) {
      this.state = RequestState.Complete;
      this.callback(null, response);
    }
  }
}

export default function request(config: RequestConfig, cb: RequestCallback) {
  return new Request(config, cb).send();
}
