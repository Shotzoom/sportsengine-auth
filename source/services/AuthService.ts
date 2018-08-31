import * as auth from './AuthService/auth'

interface ILoginResponse {
  code: string
}

interface ILoginResult {
  code: string
  success: boolean
}

interface ILoginRequest {
  authorize: string
  callback: string
  id: string
}

type LoginCallback = (error: Error, result: ILoginResult) => void

export default class AuthService {
  public login (request: ILoginRequest, cb: LoginCallback): void {
    if (request == null) {
      throw new TypeError('Expected login request.')
    }

    if (cb == null) {
      throw new TypeError('Expected callback.')
    }

    auth.request(
      {
        authorize: request.authorize,
        callback: request.callback,
        id: request.id
      },
      (error, response) => {
        if (error) {
          cb(error, null)
        } else {
          cb(null, { code: response.code, success: response.success })
        }
      }
    )
  }

  public respond (response: ILoginResponse): void {
    if (response == null) {
      throw new TypeError('Expected response.')
    }

    auth.respond({ code: response.code })
  }
}
