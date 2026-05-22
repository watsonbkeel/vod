export async function sendSmsCode(phone: string, code: string) {
  if (!process.env.TENCENT_SMS_SDK_APP_ID) {
    console.log(`[sms:dev] ${phone} code=${code}`);
    return;
  }

  throw new Error("Tencent SMS integration is not configured yet");
}
