"use client";

type InvoiceItem = {
  description: string;
  quantity:    number;
  unit_price:  number;
  amount:      number;  // tax-exclusive
  tax_rate:    number;
};

type InvoiceData = {
  id:            string;
  issue_date:    string;
  due_date:      string | null;
  total_amount:  number;
  customer_name: string;
  items:         InvoiceItem[];
};

function fmt(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

function taxAmt(excl: number, rate: number): number {
  return Math.floor(excl * rate / 100);
}

export function PdfExportButton({ invoice }: { invoice: InvoiceData }) {
  function handlePrint() {
    const invoiceNo = `#${invoice.id.slice(0, 8).toUpperCase()}`;
    const issueDate = new Date(invoice.issue_date).toLocaleDateString("ja-JP");
    const dueDate   = invoice.due_date
      ? new Date(invoice.due_date).toLocaleDateString("ja-JP")
      : "—";

    const subtotal  = invoice.items.reduce((s, i) => s + i.amount, 0);
    const totalTax  = invoice.items.reduce((s, i) => s + taxAmt(i.amount, i.tax_rate), 0);
    const totalIncl = subtotal + totalTax;

    const itemRows = invoice.items.length > 0
      ? invoice.items.map((item) => {
          const excl = item.amount;
          const tax  = taxAmt(excl, item.tax_rate);
          const incl = excl + tax;
          return `
            <tr>
              <td>${item.description}</td>
              <td class="num">${item.quantity}</td>
              <td class="num">${fmt(item.unit_price)}</td>
              <td class="num">${item.tax_rate}%</td>
              <td class="num">${fmt(excl)}</td>
              <td class="num">${fmt(tax)}</td>
              <td class="num">${fmt(incl)}</td>
            </tr>`;
        }).join("")
      : `<tr><td colspan="7" style="text-align:center;color:#999;padding:20px">明細なし</td></tr>`;

    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>請求書 ${invoiceNo}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", "MS PGothic", sans-serif;
    font-size: 12px;
    color: #1a1a1a;
    background: #fff;
  }
  .page { width: 210mm; min-height: 297mm; padding: 20mm 20mm 15mm; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
  h1 { font-size: 26px; font-weight: 700; letter-spacing: 0.05em; }
  .issuer { text-align: right; }
  .issuer .company { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .issuer .no { font-size: 11px; color: #555; }
  .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 28px; padding: 16px; background: #f7f7f7; border-left: 4px solid #1a1a1a; }
  .meta-item dt { font-size: 10px; color: #777; margin-bottom: 3px; }
  .meta-item dd { font-size: 13px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  thead tr { background: #1a1a1a; color: #fff; }
  thead th { padding: 9px 10px; text-align: left; font-size: 11px; font-weight: 600; }
  thead th.num { text-align: right; }
  tbody tr { border-bottom: 1px solid #e8e8e8; }
  tbody tr:nth-child(even) { background: #fafafa; }
  tbody td { padding: 9px 10px; font-size: 12px; vertical-align: top; }
  tbody td.num { text-align: right; font-variant-numeric: tabular-nums; }
  .summary { display: flex; flex-direction: column; align-items: flex-end; gap: 7px; }
  .summary-row { display: flex; gap: 0; }
  .summary-row .lbl { width: 120px; text-align: right; color: #555; font-size: 12px; padding-right: 16px; }
  .summary-row .val { width: 130px; text-align: right; font-size: 12px; font-variant-numeric: tabular-nums; }
  .summary-total { margin-top: 8px; padding-top: 10px; border-top: 2px solid #1a1a1a; }
  .summary-total .lbl { font-size: 14px; font-weight: 700; color: #1a1a1a; }
  .summary-total .val { font-size: 14px; font-weight: 700; }
  .footer { margin-top: 48px; font-size: 10px; color: #aaa; text-align: center; border-top: 1px solid #e8e8e8; padding-top: 12px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { width: 100%; padding: 10mm 15mm 10mm; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <h1>請求書</h1>
    <div class="issuer">
      <div class="company">ServiceHub</div>
      <div class="no">請求書番号：${invoiceNo}</div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-item">
      <dt>請求先</dt>
      <dd>${invoice.customer_name || "—"}</dd>
    </div>
    <div class="meta-item">
      <dt>発行日</dt>
      <dd>${issueDate}</dd>
    </div>
    <div class="meta-item">
      <dt>支払期限</dt>
      <dd>${dueDate}</dd>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>品目・作業内容</th>
        <th class="num">数量</th>
        <th class="num">単価</th>
        <th class="num">税率</th>
        <th class="num">税抜金額</th>
        <th class="num">消費税</th>
        <th class="num">税込金額</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div class="summary">
    <div class="summary-row">
      <span class="lbl">小計</span>
      <span class="val">${fmt(subtotal)}</span>
    </div>
    <div class="summary-row">
      <span class="lbl">消費税額</span>
      <span class="val">${fmt(totalTax)}</span>
    </div>
    <div class="summary-row summary-total">
      <span class="lbl">合計（税込）</span>
      <span class="val">${fmt(totalIncl)}</span>
    </div>
  </div>

  <div class="footer">このたびはご利用いただきありがとうございます。上記の通りご請求申し上げます。</div>
</div>
<script>window.onload = function() { window.print(); };</script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) {
      alert("ポップアップがブロックされました。ブラウザの設定を確認してください。");
      return;
    }
    win.document.write(html);
    win.document.close();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      style={{
        display:         "inline-flex",
        alignItems:      "center",
        justifyContent:  "center",
        width:           "100%",
        height:          "40px",
        padding:         "0 16px",
        borderRadius:    "4px",
        fontSize:        "14px",
        fontWeight:      500,
        cursor:          "pointer",
        backgroundColor: "#f5f5f5",
        color:           "#1a1a1a",
        border:          "1px solid #e0e0e0",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ebebeb"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
    >
      PDF出力
    </button>
  );
}
