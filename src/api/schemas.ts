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
    phone_number: String | null,
    email: String | null,
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

export interface BannerResponse {
    id: Number,
    image_id: String,
    deleted: Boolean,
    created_at: Date,
    updated_at: Date
}

export interface RandomTagResponse {
    id: Number,
    name: String,
    description: String | null
}

export interface RandomGoodResponse {
    id: Number,
    store_id: Number,
    name: String,
    description: String,
    price: Number,
    image_id: String | null
}
