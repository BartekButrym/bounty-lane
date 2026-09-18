'use client';

import { useState } from 'react';

import { LucideCheck, LucideCopy, LucideX } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

type CredentialSecretToastProps = {
  id: string | number;
  secret: string;
};

const CredentialSecretToast = ({ id, secret }: CredentialSecretToastProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(secret);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg">
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">
          Copy the secret, we will not show it again
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-muted px-2 py-1.5 font-mono text-xs">
            {secret}
          </code>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="shrink-0 transition-colors"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <LucideCheck className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <LucideCopy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        <LucideX className="w-4 h-4" />
      </button>
    </div>
  );
};

export { CredentialSecretToast };
