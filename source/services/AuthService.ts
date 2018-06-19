import * as auth from './AuthService/auth';

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

    auth.request({
      id: request.id,
      authorize: request.authorize,
      callback: request.callback
    }, (error, response) => {
      cb(error, { code: response.code, success: response.success });
    });
  }
}
