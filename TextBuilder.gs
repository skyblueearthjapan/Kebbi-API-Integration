/**
 * 時間を読み上げ形式に変換
 * "09:00" → "9時"
 * "09:30" → "9時30分"
 * "13:00" → "13時"
 */
function formatTimeForSpeech(timeStr) {
  if (!timeStr) return '';

  var str = String(timeStr).trim();
  var parts = str.split(':');
  if (parts.length !== 2) return str;

  var h = parseInt(parts[0], 10);
  var m = parseInt(parts[1], 10);

  if (isNaN(h)) return str;

  if (isNaN(m) || m === 0) {
    return h + '時';
  }
  return h + '時' + m + '分';
}
