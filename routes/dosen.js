var express = require("express");
var router = express.Router();
var ds = require("../models").Dosen;
const multer = require('multer');
const xlsx = require('xlsx');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { raw: false });

    for (const data of jsonData) {
      await Dosen.create({
        kodeDosen: data['Lecturer ID'],
        email: data['Email'],
        namaDosen: data['Official Name']
      });
    }
    res.send('Data successfully added to the database');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error processing file');
  }
});


module.exports = router;
