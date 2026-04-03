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
// ※ admin.html を使う場合、GAS_URL は同じURLを使います
// ※ コード変更後は「新しいデプロイ」で再デプロイが必要です
//
// ============================================

// ========== データ読み取り（admin.html用） ==========
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      row['_row'] = i + 1;
      rows.push(row);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', data: rows }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========== データ書き込み ==========
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // フィードバック送信済みの更新
    if (data.action === 'update_feedback_sent') {
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var colIndex = headers.indexOf('フィードバック送信済み') + 1;
      if (colIndex === 0) {
        colIndex = sheet.getLastColumn() + 1;
        sheet.getRange(1, colIndex).setValue('フィードバック送信済み');
      }
      sheet.getRange(data.row, colIndex).setValue(data.value ? 'TRUE' : 'FALSE');
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 講師フィードバックの保存
    if (data.action === 'save_instructor_feedback') {
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var colIndex = headers.indexOf('講師フィードバック') + 1;
      if (colIndex === 0) {
        colIndex = sheet.getLastColumn() + 1;
        sheet.getRange(1, colIndex).setValue('講師フィードバック');
      }
      sheet.getRange(data.row, colIndex).setValue(data.text || '');
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

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
        'フィードバック送信済み',
        '講師フィードバック'
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
      'FALSE',
      ''
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
