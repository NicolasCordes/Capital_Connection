export interface AccountData {
  id?: string,
  username: string,
  email?: string,
  password: string
  role: string;
}

export interface ActiveUser {
  id: string,
  username: string
  role: string;
}

