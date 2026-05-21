export type ReportNotifyData = {
  companyName:  string;
  orderUrl:     string;
  workContent:  string;
  workAddress:  string;
  workedAt:     string;
  contentSnippet: string;
  photoCount:   number;
};

export function reportNotifyHtml(data: ReportNotifyData): string {
  const photoLine = data.photoCount > 0
    ? `<tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;width:120px;">添付写真</td><td style="padding:6px 0;">${data.photoCount} 枚</td></tr>`
    : "";

  const snippet = data.contentSnippet.length > 120
    ? data.contentSnippet.slice(0, 120) + "…"
    : data.contentSnippet;

  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>作業報告通知</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','Meiryo',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#1a1a1a;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">ServiceHub 管理通知</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 24px;font-size:15px;font-weight:700;color:#1a1a1a;">作業報告が登録されました</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e0e0e0;margin-bottom:24px;font-size:14px;">
            <tr><td style="padding:6px 0;color:#555;width:120px;">業者名</td><td style="padding:6px 0;">${data.companyName}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">作業内容</td><td style="padding:6px 0;">${data.workContent}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">作業場所</td><td style="padding:6px 0;">${data.workAddress}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">作業日時</td><td style="padding:6px 0;">${new Date(data.workedAt).toLocaleString("ja-JP")}</td></tr>
            <tr style="border-top:1px solid #f0f0f0;"><td style="padding:6px 0;color:#555;">報告内容</td><td style="padding:6px 0;white-space:pre-line;">${snippet}</td></tr>
            ${photoLine}
          </table>
          <a href="${data.orderUrl}"
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
