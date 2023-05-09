import ENV from "../config/env";
import jwt from "jsonwebtoken";

class JsonWebToken {
  secret = ENV.jwtSecret;
  public generateRefreshToken(payload: any) {
    const token = jwt.sign(payload, this.secret, {
      expiresIn: "365d",
    });
    return token;
  }

  public generateAccessToken(payload: any) {
    const token = jwt.sign(payload, this.secret, {
      expiresIn: "7hr",
    });
    return token;
  }

  public verifyJwt(payload: any) {
    try {
      return jwt.verify(payload, this.secret);
    } catch (e: any) {
      return false;
    }
  }

  public hasTokenExpired(token: string) {
    try {
      const decodedToken = jwt.verify(token, this.secret);
      const { exp } = decodedToken as any;

      // Check if the token has expired
      if (exp < Date.now() / 1000) return true;
      return false;
    } catch (err) {
      console.error("Error verifying JWT:", err.message);
    }
  }
}

export default JsonWebToken;
