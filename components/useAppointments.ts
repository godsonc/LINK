"use client";

import { useEffect, useState } from "react";
import {
  type Appointment,
  loadAppointments,
  saveAppointments,
} from "@/lib/appointments";

export function useAppointments() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadAppointments());
    setReady(true);
  }, []);

  function commit(next: Appointment[]) {
    saveAppointments(next);
    setItems(next);
  }

  return { ready, items, commit };
}
