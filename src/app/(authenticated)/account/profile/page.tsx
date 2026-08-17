import { getAuthOrRedirect } from '@/auth/cookie';
import { CardCompact } from '@/components/card-compact';
import { Heading } from '@/components/heading';
import { EmailChangeConfirmForm } from '@/features/auth/components/email-change-confirm-form';
import { EmailChangeForm } from '@/features/auth/components/email-change-form';
import { prisma } from '@/lib/prisma';

import { AccountTabs } from '../_navigation/tabs';

const ProfilePage = async () => {
  const { user } = await getAuthOrRedirect();

  const pendingToken = await prisma.emailVerificationToken.findFirst({
    where: { userId: user.id, expiresAt: { gt: new Date() } },
  });

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Profile"
        description="All your profile information"
        tabs={<AccountTabs />}
      />

      <div className="flex-1 flex flex-col items-center gap-y-8">
        <CardCompact
          title="Change Email"
          description={`Current email: ${user.email}`}
          className="w-full max-w-[420px] animate-fade-from-top"
          content={<EmailChangeForm />}
        />

        {pendingToken && (
          <CardCompact
            title="Confirm New Email"
            description={`Enter the code sent to ${pendingToken.email}`}
            className="w-full max-w-[420px] animate-fade-from-top"
            content={<EmailChangeConfirmForm />}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
