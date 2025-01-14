export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
