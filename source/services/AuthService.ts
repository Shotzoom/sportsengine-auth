import * as auth from './AuthService/auth';

interface LoginResponse {
  code: string,
  nonce: string
}

interface LoginResult {
  success: boolean,
  code: string
}

interface LoginRequest {
  id: string,
  callback: string,
  authorize: string
}

interface LoginCallback {
  (error: Error, result: LoginResult): void
}

export default class AuthService {
  public login(request: LoginRequest, cb: LoginCallback): void {
    if (request == null) {
      throw new TypeError('Expected login request.');
    }

    if(cb == null) {
      throw new TypeError('Expected callback.');
    }

    auth.request(
      {
        id: request.id,
        authorize: request.authorize,
        callback: request.callback
      },
      (error, response) => {
        if (error) {
          cb(error, null);
        } else {
          cb(null, { code: response.code, success: response.success });
        }
      }
    );
  }

  public respond(response: LoginResponse, ): void {
    if (response == null) {
      throw new TypeError('Expected response.');
    }

    auth.respond({ code: response.code, nonce: response.nonce });
  }
}
