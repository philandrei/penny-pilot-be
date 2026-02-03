export interface AuthUser {
  uuid: string;
  firebaseUid?: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
