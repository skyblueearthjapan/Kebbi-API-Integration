/**
 * ロボット受付API - メインエントリポイント
 *
 * スクリプトプロパティに以下を設定:
 * - RESERVATION_SPREADSHEET_ID: 会議室予約スプレッドシートのID
 * - STAFF_SPREADSHEET_ID: スタッフ管理スプレッドシートのID
 * - SOUMU_EXTENSION: 総務代表内線番号（例: 1000）
 */

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || '';

    if (action === 'getTodayReservations') {
      return textOutput(getTodayReservations());
    }
    if (action === 'getStaffInfo') {
      var staffName = (e.parameter.staffName || '').trim();
      if (!staffName) {
        return textOutput('スタッフ名が指定されていません。総務、内線' + CONFIG.SOUMU_EXTENSION + '番にお問い合わせください。');
      }
      return textOutput(getStaffInfo(staffName));
    }
    if (action === 'getStaffList') {
      return textOutput(getStaffList());
    }

    return textOutput('不明なアクションです');
  } catch (err) {
    Logger.log('doGet error: ' + err);
    return textOutput('システムエラーが発生しました。恐れ入りますが、総務にお問い合わせください。');
  }
}

function textOutput(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}
