import { Suspense } from 'react';

import { Heading } from '@/components/heading';
import { Spinner } from '@/components/spinner';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { MembershipList } from '@/features/memberships/components/membership-list';

type MembershipsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const MembershipsPage = async ({ params }: MembershipsPageProps) => {
  const { organizationId } = await params;
  const { user } = await getAuthOrRedirect();

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Memberships"
        description="Menage members in your organization"
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList
          organizationId={organizationId}
          currentUserId={user.id}
        />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
