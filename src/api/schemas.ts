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

export interface TagResponse {
    id: Number,
    name: String,
    description: String | null
}

export interface GoodResponse {
    id: Number,
    store_id: Number,
    name: String,
    description: String,
    price: Number,
    image_id: String | null
}

export interface StoreResponse {
    id: Number,
    owner_id: Number,
    name: String,
    description: String,
    image_id: String | null
}

export interface DetailResponse {
    id: Number,
    good_id: Number,
    text: String | null,
    image_id: String | null
}

export interface StyleResponse {
    id: Number,
    good_id: Number,
    name: String,
    description: String | null,
    price: Number,
    image_id: String | null
}

export interface TagLinkResponse {
    id: Number,
    tag_id: Number,
    tag: {id: Number; name: String; description: String | null; },
    good_id: Number,
    created_at: Date,
    updated_at: Date
}

export interface GoodDetailResponse {
    id: Number,
    store_id: Number,
    name: String,
    description: String,
    price: Number,
    image_id: String | null,
    store: StoreResponse,
    details: Array<DetailResponse>,
    styles: Array<StyleResponse>,
    tag_links: Array<TagLinkResponse>
}

export interface CartItemResponse {
    id: Number,
    user_id: Number,
    good_id: Number,
    good: GoodResponse,
    style_id: Number,
    style: StyleResponse,
    count: Number,
    created_at: Date,
    updated_at: Date
}

export interface AddressResponse {
    id: Number,
    postcode: String | null,
    detail: String,
    name: String,
    phone_number: String,
    comment: String | null,
    user_id: Number
}

export interface PaymentServiceResponse {
    id: Number,
    name: String
}
