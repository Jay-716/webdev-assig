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

export interface UserResponse {
    id: Number,
    username: String,
    phone_number: String | null,
    email: String | null,
    gender: Number,
    avatar_id: String | null,
    bio: String | null,
    role: Number,
    birtyday: Date,
    created_at: Date,
    updated_at: Date
}

export interface UserProfileResponse {
    reg_days: Number,
    order_count: Number,
    good_count: Number,
    comment_count: Number,
    timeline: Array<Array<String>>
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

export interface OrderResponse {
    id: Number,
    user_id: Number,
    total_price: Number,
    status: Number,
    address_id: Number,
    created_at: Date,
    updated_at: Date
}

export interface OrderItemResponse {
    id: Number,
    order_id: Number,
    good_id: Number,
    good: GoodResponse,
    style_id: Number,
    style: StyleResponse,
    count: Number,
    price: Number,
    created_at: Date,
    updated_at: Date
}

export interface OrderDetailResponse extends OrderResponse {
    address: AddressResponse,
    order_items: Array<OrderItemResponse>
}

export interface AddToCartRequest {
    good_id: Number,
    style_id: Number | null,
    count: Number
}

export interface DirectBuyRequest {
    good_id: Number,
    style_id: Number | null,
    address_id: Number,
    count: Number
}

export interface PayOrderRequest {
    order_id: Number,
    service_id: Number
}

export interface CartBuyRequest {
    cart_item_ids: Array<Number>,
    address_id: Number
}

export interface NotifiResponse {
    id: Number,
    title: String,
    content: String,
    created_at: Date
}
