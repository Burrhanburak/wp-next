import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { generateBackupCodes, generateTOTPSecret } from '../lib/totp';
import { adminAuth } from '../lib/firebase-admin';

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.admin.deleteMany();
  
  // Generate admin credentials
  const email = 'admin@example.com';
  const password = 'admin123'; // This is just for testing
  const hashedPassword = await hash(password, 12);
  
  // Generate backup codes
  const backupCodes = generateBackupCodes(10);
  console.log('Generated backup codes:', backupCodes);
  
  // Generate TOTP secret and QR code
  const { secret: totpSecret, qrCodeUrl, otpauthUrl } = await generateTOTPSecret(email);
  
  console.log('Generated TOTP secret:', totpSecret);
  console.log('TOTP QR Code URL:', qrCodeUrl);
  console.log('TOTP Auth URL:', otpauthUrl);
  
  // Create Firebase user first
  let firebaseUser;
  try {
    // Try to get existing user
    firebaseUser = await adminAuth.getUserByEmail(email);
    console.log('Found existing Firebase user:', firebaseUser.uid);
  } catch (error) {
    // Create new Firebase user if doesn't exist
    firebaseUser = await adminAuth.createUser({
      email,
      emailVerified: true,
      password
    });
    console.log('Created new Firebase user:', firebaseUser.uid);
  }

  // Create admin user
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      twoFactorEnabled: true,
      twoFactorSecret: totpSecret,
      backupCodes,
      firebaseUid: firebaseUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('Created admin user:', {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  console.log('\nAdmin Login Credentials:');
  console.log('------------------------');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('TOTP Secret (for Google Authenticator):', totpSecret);
  console.log('\nBackup Codes:');
  backupCodes.forEach((code, index) => {
    console.log(`${index + 1}. ${code}`);
  });
  console.log('\nScan this QR code with your authenticator app:');
  console.log(qrCodeUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
