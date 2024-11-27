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