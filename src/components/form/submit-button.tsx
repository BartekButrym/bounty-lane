'use client';

import { cloneElement } from 'react';

import { LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>, 'svg'>;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export const SubmitButton = ({
  label,
  icon,
  variant = 'default',
  size = 'default',
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" variant={variant} size={size}>
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <>{cloneElement(icon, { className: 'h-4 w-4' })}</>
      ) : null}
      {label}
    </Button>
  );
};
