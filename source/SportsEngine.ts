import AuthService from "./services/AuthService";

interface LoginResult {
  code: string,
  success: boolean
}

interface SportsEngineConfig {
  id: string,
  callback: string,
  authorize: string
}

export default class SportsEngine {
  private _config: SportsEngineConfig;
  private _auth: AuthService;

  public constructor(config: SportsEngineConfig) {
    if (config == null) {
      throw new TypeError('Expected config.');
    }

    this._config = config;
    this._auth = new AuthService();
  }

  public login(cb: (error: Error, result: LoginResult) => void): void {
    this._auth.login(
      {
        id: this._config.id,
        callback: this._config.callback,
        authorize: this._config.authorize
      },
      (error, result) => cb(error, result)
    );
  }
}
