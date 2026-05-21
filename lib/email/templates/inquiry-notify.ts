export type InquiryNotifyData = {
  name:        string;
  email:       string;
  phone:       string;
  address:     string;
  workContent: string;
  preferredAt?: string;
  notes?:       string;
};

export function inquiryNotifyHtml(data: InquiryNotifyData): string {
  const preferredLine = data.preferredAt
    ? `<tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;width:120px;">希望日時</td><td style="padding:6px 0;">${new Date(data.preferredAt).toLocaleString("ja-JP")}</td></tr>`
    : "";
  const notesLine = data.notes
    ? `<tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">備考</td><td style="padding:6px 0;">${data.notes}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>新規問い合わせ通知</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','Meiryo',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#1a1a1a;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">ServiceHub 管理通知</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 24px;font-size:15px;font-weight:700;color:#1a1a1a;">新規問い合わせが届きました</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e0e0e0;margin-bottom:24px;font-size:14px;">
            <tr><td style="padding:6px 0;color:#555;width:120px;">氏名</td><td style="padding:6px 0;">${data.name}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">メール</td><td style="padding:6px 0;">${data.email}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">電話番号</td><td style="padding:6px 0;">${data.phone}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">住所</td><td style="padding:6px 0;">${data.address}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">作業内容</td><td style="padding:6px 0;">${data.workContent}</td></tr>
            ${preferredLine}
            ${notesLine}
          </table>
          <a href="${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/inquiries"
             style="display:inline-block;padding:10px 20px;background:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:500;">
            管理画面で確認する
          </a>
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
