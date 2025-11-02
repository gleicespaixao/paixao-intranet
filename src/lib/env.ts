export const envConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  apiVersion: 'v2',
  xPlatformToken: process.env.NEXT_PUBLIC_X_PLATFORM_TOKEN ?? '',
  profileMasterId: process.env.NEXT_PUBLIC_MASTER_ID ?? '',
  devProfileId: process.env.NEXT_PUBLIC_DEV_ID ?? ''
}
