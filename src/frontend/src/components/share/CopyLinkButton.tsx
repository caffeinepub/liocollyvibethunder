import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for browsers without clipboard API or non-secure contexts
        toast.info('Copy the URL from the address bar to share this page');
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Copy the URL from the address bar to share this page');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopyLink}
      className="text-muted-foreground hover:text-foreground"
      aria-label="Copy link"
    >
      {copied ? <Check className="h-5 w-5 text-success" /> : <Share2 className="h-5 w-5" />}
    </Button>
  );
}
