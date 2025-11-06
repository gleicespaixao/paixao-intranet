let accessToken: string | null = null

export function setApiAccessToken(token: string | null) {
  accessToken = token ?? null
}

export function getApiAccessToken() {
  return accessToken
}
