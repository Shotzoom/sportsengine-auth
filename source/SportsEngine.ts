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
  private config: SportsEngineConfig;
  private auth: AuthService;

  public constructor(config: SportsEngineConfig) {
    if (config == null) {
      throw new TypeError('Expected config.');
    }

    this.config = config;
    this.auth = new AuthService();
  }

  public login(cb: (error: Error, result: LoginResult) => void): void {
    this.auth.login(
      {
        id: this.config.id,
        callback: this.config.callback,
        authorize: this.config.authorize
      },
      (error, result) => cb(error, result)
    );
  }
}
