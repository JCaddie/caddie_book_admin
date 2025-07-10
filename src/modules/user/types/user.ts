export interface User {
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  role: "master" | "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  searchTerm: string;
  role: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
}
