/**
 * 指定スタッフの情報を取得し、ロボット読み上げ用テキストを返す
 * @param {string} staffName - スタッフ名（"総務"の場合は総務担当者を検索）
 */
function getStaffInfo(staffName) {
  var rows = readStaffData_();
  if (rows === null) return 'システム設定エラー：スタッフスプレッドシートが設定されていません。';

  var C = CONFIG.STAFF_COL;
  var soumuExt = CONFIG.SOUMU_EXTENSION;

  // 「総務」の場合の特殊処理
  if (staffName === '総務') {
    return getSoumuStaffInfo_(rows);
  }

  // スタッフ名で完全一致検索
  var found = null;
  for (var i = 0; i < rows.length; i++) {
    var name = String(rows[i][C.NAME] || '').trim();
    if (name === staffName) {
      found = rows[i];
      break;
    }
  }

  if (!found) {
    return '申し訳ございません。該当するスタッフが見つかりませんでした。総務、内線' + soumuExt + '番にお問い合わせください。';
  }

  var location = String(found[C.LOCATION] || '').trim();
  var extension = String(found[C.EXTENSION] || '').trim();
  var destination = String(found[C.DESTINATION] || '').trim();
  var endTime = String(found[C.END_TIME] || '').trim();

  return buildStaffInfoText_(staffName, location, extension, destination, endTime);
}

/**
 * 所在地に応じたスタッフ案内テキストを生成
 */
function buildStaffInfoText_(name, location, extension, destination, endTime) {
  var soumuExt = CONFIG.SOUMU_EXTENSION;

  if (location === '本社工場' || location === '新工場') {
    var text = name + 'さんは現在、' + location + 'におります。';
    if (extension) {
      text += '内線番号は' + extension + '番です。受付横の内線電話からおかけください。';
    }
    return text;
  }

  if (location === '外出') {
    var text = name + 'さんは現在外出中です。';
    if (endTime) {
      text += formatTimeForSpeech(endTime) + '頃にお戻りの予定です。';
    }
    text += '恐れ入りますが、総務、内線' + soumuExt + '番にご連絡ください。';
    return text;
  }

  if (location === '休み') {
    return name + 'さんは本日お休みです。恐れ入りますが、総務、内線' + soumuExt + '番に代わりの担当者をお尋ねください。';
  }

  // 所在地未設定
  if (extension) {
    return name + 'さんの内線番号は' + extension + '番です。受付横の内線電話からおかけください。';
  }

  return name + 'さんの所在が確認できませんでした。恐れ入りますが、総務、内線' + soumuExt + '番にお問い合わせください。';
}

/**
 * 総務担当者の情報を取得
 */
function getSoumuStaffInfo_(rows) {
  var C = CONFIG.STAFF_COL;
  var soumuExt = CONFIG.SOUMU_EXTENSION;

  // 部署 == "総務" or "総務部" のスタッフを抽出
  var soumuStaff = [];
  for (var i = 0; i < rows.length; i++) {
    var dept = String(rows[i][C.DEPARTMENT] || '').trim();
    if (dept === '総務' || dept === '総務部') {
      soumuStaff.push(rows[i]);
    }
  }

  // 在席者を優先（本社工場 or 新工場）
  var available = [];
  for (var j = 0; j < soumuStaff.length; j++) {
    var loc = String(soumuStaff[j][C.LOCATION] || '').trim();
    if (loc === '本社工場' || loc === '新工場') {
      available.push(soumuStaff[j]);
    }
  }

  if (available.length > 0) {
    var staff = available[0];
    var name = String(staff[C.NAME] || '').trim();
    var location = String(staff[C.LOCATION] || '').trim();
    var extension = String(staff[C.EXTENSION] || '').trim();

    var text = '総務の' + name + 'さんは現在、' + location + 'におります。';
    if (extension) {
      text += '内線番号は' + extension + '番です。受付横の内線電話からおかけください。';
    }
    return text;
  }

  // 総務スタッフがいないか全員不在
  if (soumuStaff.length === 0) {
    return '恐れ入りますが、内線' + soumuExt + '番にお問い合わせください。';
  }

  return '申し訳ございません。総務担当者は現在不在です。恐れ入りますが、内線' + soumuExt + '番にメッセージを残していただくか、しばらくお待ちください。';
}

/**
 * スタッフ一覧をカンマ区切りで返す
 */
function getStaffList() {
  var rows = readStaffData_();
  if (rows === null) return '';

  var C = CONFIG.STAFF_COL;
  var names = [];

  for (var i = 0; i < rows.length; i++) {
    var name = String(rows[i][C.NAME] || '').trim();
    if (name) {
      names.push(name);
    }
  }

  return names.join(',');
}

/**
 * スタッフ管理スプレッドシートからデータ行を読み取る
 */
function readStaffData_() {
  var ssId = CONFIG.STAFF_SS_ID;
  if (!ssId) return null;

  var ss = SpreadsheetApp.openById(ssId);
  var sheet = ss.getSheetByName(CONFIG.STAFF_SHEET);
  if (!sheet) return null;

  var range = sheet.getRange(CONFIG.STAFF_DATA_RANGE);
  return range.getDisplayValues();
}
