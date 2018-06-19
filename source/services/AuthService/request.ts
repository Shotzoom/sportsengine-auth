import * as qs from '../../utils/qs';
import { uid } from "../../utils/uid";
import { send } from "./send";
import { MessageKind } from './Message';

interface RequestConfig {
  id: string,
  callback: string,
  authorize: string
}

interface RequestCallback {
  (error: Error, response: Response): void
}

enum RequestState {
  Idle,
  Pending,
  Complete
}

interface Response {
  success: boolean,
  code: string
}

class Request {
  private _config: RequestConfig;
  private _callback: RequestCallback;
  private _state: RequestState = RequestState.Idle;
  private _nonce: string = uid();

  public constructor(config: RequestConfig, callback: RequestCallback) {
    if (config == null) {
      throw new TypeError('Expected a request config.');
    }

    if (callback == null) {
      throw new TypeError('Expected a request callback.');
    }

    this._config = config;
    this._callback = callback;
  }

  public get uri(): string {
    const query = qs.stringify({
      state: this._nonce,
      response_type: 'code',
      client_id: this._config.id,
      redirect_uri: this._config.callback
    });

    return `${this._config.authorize}?${query}`;
  }

  public send() {
    if (this._state === RequestState.Idle) {
      this._state = RequestState.Pending;

      send(this.uri, (error, response) => {
        if (error != null) {
          this._reject(error);
        } else {
          switch (response.kind) {
            case MessageKind.Code:
              this._resolve({ success: true, code: response.data });
              break;
            default:
              this._resolve({ success: false, code: '' });
          }
        }
      });
    }
  }

  private _reject(error: Error) {
    if (this._state !== RequestState.Complete) {
      this._state = RequestState.Complete;
      this._callback(error, null);
    }
  }

  private _resolve(response: Response) {
    if (this._state !== RequestState.Complete) {
      this._state = RequestState.Complete;
      this._callback(null, response);
    }
  }
}

export default function request(config: RequestConfig, cb: RequestCallback) {
  return new Request(config, cb).send();
}
