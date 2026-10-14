/**
 * 하노이·사파 여행 정산 백엔드 (Google Apps Script)
 * - 지출 기록: 내 드라이브에 '하노이사파 정산' 스프레드시트 자동 생성
 * - 영수증: 내 드라이브 '하노이사파 영수증' 폴더에 저장 (링크 있는 사람 보기)
 * 배포: 배포 > 새 배포 > 유형 '웹 앱' > 실행: 나 / 액세스: 모든 사용자
 */
const H = ['id','ts','date','payer','title','cat','amount','cur','krw','split','memo','receipt','receiptView','by'];
const PROP = PropertiesService.getScriptProperties();

function sheet_() {
  let ss = null;
  const id = PROP.getProperty('SSID');
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) {} }
  if (!ss) { ss = SpreadsheetApp.create('하노이사파 정산'); PROP.setProperty('SSID', ss.getId()); }
  let sh = ss.getSheetByName('expenses');
  if (!sh) { sh = ss.getSheets()[0]; sh.setName('expenses'); sh.clear(); sh.appendRow(H); sh.setFrozenRows(1); }
  return sh;
}

function folder_() {
  const id = PROP.getProperty('FID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder('하노이사파 영수증');
  PROP.setProperty('FID', f.getId());
  return f;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function list_() {
  const v = sheet_().getDataRange().getValues();
  const h = v.shift();
  return v.filter(r => r[0] !== '').map(r => {
    const o = {};
    h.forEach((k, i) => { o[k] = r[i] instanceof Date ? Utilities.formatDate(r[i], 'Asia/Seoul', 'yyyy-MM-dd') : r[i]; });
    return o;
  });
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'del' && p.id) {
    const lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      const sh = sheet_(); const v = sh.getDataRange().getValues();
      for (let i = v.length - 1; i >= 1; i--) if (String(v[i][0]) === String(p.id)) sh.deleteRow(i + 1);
    } finally { lock.releaseLock(); }
  }
  return out_({ ok: true, items: list_() });
}

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents);
    const sh = sheet_();
    if (b.action === 'add' || b.action === 'edit') {
      const it = b.item || {};
      let rUrl = it.receipt || '', rView = it.receiptView || '';
      if (b.receipt && b.receipt.data) {
        const blob = Utilities.newBlob(Utilities.base64Decode(b.receipt.data), b.receipt.type || 'image/jpeg', b.receipt.name || ('receipt_' + it.id + '.jpg'));
        const f = folder_().createFile(blob);
        try { f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (err) {}
        rUrl = 'https://drive.google.com/thumbnail?id=' + f.getId() + '&sz=w1200';
        rView = 'https://drive.google.com/file/d/' + f.getId() + '/view';
      }
      const row = H.map(k => k === 'receipt' ? rUrl : k === 'receiptView' ? rView : k === 'ts' ? (it.ts || new Date().toISOString()) : (it[k] === undefined || it[k] === null ? '' : it[k]));
      if (b.action === 'edit') {
        const v = sh.getDataRange().getValues();
        for (let i = 1; i < v.length; i++) if (String(v[i][0]) === String(it.id)) { sh.getRange(i + 1, 1, 1, H.length).setValues([row]); return out_({ ok: true, items: list_() }); }
      }
      sh.getRange(sh.getLastRow() + 1, 1, 1, H.length).setNumberFormat('@').setValues([row.map(String)]);
    }
    return out_({ ok: true, items: list_() });
  } finally { lock.releaseLock(); }
}

/** 처음 한 번 실행해서 권한 허용 (편집기에서 ▶ 실행) */
function setup() { sheet_(); folder_(); }
