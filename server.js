var express = require("express");
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req,res,next){
	res.append("Access-Control-Allow-Origin",['*']);
	res.append("Access-Control-Allow-Methods",
	"GET, POST, PUT, PATCH, DELETE");
	res.append("Access-Control-Allow-Headers",'Content-Type');
	next();
});


var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'mojasema'
});

con.connect(function(err){
	if(err) throw err;
	console.log("Konektovan");
});
app.post("/auth/login", function(req, res){
	var params = req.body;
	var username = params.username;
	var password = params.password;
	
	con.query("SELECT * FROM korisnici WHERE kor_username = ? AND kor_password = ?", [username, password], function(err, result, fields){
		if(err) throw err;
		if(result.length == 0){
			res.json({'Result': "ERR", 'Message': "Invalid credentials"});
			return;
		}
		
		res.json({'Result':"OK", 'data': result[0]});
		
	})
});
app.post("/registration",function(req, res){
	var params = req.body;
	var reg_username = params.reg_username;
	var reg_password = params.reg_password;
	var reg_name = params.reg_name;
	var reg_lastname = params.reg_lastname;
	var sql = "INSERT INTO korisnici (kor_username, kor_password, kor_name, kor_lastname) VALUES ('" + reg_username + "', '" + reg_password + "','" + reg_name + "','" + reg_lastname +"' );"
	
	con.query(sql, function(err, result, fields){
		if(err) throw err;
		console.log("1 record inserted");
		var odg = {
			data: result
		}
		res.json("registration complete");
	});
});

app.post("/najam", function(req,res){
	var params = req.body;
	var date_preuzimanje = params.date_preuzimanje;
	var date_povratak = params.date_povratak;
	console.log(date_preuzimanje, date_povratak);

	//var sql = "SELECT * FROM rezervacije LEFT JOIN (SELECT rez_id FROM rezervacije WHERE rez_od >= '" + date_preuzimanje + "' AND rez_do < '" + date_povratak + "' AND rez_status = 1 GROUP BY rez_id HAVING COUNT(*) = DATEDIFF('" + date_preuzimanje + "', '" + date_povratak + "')) Available ON rezervacije.aut_id"
	//var sql = "SELECT * FROM rezervacije WHERE '" + date_preuzimanje + "' > rez_do AND rez_status = 1" 

	con.query(sql, function(err, result, fileds){
		if(err) throw err;
		//console.log("Pretraga automobila");
		var odg = {
			data: result
		}
		res.json({'Result':"OK", 'data': result});
	});
});

app.get("/",function(req, res){
	res.send("HELLO BROWSER, IM NODE");
});

app.listen(port, function(){
	console.log("Aplikacija radi na portu: "+port);
});