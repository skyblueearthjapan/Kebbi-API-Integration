/**
 * 本日の会議室予約を取得し、ロボット読み上げ用テキストを返す
 */
function getTodayReservations() {
  var ssId = CONFIG.RESERVATION_SS_ID;
  if (!ssId) return 'システム設定エラー：予約スプレッドシートが設定されていません。';

  var ss = SpreadsheetApp.openById(ssId);
  var sheet = ss.getSheetByName(CONFIG.RESERVATION_SHEET);
  if (!sheet) return 'システム設定エラー：予約シートが見つかりません。';

  var today = Utilities.formatDate(new Date(), CONFIG.TZ, 'yyyy-MM-dd');

  // ヘッダー行からカラムマップを作成
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    return '本日の会議室予約は見つかりませんでした。恐れ入りますが、総務にご確認ください。';
  }

  var headers = sheet.getRange(CONFIG.RESERVATION_HEADER_ROW, 1, 1, lastCol).getDisplayValues()[0];
  var colMap = {};
  headers.forEach(function(h, i) {
    var key = String(h || '').trim();
    if (key) colMap[key] = i;
  });

  // データ行を取得
  var lastRow = sheet.getLastRow();
  if (lastRow < CONFIG.RESERVATION_DATA_START_ROW) {
    return '本日の会議室予約は見つかりませんでした。恐れ入りますが、総務にご確認ください。';
  }

  var data = sheet.getRange(
    CONFIG.RESERVATION_DATA_START_ROW, 1,
    lastRow - CONFIG.RESERVATION_DATA_START_ROW + 1, lastCol
  ).getDisplayValues();

  // 今日のactive予約をフィルタ
  var todayReservations = [];
  data.forEach(function(row) {
    var date = String(row[colMap['日付']] || '').trim();
    var status = String(row[colMap['ステータス']] || '').trim();
    if (date === today && status === 'active') {
      todayReservations.push({
        startTime: String(row[colMap['開始時間']] || '').trim(),
        endTime: String(row[colMap['終了時間']] || '').trim(),
        room: String(row[colMap['会議室名']] || '').trim(),
        name: String(row[colMap['名前']] || '').trim(),
        customerName: String(row[colMap['お客様名']] || '').trim(),
        meetingDetail: String(row[colMap['打合せ内容']] || '').trim()
      });
    }
  });

  // 開始時間でソート
  todayReservations.sort(function(a, b) {
    return a.startTime.localeCompare(b.startTime);
  });

  return buildReservationText_(todayReservations);
}

/**
 * 予約配列からロボット読み上げテキストを生成
 */
function buildReservationText_(reservations) {
  if (reservations.length === 0) {
    return '本日の会議室予約は見つかりませんでした。恐れ入りますが、総務にご確認ください。';
  }

  if (reservations.length === 1) {
    var r = reservations[0];
    var text = '本日の会議室予約は、' + r.room + '、' +
      formatTimeForSpeech(r.startTime) + 'から' +
      formatTimeForSpeech(r.endTime) + '、' +
      r.name + '様';

    if (r.customerName) {
      text += 'と' + r.customerName + '様';
    }
    if (r.meetingDetail) {
      text += 'の' + r.meetingDetail;
    }
    text += 'です。';

    var location = CONFIG.ROOM_LOCATION[r.room];
    if (location) {
      text += r.room + 'は' + location + 'にございます。';
    }

    return text;
  }

  // 複数件
  var text = '本日の会議室予約は' + reservations.length + '件あります。';
  var parts = reservations.map(function(r) {
    return formatTimeForSpeech(r.startTime) + 'から' + r.room + 'で' + r.name + '様';
  });
  text += parts.join('、') + 'です。';

  return text;
}
