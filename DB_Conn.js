var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "qc"
});

con.connect(function(err){
  if(err) throw err;
  console.log("CONNECTED!")
})
module.exports=con;