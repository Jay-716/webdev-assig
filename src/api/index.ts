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

export function getOrders() {
  return request({
    method: 'get',
    url: '/order'
  })
}

export function getDetailOrder(order_id: Number) {
  return request({
    method: 'get',
    url: `/order/${order_id}`
  })
}
