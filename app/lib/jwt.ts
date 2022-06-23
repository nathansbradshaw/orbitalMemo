import jwt from "jsonwebtoken";
const sessionSecret = process.env.SESSION_SECRET ?? "reallybadsecret";

type Payload = Record<string, any>;

export const createToken = (
  payload: Payload,
  options?: jwt.SignOptions
): string => {
  try {
    const token = jwt.sign(payload, sessionSecret, {
      issuer: "@orbitalMemo/api",
      audience: ["@orbitalMemo/app", "@orbitalMemo/web"],
      expiresIn: "4w",
      ...options,
    });
    return token;
  } catch (error) {
    // Oops
    throw error;
  }
};

export function decryptToken<T>(token: string): T {
  try {
    jwt.verify(token, sessionSecret);
    const payload = jwt.decode(token);
    return payload as T;
  } catch (error) {
    // Oops
    throw error;
  }
}
