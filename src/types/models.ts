export type UserRole = 'admin' | 'agent' | 'customer';
export interface AuthState {
    user: User | null;
    token: string | null;
}
export interface LoginForm {
    email: string;
    password: string
};
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active?: boolean;
  created_at?: string;
}
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string; 
  role: 'admin' | 'agent' | 'customer';
}
export interface TicketState {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
}
export interface TicketPayload{
  subject: string;
  description: string;
  status_id?: number;
  priority_id?: number;
  assigned_to?: number;
}
export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status_id: number;
  status_name: string;    
  priority_id: number;
  priority_name: string;  
  created_by: number;
  created_by_name?: string;  
  assigned_to: number | null;
  assigned_to_name?: string;  
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  ticket_id: number;
  author_id: number;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface Priority {
  id: number;
  name: string;
}