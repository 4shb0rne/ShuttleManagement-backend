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
      await ds.create({
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

router.get("/get", async (req, res) => {
  try {
    const dosens = await ds.findAll();
    res.status(200).json(dosens);
  } catch (error) {
    res.status(500).send({"error" : error});
  }
});


router.get("/check", async (req, res) => {
  const { kodeDosen, email } = req.query;
  try{  
    const dosen = await ds.findOne({
      where: { kodeDosen : kodeDosen, email: email }
    });
    
    if(dosen) {
      res.status(200).json(dosen);
    } else {  
      res.status(200).json({
        message: "Invalid Data"
      });
    }
  } catch (error) {
    res.status(500).send({"error" : error});
  }
});

module.exports = router;
