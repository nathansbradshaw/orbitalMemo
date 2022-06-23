import { IS_PRODUCTION } from "./config";
export const FULL_WEB_URL = `${
  IS_PRODUCTION ? "https://orbitalmemo.onrender.com" : "http://localhost:3000"
}`;

export const { SENDGRID_API_KEY = "SENDGRID_API_KEY" } = process.env;
