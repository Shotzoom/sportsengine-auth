import AuthService from "./services/AuthService";

interface ILoginResult {
  code: string;
  success: boolean;
}

interface ISportsEngineConfig {
  authorize: string;
  callback: string;
  id: string;
}

export default class SportsEngine {
  public static version = "ASSEMBLY_VERSION";

  public version: string = "ASSEMBLY_VERSION";
  private config: ISportsEngineConfig;
  private auth: AuthService;

  public constructor(config: ISportsEngineConfig) {
    if (config == null) {
      throw new TypeError("Expected config.");
    }

    this.config = config;
    this.auth = new AuthService();
  }

  public login(cb: (error: Error, result: ILoginResult) => void): void {
    this.auth.login(
      {
        authorize: this.config.authorize,
        callback: this.config.callback,
        id: this.config.id
      },
      (error, result) => cb(error, result)
    );
  }
}
