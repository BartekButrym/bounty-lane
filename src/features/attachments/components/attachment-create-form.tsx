'use client';

import { ReactNode, useActionState, useEffect, useRef, useState } from 'react';

import { FieldError } from '@/components/form/field-error';
import { Form } from '@/components/form/form';
import { SubmitButton } from '@/components/form/submit-button';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { AttachmentEntity } from '../../../../generated/prisma/client';
import { createAttachments } from '../actions/create-attachments';
import { ACCEPTED, PREVIEWABLE_IMAGE_TYPES } from '../constants';

type AttachmentCreateFormProps = {
  entityId: string;
  entity: AttachmentEntity;
  buttons?: ReactNode;
  onSuccess?: () => void;
};

type PendingFile = {
  file: File;
  previewUrl: string | null;
};

const revokePreviewUrls = (files: PendingFile[]) => {
  files.forEach(({ previewUrl }) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  });
};

const AttachmentCreateForm = ({
  entityId,
  entity,
  buttons,
  onSuccess,
}: AttachmentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, { entityId, entity }),
    EMPTY_ACTION_STATE
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const pendingFilesRef = useRef(pendingFiles);
  pendingFilesRef.current = pendingFiles;

  useEffect(() => {
    return () => revokePreviewUrls(pendingFilesRef.current);
  }, []);

  const syncInputFiles = (files: PendingFile[]) => {
    if (!inputRef.current) return;

    const dataTransfer = new DataTransfer();
    files.forEach(({ file }) => dataTransfer.items.add(file));
    inputRef.current.files = dataTransfer.files;
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    revokePreviewUrls(pendingFiles);

    const files = Array.from(event.target.files ?? []);

    setPendingFiles(
      files.map((file) => ({
        file,
        previewUrl: PREVIEWABLE_IMAGE_TYPES.includes(file.type)
          ? URL.createObjectURL(file)
          : null,
      }))
    );
  };

  const handleRemove = (index: number) => {
    setPendingFiles((prev) => {
      const target = prev[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }

      const next = prev.filter((_, i) => i !== index);
      syncInputFiles(next);

      return next;
    });
  };

  const handleSuccess = () => {
    if (onSuccess) onSuccess?.();

    revokePreviewUrls(pendingFiles);
    setPendingFiles([]);
  };

  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Input
        ref={inputRef}
        name="files"
        id="files"
        type="file"
        multiple
        accept={ACCEPTED.join(',')}
        onChange={handleFilesChange}
      />
      <FieldError actionState={actionState} name="files" />

      {pendingFiles.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {pendingFiles.map((pendingFile, index) => (
            <li
              key={`${pendingFile.file.name}-${index}`}
              className="flex flex-col items-center gap-1 rounded-md border p-2"
            >
              {pendingFile.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pendingFile.previewUrl}
                  alt={pendingFile.file.name}
                  title={pendingFile.file.name}
                  className="h-16 w-16 rounded object-cover"
                />
              ) : (
                <div
                  title={pendingFile.file.name}
                  className="flex h-16 w-16 items-center justify-center rounded bg-muted p-1 text-center text-[10px] text-muted-foreground"
                >
                  Preview not available
                </div>
              )}

              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-red-500"
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      {buttons || <SubmitButton label="Upload" />}
    </Form>
  );
};

export { AttachmentCreateForm };
