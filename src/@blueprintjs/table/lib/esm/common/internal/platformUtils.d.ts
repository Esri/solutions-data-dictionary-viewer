/**
 * Returns `true` if `navigator.platform` matches a known Mac platform, or
 * `false` otherwise.
 */
export declare function isMac(platformOverride?: string): boolean;
/**
 * Returns `true` if (1) the platform is Mac and the keypress includes the `cmd`
 * key, or (2) the platform is non-Mac and the keypress includes the `ctrl` key.
 */
export declare const isModKeyPressed: (event: KeyboardEvent, platformOverride?: string) => boolean;
