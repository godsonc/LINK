import type { LocalityId } from "./types";

export const LOCALITIES: {
  id: LocalityId;
  name: string;
  district: string;
  rural: boolean;
}[] = [
  { id: "boston", name: "Boston", district: "Boston", rural: false },
  { id: "skegness", name: "Skegness", district: "East Lindsey", rural: false },
  {
    id: "mablethorpe",
    name: "Mablethorpe",
    district: "East Lindsey",
    rural: true,
  },
  { id: "louth", name: "Louth", district: "East Lindsey", rural: true },
  {
    id: "horncastle",
    name: "Horncastle",
    district: "East Lindsey",
    rural: true,
  },
  { id: "lincoln", name: "Lincoln", district: "Lincoln", rural: false },
  {
    id: "gainsborough",
    name: "Gainsborough",
    district: "West Lindsey",
    rural: false,
  },
  { id: "spalding", name: "Spalding", district: "South Holland", rural: false },
  { id: "sleaford", name: "Sleaford", district: "North Kesteven", rural: true },
  { id: "grantham", name: "Grantham", district: "South Kesteven", rural: false },
  { id: "online", name: "Anywhere / online", district: "Lincolnshire", rural: false },
];

export function localityById(id: LocalityId) {
  return LOCALITIES.find((item) => item.id === id) ?? LOCALITIES[0];
}

const POSTCODE_PREFIXES: [string, LocalityId][] = [
  ["PE21", "boston"],
  ["PE22", "boston"],
  ["PE25", "skegness"],
  ["LN12", "mablethorpe"],
  ["LN11", "louth"],
  ["LN9", "horncastle"],
  ["LN6", "lincoln"],
  ["LN5", "lincoln"],
  ["LN2", "lincoln"],
  ["LN1", "lincoln"],
  ["DN21", "gainsborough"],
  ["PE12", "spalding"],
  ["PE11", "spalding"],
  ["NG34", "sleaford"],
  ["NG31", "grantham"],
];

export function localityFromPostcode(postcode: string): LocalityId | null {
  const compact = postcode.replace(/\s+/g, "").toUpperCase();
  const match = POSTCODE_PREFIXES.find(([prefix]) => compact.startsWith(prefix));
  return match?.[1] ?? null;
}
