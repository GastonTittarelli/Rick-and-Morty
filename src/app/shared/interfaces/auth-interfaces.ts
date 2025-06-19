export interface LoginResponse {
  header: {
    message?: string;
    error?: string;
    resultCode: number;
  };
  data: {
    user: {
      id: string;
      role: string;
      name: string;
      mail: string;
      address: {
        street: string;
        location: string;
        city: string;
        country: string;
        cp: string;
      };
      birthday: string; // o Date, ver
      phone: string;
    };
    token: string;
  };
}

export interface RegisterRequest {
  name: string;
  mail: string;
  password: string;
  address: {
    street: string;
    city: string;
    country: string;
    cp: string;
    location: string;
  };
  birthday: string;
  phone: string;
}

export interface RegisterResponse {
  header: {
    message?: string;
    error?: string;
    resultCode: number;
  };
  data: {
    user: {
      id: string;
      role: string;
      name: string;
      mail: string;
      address: {
        street: string;
        location: string;
        city: string;
        country: string;
        cp: string;
      };
      birthday: string; // o Date si lo convertís
      phone: string;
      date: string; // Fecha de creación
    };
  };
}