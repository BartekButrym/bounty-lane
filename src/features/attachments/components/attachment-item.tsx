import Link from 'next/link';

import { LucideArrowUpRightFromSquare } from 'lucide-react';

import { attachmentDownloadPath } from '@/path';

import { Attachment } from '../../../../generated/prisma/client';

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <Link
        className="flex gap-x-2 items-center text-sm truncate"
        href={attachmentDownloadPath(attachment.id)}
      >
        <LucideArrowUpRightFromSquare className="h-4 w-4" />
        {attachment.name}
      </Link>
      {buttons}
    </div>
  );
};

export { AttachmentItem };
