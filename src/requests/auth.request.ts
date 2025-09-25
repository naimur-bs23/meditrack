import {UserRole} from "../models/user.model";

export interface RegisterRequest {
    name: string;
    email: string;
    telegramUsername: string;
    password: string;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}