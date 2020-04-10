import Cookies from 'js-cookie'

const TokenKey = 'loginFlag'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getOtherToken(key) {
  return Cookies.get(key)
}

export function setOtherToken(key,token) {
  return Cookies.set(key, token)
}

export function removeOtherToken(key) {
  return Cookies.remove(key)
}
