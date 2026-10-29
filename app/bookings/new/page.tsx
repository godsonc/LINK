import { Suspense } from "react";
import { BookingWizard } from "@/components/BookingWizard";

export default function NewBookingPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading your booking…</p>}>
      <BookingWizard />
    </Suspense>
  );
}
