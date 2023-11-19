export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "ojb-session",
  secure: process.env.NODE_ENV === "production",
};
