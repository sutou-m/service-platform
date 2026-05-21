export type InquiryConfirmData = {
  name:        string;
  workContent: string;
  preferredAt?: string;
  notes?:       string;
};

export function inquiryConfirmHtml(data: InquiryConfirmData): string {
  const preferredLine = data.preferredAt
    ? `<tr><td style="padding:6px 0;color:#555;width:120px;">希望日時</td><td style="padding:6px 0;">${new Date(data.preferredAt).toLocaleString("ja-JP")}</td></tr>`
    : "";
  const notesLine = data.notes
    ? `<tr><td style="padding:6px 0;color:#555;">備考</td><td style="padding:6px 0;">${data.notes}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>お問い合わせ受付完了</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','Meiryo',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#1a1a1a;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">ServiceHub</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#1a1a1a;">${data.name} 様</p>
          <p style="margin:0 0 24px;font-size:14px;color:#444;line-height:1.7;">
            この度はServiceHubにお問い合わせいただきありがとうございます。<br>
            以下の内容で受け付けました。担当者よりご連絡差し上げます。
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e0e0e0;margin-bottom:24px;font-size:14px;">
            <tr><td style="padding:6px 0;color:#555;width:120px;">お名前</td><td style="padding:6px 0;">${data.name}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">作業内容</td><td style="padding:6px 0;">${data.workContent}</td></tr>
            ${preferredLine}
            ${notesLine}
          </table>
          <p style="margin:0;font-size:12px;color:#999;">
            ※このメールは自動送信されています。返信はできません。<br>
            お問い合わせはWebサイトのフォームよりお願いいたします。
          </p>
        </td></tr>
        <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#aaa;">© ServiceHub</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
