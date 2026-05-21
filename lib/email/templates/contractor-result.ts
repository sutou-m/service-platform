export type ContractorResultData = {
  companyName: string;
  ownerName:   string;
  result:      "approved" | "rejected";
};

export function contractorResultHtml(data: ContractorResultData): string {
  const isApproved = data.result === "approved";

  const resultBadge = isApproved
    ? `<span style="display:inline-block;padding:4px 12px;background:#d1fae5;color:#065f46;border-radius:4px;font-size:13px;font-weight:600;">承認</span>`
    : `<span style="display:inline-block;padding:4px 12px;background:#fee2e2;color:#991b1b;border-radius:4px;font-size:13px;font-weight:600;">却下</span>`;

  const bodyText = isApproved
    ? `登録審査が完了し、業者として承認されました。<br>
       下記のURLよりログインして案件の受付を開始できます。`
    : `誠に申し訳ございませんが、今回の業者登録申請は審査の結果、承認が見送りとなりました。<br>
       詳細についてはお手数ですが管理者までお問い合わせください。`;

  const loginSection = isApproved
    ? `<div style="margin:24px 0;padding:16px;background:#f9f9f9;border-radius:4px;font-size:14px;">
         <p style="margin:0 0 8px;color:#555;">業者ポータルURL</p>
         <a href="${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/contractor/login"
            style="color:#1a1a1a;font-weight:600;">${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/contractor/login</a>
       </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>業者登録審査結果</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','Meiryo',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#1a1a1a;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">ServiceHub</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#1a1a1a;">${data.ownerName} 様</p>
          <p style="margin:0 0 20px;font-size:13px;color:#666;">（${data.companyName}）</p>
          <div style="margin-bottom:20px;">${resultBadge}</div>
          <p style="margin:0 0 20px;font-size:14px;color:#444;line-height:1.8;">${bodyText}</p>
          ${loginSection}
          <p style="margin:0;font-size:12px;color:#999;">
            ※このメールは自動送信されています。返信はできません。
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
