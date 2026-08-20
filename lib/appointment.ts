const legacyAppointmentTimes: Record<string, string> = {
  "Weekday morning": "10:00",
  "Weekday afternoon": "14:00",
  "Weekday evening": "18:00",
  Saturday: "11:00"
};

export function normalizeAppointmentTime(value?: string | null) {
  if (value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return value;
  return legacyAppointmentTimes[value ?? ""] ?? "10:00";
}

export function normalizeAppointmentDescription(value?: string | null) {
  if (!value) return value ?? "";
  return Object.entries(legacyAppointmentTimes).reduce(
    (result, [legacy, exact]) => result.replace(legacy, exact),
    value
  );
}
