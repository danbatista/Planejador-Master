export function isAuthBypass() {
  return process.env.NEXT_PUBLIC_AUTH_BYPASS === "1";
}
