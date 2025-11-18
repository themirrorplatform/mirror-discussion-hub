// src/components/WishlistComposerModal.tsx
import { WishlistComposer } from "./WishlistComposer";

interface WishlistComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wishlist: {
    title: string;
    description: string;
    category: string;
    reasoning?: string;
  }) => Promise<void> | void;
}

export function WishlistComposerModal({
  isOpen,
  onClose,
  onSubmit,
}: WishlistComposerModalProps) {
  if (!isOpen) return null;

  return (
    <WishlistComposer
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}


