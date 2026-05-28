export function canUseMockPayments(nodeEnv = process.env.NODE_ENV) {
  return nodeEnv !== "production";
}
