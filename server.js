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
app.post("/registration/admin",function(req, res){
	var params = req.body;
	var reg_username = params.admin_reg_username;
	var reg_password = params.admin_reg_password;
	var reg_name = params.admin_reg_name;
	var reg_lastname = params.admin_reg_lastname;
	var reg_lvl = params.admin_reg_lvl;
	var sql = "INSERT INTO korisnici (kor_username, kor_password, kor_name, kor_lastname, kor_lvl) VALUES ('" + reg_username + "', '" + reg_password + "','" + reg_name + "','" + reg_lastname +"','" + reg_lvl + "');"
	
	con.query(sql, function(err, result, fields){
		if(err) throw err;
		console.log("1 record inserted");
		var odg = {
			data: result
		}
		res.json("registration complete, lvl of user: " + reg_lvl);
	});
});
app.post("/registration",function(req, res){
	var params = req.body;
	var reg_username = params.reg_username;
	var reg_password = params.reg_password;
	var reg_name = params.reg_name;
	var reg_lastname = params.reg_lastname;
	var reg_lvl = params.reg_lvl;
	var sql = "INSERT INTO korisnici (kor_username, kor_password, kor_name, kor_lastname, kor_lvl) VALUES ('" + reg_username + "', '" + reg_password + "','" + reg_name + "','" + reg_lastname +"', '" + reg_lvl +"');"
	
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

	var sql = "SELECT automobili.aut_id, aut_model, aut_cena, aut_menjac, aut_brojVrata, aut_brojOsoba, aut_brojKofera, aut_klima, aut_vrstaGoriva, tipovi.tip_naziv, mar_naziv "+
	"FROM (automobili "+
		"INNER JOIN tipovi "+
			"ON automobili.aut_tip=tipovi.tip_id "+
		"INNER JOIN marke "+
			"ON automobili.aut_mar=marke.mar_id) "+
		"LEFT JOIN rezervacije ON rezervacije.aut_id = automobili.aut_id "+
			"WHERE rezervacije.aut_id IS NULL "+
		  	"OR rezervacije.rez_do < '"+ date_preuzimanje +"' "+
		"ORDER BY automobili.aut_id"
	con.query(sql, function(err, result, fileds){
		if(err) throw err;
		var odg = {
			data: result
		}
		res.json({'Result':"OK", 'data': result});
	});
});

app.post("/rezervisi", function(req,res){
	var params = req.body;
	var date_preuzimanje = params.date_preuzimanje;
	var date_povratak = params.date_povratak;
	var auto_id = params.auto_id;
	var korisnik_id = params.korisnik_id;

	var sql = "INSERT INTO rezervacije (aut_id, kor_id, rez_status, rez_od, rez_do) VALUES ('"+ auto_id + "','" + korisnik_id + "', '2', '" + date_preuzimanje +"', '" + date_povratak +"')";
	con.query(sql, function(err, result, fields){
		if(err) throw err;
		var odg = {
			data: result
		}
		res.json({'Result': 'OK', 'data': result});
	});
});

app.post("/proverirezervaciju", function(req,res){
	var params = req.body;
	date_preuzimanje = params.date_preuzimanje;
	date_povratak = params.date_povratak;
	auto_id = params.auto_id;

	var sql = "SELECT * FROM automobili "+
	"INNER JOIN rezervacije ON automobili.aut_id = rezervacije.aut_id "+
	"WHERE '"+ date_preuzimanje +"' <= rezervacije.rez_do"
	
	con.query(sql, function(err, result, fields){
		if(err) throw err;
		var odg = {
			data: result
		}
		res.json({"Result": "Ok,", "data": result});
	});
});

app.post("/izbrisiauto", function(req, res){
	var params = req.body;
	var auto_id = params.auto_id;

	var sql = "DELETE FROM automobili WHERE aut_id = '"+ auto_id +"'";
	con.query(sql, function(err, result, fields){
		if(err) throw err;
		var odg = {
			data: result
		}
		res.json({"Result": "Ok,", "data": result});
	});
});

app.post("/izmeniauto", function(req,res){
	var params = req.body;
	var marka_auta = params.marka_auta;
	var model_auta = params.model_auta;
	var tip_auta = params.tip_auta;
	var cena_auta = params.cena_auta;
	var broj_vrata = params.broj_vrata;
	var broj_osoba = params.broj_osoba;
	var broj_kofera = params.broj_kofera;
	var menjac = params.menjac;
	var klima = params.klima;
	var gorivo = params.gorivo;
	var auto_id = params.auto_id;

	var sql = "UPDATE automobili SET aut_model = '"+ model_auta +"', aut_cena = '"+ cena_auta +"', aut_menjac = '"+ menjac +"', aut_brojVrata =  '"+ broj_vrata +"', aut_brojOsoba = '"+ broj_osoba +"', aut_brojKofera = '"+ broj_kofera +"', aut_klima = '"+ klima +"', aut_vrstaGoriva = '"+ gorivo +"', aut_mar = '"+ marka_auta +"', aut_tip = '"+ tip_auta +"' WHERE aut_id = '"+ auto_id +"'";
	con.query(sql, function(err, result, fields){
		if(err) throw err;
		var odg = {
			data: result
		}
		res.json({"Result": "Ok,", "data": result});
	});
});

app.post("/dodajauto", function(req,res){
	var params = req.body;
	var marka_auta = params.marka_auta;
	var model_auta = params.model_auta;
	var tip_auta = params.tip_auta;
	var cena_auta = params.cena_auta;
	var broj_vrata = params.broj_vrata;
	var broj_osoba = params.broj_osoba;
	var broj_kofera = params.broj_kofera;
	var menjac = params.menjac;
	var klima = params.klima;
	var gorivo = params.gorivo;

	var sql = "INSERT INTO automobili (aut_model, aut_cena, aut_menjac, aut_brojVrata, aut_brojOsoba, aut_brojKofera, aut_klima, aut_vrstaGoriva, aut_tip, aut_mar) VALUES ('" + model_auta + "', ' "+ cena_auta + "', '" + menjac +"', '" + broj_vrata +"', '"+ broj_osoba +"', '"+ broj_kofera +"', '"+ klima +"', '"+ gorivo +"', '"+ tip_auta +"', '"+ marka_auta +"')";
	con.query(sql, function(err, result, fields){
		if(err) throw err;
		var dog = {
			data: result
		}
		res.json({"Result": "OK", "data": result});
	});
});

app.get("/cars", function(req,res){
	var params = req.body;
	
	var sql = "SELECT automobili.aut_id, automobili.aut_model, automobili.aut_cena, automobili.aut_menjac, automobili.aut_brojVrata, automobili.aut_brojOsoba, automobili.aut_brojKofera, automobili.aut_klima, automobili.aut_vrstaGoriva, tipovi.tip_naziv, marke.mar_naziv FROM automobili INNER JOIN tipovi  ON automobili.aut_tip=tipovi.tip_id INNER JOIN marke ON automobili.aut_mar=marke.mar_id ORDER BY aut_id";
	con.query(sql, function(err, result, fields){
		if(err) throw err;
		var odg = {
			data: result
		}
		res.json({"Result": "OK", "data": result});
	});
});

app.listen(port, function(){
	console.log("Aplikacija radi na portu: "+port);
});
