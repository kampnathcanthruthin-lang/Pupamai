const { sheet, auth } = require('./_lib');

const VALID = ['present', 'late', 'absent', 'leave'];

module.exports = async (req, res) => {
  if (!auth(req, res)) return;

  try {
    if (req.method === 'GET') {
      // สรุปจำนวนมา/สาย/ขาด/ลา สะสมของนักเรียนแต่ละคน
      if (req.query.summary) return res.json(await sheet('summary'));

      // ข้อมูลเช็คชื่อของวันที่ระบุ
      if (!req.query.date) return res.status(400).json({ error: 'ระบุวันที่' });
      return res.json(await sheet('getDate', { date: req.query.date }));
    }

    if (req.method === 'POST') {
      const { date, records } = req.body || {};
      if (!date || !Array.isArray(records) || !records.length) {
        return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
      }
      const clean = records.filter((r) => r && r.student_id && VALID.includes(r.status));
      return res.json(await sheet('saveDate', { date, records: clean }));
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message || 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};
