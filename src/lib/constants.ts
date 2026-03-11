export const ACCESSORY_CATEGORIES = [
  'Tow Hitch & Receivers',
  'Hitch Bike Carriers',
  'Roof Rack Systems',
  'Cargo Boxes',
  'Cargo Carriers',
  'Frunk / Trunk Organizers',
  'Camping & Overlanding',
  'Other',
] as const;

export type AccessoryCategory = (typeof ACCESSORY_CATEGORIES)[number];

export const TESLA_YEARS = Array.from(
  { length: new Date().getFullYear() - 2012 + 1 },
  (_, i) => new Date().getFullYear() - i
);

// Static fallback — source of truth is the tesla_models DB table
export const TESLA_MODELS_FALLBACK = [
  'Model S',
  'Model 3 (2017-2023)',
  'Model 3 Highland (2024+)',
  'Model X',
  'Model Y (2020-2025)',
  'Model Y Juniper (2025+)',
  'Cybertruck',
] as const;
