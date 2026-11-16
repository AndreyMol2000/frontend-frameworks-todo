export interface UserSettings { dark: boolean; displayName: string }
export interface IUser { id: string; email: string; settings: UserSettings }
export interface AuthSession { user: IUser; accessToken: string; refreshToken: string }
export interface Credentials { email: string; password: string }
export interface ApiResponse<T> { data: T }
export type ErrorKind = 'validation' | 'network' | 'auth' | 'business';
export interface AppError { kind: ErrorKind; message: string; retryable: boolean }
