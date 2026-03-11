export const TESLA_MODELS = [
  'Model S',
  'Model 3',
  'Model X',
  'Model Y',
  'Cybertruck',
] as const;

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

export type TeslaModel = (typeof TESLA_MODELS)[number];
export type AccessoryCategory = (typeof ACCESSORY_CATEGORIES)[number];

export const TESLA_YEARS = Array.from(
  { length: new Date().getFullYear() - 2012 + 1 },
  (_, i) => new Date().getFullYear() - i
);
