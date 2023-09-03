namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    SALT_ROUNDS: number;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
  }
}
