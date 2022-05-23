/**
 * Describes the token object that returned by the refresh token service functions.
 */
export type TokenObject = {
  accessToken: string;
  expiresIn?: string | undefined;
  refreshToken?: string | undefined;
};

