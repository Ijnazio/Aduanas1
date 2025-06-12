export interface User {
  id: number;
  username: string;
  role: "funcionario" | "turista" | "sag" | "pdi";
  fullName: string;
}

export interface FoodItem {
  name: string;
  allowed: boolean;
  restricted: boolean;
  prohibited: boolean;
}

export interface PetDetails {
  type: string;
  count: number;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

export interface ReviewItem {
  id: number;
  applicantName: string;
  document: string;
  type: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  timeInQueue: string;
  status: "pending" | "in_progress" | "approved" | "rejected";
}
