import SendResponse from "../helper/sendResponse";

export default class BaseController extends SendResponse {
  constructor() {
    super();
  }

  public generateTempPassword() {
    let password = "";
    const possibleChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 8; i++) {
      password += possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
    }

    return password;
  }
}
