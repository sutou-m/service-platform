export type ApplyNotifyData = {
  companyName: string;
  ownerName:   string;
  email:       string;
  phone:       string;
  areas:       string[];
  serviceTypes: string[];
};

export function applyNotifyHtml(data: ApplyNotifyData): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>新規業者申請通知</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','Meiryo',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#1a1a1a;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">ServiceHub 管理通知</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 24px;font-size:15px;font-weight:700;color:#1a1a1a;">新規業者申請が届きました</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e0e0e0;margin-bottom:24px;font-size:14px;">
            <tr><td style="padding:6px 0;color:#555;width:120px;">会社名・屋号</td><td style="padding:6px 0;">${data.companyName}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">代表者名</td><td style="padding:6px 0;">${data.ownerName}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">メール</td><td style="padding:6px 0;">${data.email}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">電話番号</td><td style="padding:6px 0;">${data.phone}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">対応エリア</td><td style="padding:6px 0;">${data.areas.join("、")}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">作業種別</td><td style="padding:6px 0;">${data.serviceTypes.join("、")}</td></tr>
          </table>
          <a href="${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/contractors/applications"
             style="display:inline-block;padding:10px 20px;background:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:500;">
            申請内容を確認する
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
