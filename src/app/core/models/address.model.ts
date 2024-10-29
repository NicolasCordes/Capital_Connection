export interface Address {
    street: string;
    number: number;
    locality: string;
    province: string;
    type: 'Home' | 'Work' | 'Other'; // Puedes definir un tipo específico
  }
  