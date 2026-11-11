import { csrfSync } from "csrf-sync";

const { generateToken, csrfSynchronisedProtection } = csrfSync();

export { generateToken, csrfSynchronisedProtection };
