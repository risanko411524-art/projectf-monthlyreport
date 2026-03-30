// ============================================
// Google Apps Script（GAS）セットアップ手順
// ============================================
//
// 【手順】
// 1. Google Spreadsheet を新規作成
// 2. メニュー「拡張機能」→「Apps Script」を開く
// 3. 以下のコードを貼り付けて保存
// 4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」を選択
//    - 次のユーザーとして実行: 「自分」
//    - アクセスできるユーザー: 「全員」
// 5. デプロイして表示されるURLをコピー
// 6. index.html の GAS_URL にそのURLを貼り付け
//    例: const GAS_URL = 'https://script.google.com/macros/s/XXXXX/exec';
//
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // ヘッダーが無ければ作成
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '提出日時', '名前', '対象月',
        'フィード投稿数', 'リール投稿数',
        'フォロワー(月初)', 'フォロワー(月末)', 'フォロワー増減',
        'その他メディア',
        '売上金額', 'オファー数', '売上詳細',
        'Q1_うまくいった点', 'Q2_なぜうまくいったか', 'Q3_続けること',
        'Q4_うまくいかなかった点', 'Q5_なぜうまくいかなかったか', 'Q6_やめること',
        'Q7_来月やること',
        'Slack用まとめテキスト'
      ]);
    }

    // データを1行追加
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || '',
      data.month || '',
      data.insta_feed || '0',
      data.insta_reel || '0',
      data.insta_followers_start || '0',
      data.insta_followers_end || '0',
      data.insta_followers_diff || '0',
      data.other_media || '',
      data.sales_amount || '0',
      data.offers_count || '0',
      data.sales_detail || '',
      data.fb_q1 || '',
      data.fb_q2 || '',
      data.fb_q3 || '',
      data.fb_q4 || '',
      data.fb_q5 || '',
      data.fb_q6 || '',
      data.fb_q7 || '',
      data.slackText || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
