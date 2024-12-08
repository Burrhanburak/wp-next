import { auth } from "@/auth";
import { TokenExpiredError } from "@/errors";
import { EmailService } from '@/services/email/emailService';
import { TokenService } from '@/services/token/tokenService';
import { UserRepository } from '@/repositories/userRepository';

export class AuthService {
  private emailService: EmailService;
  private userRepository: UserRepository;

  constructor() {
    this.emailService = new EmailService();
    this.userRepository = new UserRepository();
  }

  async getCurrentUser() {
    const session = await auth();
    return session?.user;
  }

  async verifyEmail(token: string, email: string) {
    try {
      const user = await this.userRepository.findByEmailAndToken(email, token);

      if (!user) {
        throw new TokenExpiredError();
      }

      await this.userRepository.updateVerificationStatus(user.id, true);
      return { success: "Email verified successfully!" };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return { error: "Verification code has expired!" };
      }
      return { error: "An error occurred!" };
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return { error: "User not found!" };
      }

      if (user.emailVerified) {
        return { error: "Email is already verified!" };
      }

      const token = TokenService.generateVerificationCode();
      const expires = TokenService.generateExpiresTimestamp();

      await this.userRepository.updateVerificationToken(user.id, token, expires);
      await this.emailService.sendVerificationEmail(email, user.name, token);

      return { success: "Verification email sent successfully!" };
    } catch (error) {
      return { error: "Failed to send verification email!" };
    }
  }

  async getClientIp(req: Request) {
    const xff = req.headers.get('x-forwarded-for');
    return xff ? xff.split(',')[0] : '127.0.0.1';
  }


}