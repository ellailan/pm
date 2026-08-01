// ─── Portfolio Types ───
export type Portfolio =
  | "Events"
  | "Presidential"
  | "Marketing"
  | "Internal"
  | "External"
  | "Tech"
  | "youCode"
  | "Data";

export const PORTFOLIOS: Portfolio[] = [
  "Events",
  "Presidential",
  "Marketing",
  "Internal",
  "External",
  "Tech",
  "youCode",
  "Data",
];

export const PORTFOLIO_COLORS: Record<Portfolio, string> = {
  Events: "#F97316",
  Presidential: "#A053AA",  /* Purple */
  Marketing: "#E7AEC2",   /* Pink */
  Internal: "#AED8C6",    /* Mint Green */
  External: "#60A5FA",
  Tech: "#22C55E",
  youCode: "#FACC15",
  Data: "#6366F1",
};

// ─── Graphic Types ───
export type GraphicType =
  | "Instagram Post"
  | "Instagram Story"
  | "Instagram Carousel"
  | "Instagram Reel/TikTok"
  | "LinkedIn Post"
  | "Award Certificate"
  | "Thank You Card"
  | "Other";

export const GRAPHIC_TYPES: GraphicType[] = [
  "Instagram Post",
  "Instagram Story",
  "Instagram Carousel",
  "Instagram Reel/TikTok",
  "LinkedIn Post",
  "Award Certificate",
  "Thank You Card",
  "Other",
];

// ─── Request Status ───
export type RequestStatus =
  | "Open"
  | "In Progress"
  | "In Review"
  | "Completed"
  | "Archived";

export const REQUEST_STATUSES: RequestStatus[] = [
  "Open",
  "In Progress",
  "In Review",
  "Completed",
  "Archived",
];

// ─── Priority ───
export type Priority = "Low" | "Medium" | "High" | "Urgent";

export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];

// ─── Request / Ticket ───
export interface Ticket {
  id: string; // internal use only, not displayed
  title: string;
  portfolio: Portfolio;
  pointOfContact: string;
  isCollaboration: boolean;
  collaborators: string[];
  graphicTypes: GraphicType[];
  otherGraphicType: string;
  eventName: string;
  eventTime: string;
  eventLocation: string;
  summary: string;
  deadline: string;
  creativeVision: string;
  references: string[];
  additionalRequests: string;
  status: RequestStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  isOnBoard?: boolean;
  contentLink?: string;
}

// ─── Form Types ───
export interface NewTicketForm {
  portfolio: Portfolio | null;
  pointOfContact: string;
  graphicTypes: GraphicType[];
  otherGraphicType: string;
  eventName: string;
  eventTime: string;
  eventLocation: string;
  summary: string;
  deadline: string;
  creativeVision: string;
  references: string[];
  additionalRequests: string;
  contentLink?: string;
}

// ─── Team Member ───
export interface TeamMember {
  id: string;
  name: string;
}

// ─── Dashboard Stats ───
export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  inReview: number;
  completed: number;
  urgent: number;
}

// ─── Activity ───
export interface Activity {
  id: string;
  type: "completed" | "created" | "status_change" | "comment" | "priority_change";
  ticketId: string;
  ticketTitle: string;
  description: string;
  timestamp: string;
  user: string;
}
