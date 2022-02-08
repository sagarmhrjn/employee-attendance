export interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: Role;
    role_name: string;
}

export interface UserDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
}

export interface Role{
    id:string;
    name:string
}