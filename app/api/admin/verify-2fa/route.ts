import { NextResponse } from 'next/server';
import { verifyTOTP, verifyBackupCode } from '@/lib/totp';
import { cookies } from 'next/headers';
import { TEMP_EMAIL_COOKIE_NAME } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { secret, token, type } = await req.json();
    const cookieStore = cookies();
    const tempEmailCookie = cookieStore.get(TEMP_EMAIL_COOKIE_NAME);

    if (!tempEmailCookie?.value) {
      return NextResponse.json({ 
        verified: false, 
        error: 'No email found in session' 
      }, { status: 400 });
    }

    const email = tempEmailCookie.value;
    
    // Find admin in database
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        totpSecret: true,
        backupCodes: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ 
        verified: false, 
        error: 'Admin not found' 
      }, { status: 404 });
    }

    let verified = false;

    if (type === 'totp') {
      verified = verifyTOTP(secret, token);
      
      // If this is initial setup and verification is successful, save the secret
      if (verified && !admin.totpSecret) {
        await prisma.admin.update({
          where: { id: admin.id },
          data: { totpSecret: secret },
        });
      }
    } else if (type === 'backup') {
      verified = verifyBackupCode(admin.backupCodes || [], token);
      
      // Remove used backup code
      if (verified) {
        const updatedBackupCodes = admin.backupCodes?.filter(code => code !== token) || [];
        await prisma.admin.update({
          where: { id: admin.id },
          data: { backupCodes: updatedBackupCodes },
        });
      }
    }

    return NextResponse.json({ verified });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json({ 
      verified: false, 
      error: 'Verification failed' 
    }, { status: 500 });
  }
}
