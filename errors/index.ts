export class EmailNotVerifiedError extends Error {
    constructor() {
      super('Please verify your email address first!');
      this.name = 'EmailNotVerifiedError';
    }
  }
  
  export class InvalidCredentialsError extends Error {
    constructor() {
      super('Invalid email or password!');
      this.name = 'InvalidCredentialsError';
    }
  }
  
  export class UserNotFoundError extends Error {
    constructor() {
      super('User not found!');
      this.name = 'UserNotFoundError';
    }
  }
  
  export class TokenExpiredError extends Error {
    constructor() {
      super('The verification code has expired!');
      this.name = 'TokenExpiredError';
    }
  }
  