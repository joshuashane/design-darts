import * as crypto from 'crypto';
/** UUID v4 using Node's built-in crypto — no external dependency */
export function generatePrototypeId() {
    return crypto.randomUUID();
}
