

declare namespace Express {
  export interface Session {
    [key: string]: any;
  }

  export interface Request {
    user: any;
    session?: Session;
  }
}
