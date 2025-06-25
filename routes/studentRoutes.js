const express = require('express');
const router = express.Router();
const Student = require('./models/Student');

// CREATE
router.post('/', async (req, res) => {
  try {
    const existing = await Student.findOne({ email: req.body.email });
    if (existing) return res.status(409).json({ error: 'Email already exists' });

    const student = new Student(req.body);
    const saved = await student.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, lastName } = req.query;

  // Create a filter object if lastName is given
  const filter = lastName ? { lastName: new RegExp(lastName, 'i') } : {};

  try {
    const students = await Student.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// COUNT
router.get('/count', async (req, res) => {
  const count = await Student.countDocuments();
  res.json({ count });
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json({ message: 'Student deleted', id: student._id });
});

module.exports = router;
