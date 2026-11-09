// เรียก Google Apps Script (ที่ผูกกับกูเกิลชีต) เพื่ออ่าน/เขียนข้อมูล
async function sheet(action, payload = {}) {
  const r = await fetch(process.env.SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ secret: process.env.SHEETS_SECRET, action, ...payload }),
    redirect: 'follow',
  });
  const text = await r.text();
  let d;
  try {
    d = JSON.parse(text);
  } catch (e) {
    throw new Error('เชื่อมต่อ Google Sheets ไม่สำเร็จ (ตรวจ SHEETS_URL และการ Deploy ของ Apps Script)');
  }
  if (d.error) throw new Error(d.error === 'unauthorized' ? 'SHEETS_SECRET ไม่ตรงกับใน Apps Script' : d.error);
  return d.data;
}

// ตรวจรหัสครู (ตั้งค่า ADMIN_PIN ใน Vercel)
function auth(req, res) {
  if (!process.env.ADMIN_PIN || req.headers['x-admin-pin'] !== process.env.ADMIN_PIN) {
    res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
    return false;
  }
  return true;
}

module.exports = { sheet, auth };
