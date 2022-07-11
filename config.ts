let env = "development" as "production" | "development";

if (!env) {
  const hostname = typeof window !== "undefined" && window?.location?.hostname;
  env = "development";
  if (hostname) {
    if (hostname.includes("n8bradshaw")) {
      env = "production";
    }
  } else {
    env =
      (process.env.APP_ENV as "development" | "production") || "development";
  }
}

export const IS_PRODUCTION = env === "production";
