export interface LoginForm {
    username: String,
    password: String
}
export interface LoginResponse {
    access_token: String,
    token_type: String,
    role: Number
}

export interface RegisterForm {
    username: String,
    phone_number: String,
    email: String,
    password: String
}
export interface RegisterResponse {
    id: Number,
    username: String,
    phone_number: String,
    email: String,
    gender: Number,
    avatar_id: String,
    bio: String,
    role: Number,
    created_at: Date,
    updated_at: Date
}