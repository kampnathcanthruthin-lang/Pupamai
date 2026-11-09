const { sheet, auth } = require('./_lib');

module.exports = async (req, res) => {
  if (!auth(req, res)) return;

  try {
    if (req.method === 'GET') {
      return res.json(await sheet('students'));
    }

    if (req.method === 'POST') {
      const list = ((req.body && req.body.students) || [])
        .filter((s) => s && String(s.name || '').trim())
        .map((s) => ({ number: s.number || null, name: String(s.name).trim() }));
      if (!list.length) return res.status(400).json({ error: 'ไม่มีรายชื่อที่จะเพิ่ม' });
      return res.json(await sheet('addStudents', { students: list }));
    }

    if (req.method === 'DELETE') {
      if (!req.query.id) return res.status(400).json({ error: 'ไม่พบรหัสนักเรียน' });
      return res.json(await sheet('deleteStudent', { id: req.query.id }));
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message || 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};
