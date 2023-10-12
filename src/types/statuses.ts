type statuses = "pending" | "active" | "blocked";

const allStatuses: Array<statuses> = [
  "pending",
  "active",
  "blocked"
]

interface UserStatus {
  id: string | number,
  status: statuses
}

export {allStatuses, UserStatus};