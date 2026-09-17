export type NeedId =
  | "money"
  | "work"
  | "caring"
  | "digital"
  | "community"
  | "independent";

export type Capacity = "available" | "limited" | "full";

export type VerificationStatus = "verified" | "pending" | "expired";

export type LocalityId =
  | "boston"
  | "skegness"
  | "mablethorpe"
  | "louth"
  | "horncastle"
  | "lincoln"
  | "gainsborough"
  | "spalding"
  | "sleaford"
  | "grantham"
  | "online";

export type Service = {
  id: string;
  name: string;
  organisation: string;
  summary: string;
  howToAccess: string;
  nextAction: string;
  documents: string[];
  categories: NeedId[];
  locality: LocalityId;
  district: string;
  milesFromPilotHub: number;
  cost: "free" | "low" | "paid";
  capacity: Capacity;
  wheelchairAccess: boolean;
  phoneAndOnline: boolean;
  ruralReach: boolean;
  eligibilityNotes: string;
  phone?: string;
  website?: string;
  email?: string;
  lastVerified: string;
  verification: VerificationStatus;
  acceptingReferrals: boolean;
};

export type ClassifiedNeed = {
  id: NeedId;
  label: string;
  reason: string;
  score: number;
};

export type Match = {
  serviceId: string;
  score: number;
  reasons: string[];
  eligibilityPhrase: string;
};

export type PathwayStep = {
  needId: NeedId;
  title: string;
  serviceId: string;
  why: string;
};

export type NextStep = {
  id: string;
  title: string;
  detail: string;
  serviceId?: string;
};

export type Referral = {
  id: string;
  createdAt: string;
  serviceId: string;
  serviceName: string;
  story: string;
  locality: LocalityId;
  status: "requested" | "sent" | "accepted" | "unable";
  contactName: string;
  contactPhone: string;
};

export type NavigatorCase = {
  id: string;
  createdAt: string;
  story: string;
  locality: LocalityId;
  needs: NeedId[];
  reason: string;
  preferredContact: string;
  status: "open" | "in_progress" | "resolved";
};

export type AuditEvent = {
  id: string;
  at: string;
  kind: string;
  detail: string;
};

export type FollowUp = {
  at: string;
  accessed: "yes" | "no" | "not_yet";
  notes: string;
};

export type SessionState = {
  story: string;
  locality: LocalityId;
  answers: Record<string, string>;
  classified: ClassifiedNeed[];
  selectedNeeds: NeedId[];
  matches: Match[];
  pathway: PathwayStep[];
  nextSteps: NextStep[];
  safeguarding: boolean;
  safeguardingAcknowledged: boolean;
  referrals: Referral[];
  navigatorCase?: NavigatorCase;
  followUp?: FollowUp;
};

export type BoardState = {
  referrals: Referral[];
  cases: NavigatorCase[];
  audit: AuditEvent[];
  serviceOverrides: Record<
    string,
    Partial<Pick<Service, "capacity" | "verification" | "acceptingReferrals">>
  >;
};
