export interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    role_name: string;
}

export interface UserDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
}