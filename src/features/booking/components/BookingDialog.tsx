"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookingLandingForm } from "@/features/booking/components/BookingLandingForm";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLocation?: string | null;
}

export function BookingDialog({ open, onOpenChange, initialLocation }: BookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send a Booking Request</DialogTitle>
          <DialogDescription>
            Fill in your details and we will send your enquiry to the Sansthan office via WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <BookingLandingForm
          initialLocation={initialLocation}
          onWhatsAppClick={() => onOpenChange(false)}
          onCallClick={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
