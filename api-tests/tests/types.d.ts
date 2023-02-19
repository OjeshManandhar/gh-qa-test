export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  userId: string;
};
