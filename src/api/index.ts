import request from './config'
import * as schemas from './schemas'


export function login(data: schemas.LoginForm) {
  return request({
    method: 'post',
    url: '/auth/jwt/login',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

export function register(data: schemas.RegisterForm) {
  return request({
    method: 'post',
    url: '/auth/register',
    data: data
  })
}

export function updateUser(data: schemas.UserUpdate) {
  return request({
    method: 'patch',
    url: '/auth/me',
    data: data
  })
}

export function getUser() {
  return request({
    method: 'get',
    url: '/auth/me'
  })
}

export function getUserProfile() {
  return request({
    method: 'get',
    url: '/user/profile'
  })
}

export function getBanner() {
  return request({
    method: 'get',
    url: '/banner/active'
  })
}

export function getRandomTags() {
  return request({
    method: 'get',
    url: '/tag/random'
  })
}

export function getRandomGoods() {
  return request({
    method: 'get',
    url: '/good/random'
  })
}

export function getGoodDetail(good_id: Number) {
  return request({
    method: 'get',
    url: `/good/${good_id}`
  })
}

export function getCartItems() {
  return request({
    method: 'get',
    url: '/order/cart'
  })
}

export function getAddresses() {
  return request({
    method: 'get',
    url: '/address'
  })
}

export function getPaymentServices() {
  return request({
    method: 'get',
    url: '/v1/pay/avail'
  })
}

export function getOrders(size?: Number, page?: Number) {
  return request({
    method: 'get',
    url: '/order',
    params: {
      size,
      page
    }
  })
}

export function getDetailOrder(order_id: Number) {
  return request({
    method: 'get',
    url: `/order/${order_id}`
  })
}

export function addToCart(data: schemas.AddToCartRequest) {
  return request({
    method: 'put',
    url: '/order/cart',
    data: data
  })
}

export function directBuy(data: schemas.DirectBuyRequest) {
  return request({
    method: 'post',
    url: '/order/direct-buy',
    data: data
  })
}

export function payOrder(data: schemas.PayOrderRequest) {
  return request({
    method: 'post',
    url: '/v1/pay/pay-order',
    data: data
  })
}

export function cartBuy(data: schemas.CartBuyRequest) {
  return request({
    method: 'post',
    url: '/order/cart-buy',
    data: data
  })
}

export function getNotifs() {
  return request({
    method: 'get',
    url: '/notif'
  })
}

export function deleteAddress(address_id: Number) {
  return request({
    method: 'delete',
    url: `/address/${address_id}`
  })
}

export function addAddress(data: schemas.AddAddressRequest) {
  return request({
    method: 'post',
    url: '/address',
    data: data
  })
}

export function addStore(data: schemas.RegStoreRequest) {
  return request({
    method: 'post',
    url: '/store',
    data: data
  })
}

export function getStore() {
  return request({
    method: 'get',
    url: '/store'
  })
}

export function getStoreProfile() {
  return request({
    method: 'get',
    url: '/sgood/profile'
  })
}

export function getStoreGoodProfile(good_id: Number) {
  return request({
    method: 'get',
    url: '/sgood/profile/good',
    params: {
      good_id: good_id,
    }
  })
}

export function getStoreGoods(page?: Number, size?: Number) {
  return request({
    method: 'get',
    url: '/sgood',
    params: {
      page: page,
      size: size
    }
  })
}

export function getStoreGoodOrders(good_id: Number) {
  return request({
    method: 'get',
    url: `/sgood/orders/${good_id}`
  })
}

export function sendOrderItem(order_item_id: Number) {
  return request({
    method: 'put',
    url: '/sgood/send',
    params: {
      order_item_id: order_item_id
    }
  })
}

export function getOrderItemStatus(order_item_id: Number) {
  return request({
    method: 'get',
    url: '/sgood/status',
    params: {
      order_item_id: order_item_id
    }
  })
}

export function getOrderItemAddress(order_item_id: Number){
  return request({
    method: 'get',
    url: '/sgood/address',
    params: {
      order_item_id: order_item_id
    }
  })
}

export function deleteGood(good_id: Number) {
  return request({
    method: 'delete',
    url: `/good/${good_id}`
  })
}

export function updateGood(good_id: Number, data: any) {
  return request({
    method: 'put',
    url: `/good/full/${good_id}`,
    data: data
  })
}

export function addGood(data: any) {
  return request({
    method: 'post',
    url: '/good/full',
    data: data
  })
}

export function getGood(q: String) {
  return request({
    method: 'get',
    url: '/good/search',
    params: {
      q,
    }
  })
}
