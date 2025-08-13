import "server-only";

import arcjet, {
  shield,
  detectBot,
  sensitiveInfo,
  protectSignup,
  fixedWindow,
  slidingWindow,
} from "@arcjet/next";
import { env } from "./env";

export { detectBot, sensitiveInfo, protectSignup, fixedWindow, slidingWindow };

const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],
  rules: [
    // Protect against common attacks with Arcjet Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
});

export default aj;
