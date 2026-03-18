/**
 * 設定値
 */
var CONFIG = {
  RESERVATION_SS_ID: PropertiesService.getScriptProperties().getProperty('RESERVATION_SPREADSHEET_ID') || '',
  STAFF_SS_ID: PropertiesService.getScriptProperties().getProperty('STAFF_SPREADSHEET_ID') || '',
  SOUMU_EXTENSION: PropertiesService.getScriptProperties().getProperty('SOUMU_EXTENSION') || '1000',
  TZ: 'Asia/Tokyo',

  // 会議室予約スプレッドシートのシート名・ヘッダー構成
  RESERVATION_SHEET: '予約受付リスト',
  RESERVATION_HEADER_ROW: 2,
  RESERVATION_DATA_START_ROW: 3,

  // スタッフ管理スプレッドシートのシート名
  STAFF_SHEET: '外出ホワイトボード',
  STAFF_DATA_RANGE: 'A4:H19',

  // スタッフシートのカラムインデックス（0始まり、部署列追加後）
  STAFF_COL: {
    NAME: 0,        // A列: 人員
    DEPARTMENT: 1,  // B列: 部署
    LOCATION: 2,    // C列: 所在地
    EXTENSION: 3,   // D列: 内線
    DESTINATION: 4, // E列: 行先
    START_TIME: 5,  // F列: 出社日
    END_TIME: 6,    // G列: 帰社時刻
    NOTE: 7         // H列: 備考
  },

  // 会議室の場所案内（実際の場所に合わせて要修正）
  ROOM_LOCATION: {
    '第一会議室': '2階の突き当たり右側',
    '応接間1': '1階ロビー奥',
    '応接間2': '1階ロビー奥'
  }
};
