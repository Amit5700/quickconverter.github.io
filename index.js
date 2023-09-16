const express=require('express');
const path=require('path');
const bodyParser = require('body-parser');
const con=require('./DB_Conn.js');
const app=express();
app.use(bodyParser.urlencoded({ extended: true })); 
const publicpath=path.join(__dirname,'WebPages')

app.use(express.static(publicpath));

app.get('/Home',(req,res)=>{
    res.sendFile(`${publicpath}/home.html`)
    
})

app.get('/Login',(req,res)=>{
    
    res.sendFile(`${publicpath}/index.html`)
})

app.get('/Registration',(req,res)=>{
  
    res.sendFile(`${publicpath}/account.html`)
    
})

app.get('/pdftoword',(req,res)=>{
  
    res.sendFile(`${publicpath}/pdftoword.html`)
    
})

app.get('/wordtopdf',(req,res)=>{
  
    res.sendFile(`${publicpath}/wordtopdf.html`)
    
})
app.post('/RegistrationValidation',(req,res)=>{
    const fname=req.body.fname;
    const mail=req.body.mail;
    const p=req.body.p;  
    //const cp=req.body.cp;  
    const sql="insert into users (Name,Email,Password) VALUES('"+fname+"','"+mail+"','"+p+"')";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result.length);
    res.sendFile(`${publicpath}/home.html`)
    console.log(fname,mail,p)
})
});

app.post('/LoginValidation', (req, res) => {
    const mail=req.body.mail;
    const pass=req.body.pass;
     const sql=`SELECT * FROM users where email=${con.escape(mail)} and password=${con.escape(pass)}`;
     con.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result.length);
           if(result.length>0)
           {
            res.sendFile(`${publicpath}/home.html`)
           }
           else{
            res.sendFile(`${publicpath}/index.html`)
           }
            
     }); 
  });

app.get('*',(req,res)=>{
    res.sendFile(`${publicpath}/error.html`)    
})

app.post("/wordtopdfconvo", (req, res) => {
    // Execute your Node.js script here
    const fs = require('fs');
    const mammoth = require('mammoth');
    const PDFDocument = require('pdfkit');
    const striptags = require('striptags'); // You'll need to install the 'striptags' package

    // Input Word document path
    const inputPath = 'WordInput.docx';

    // Output PDF path
    const outputPath = 'PDFOutput.pdf';

    // Read the Word document
    fs.readFile(inputPath, 'binary', (err, docxData) => {
    if (err) {
        console.error(err);
    return;
  }

    // Convert Word document to HTML
    mammoth.convertToHtml({ buffer: Buffer.from(docxData, 'binary') })
    .then((result) => {
      const html = result.value;

      // Strip HTML tags to keep plain text
      const plainText = striptags(html);

      // Create a PDF document
      const pdfDoc = new PDFDocument();
      const pdfStream = fs.createWriteStream(outputPath);

      // Pipe plain text to the PDF document
      pdfDoc.pipe(pdfStream);
      pdfDoc.text(plainText);

      // End the PDF document
      pdfDoc.end();

      console.log('PDF conversion complete. Output saved to ' + outputPath);
    })
    .catch((error) => {
      console.error(error);
    });
    
});


  
});

app.listen(3000);