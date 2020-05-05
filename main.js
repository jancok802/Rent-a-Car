$("#modal-btn").click(function(){
    $("#my-modal").css("display","block");
});
$("#register_admin").click(function(){
    $("#my-modal-admin").css("display","block");
});

$(".close").click(function(){
    $("#my-modal").css("display","none");
    $("#my-modal-admin").css("display","none");
});

function outsideClick(e) {
    if (e.target == $("#my-modal")) {
        $("#my-modal").css("display","none");
    }
}

var autoid;
var korid;
var korlvl;

function korLvl(kor_lvl){
    korlvl = kor_lvl;
}

function korId(kor_Id){
    korid = kor_Id;
}

function autId(auto_Id){
    autoid = auto_Id;
}

$("#signOut_btn").click(function(){
    $("#sign-out").css("display", "none");
    $("#prijava").css("margin-left","auto");
    $("#prijava").css("float","right");
    $("#prijava").css("display", "flex");
    $("#ispis").css("display","none");
    $(".rezervacija-auta").css("display", "none");
    $(".izbrisi-auto").css("display", "none");
    $(".izmeni-auto").css("display", "none");
    $("#register_admin").css("display","none");
});

$("#modal_reg_btn").click(function(){
    var reg_username = $("#reg_username").val();
    var reg_password = $("#reg_password").val();
    var reg_name = $("#reg_name").val();
    var reg_lastname = $("#reg_lastname").val();
    var reg_lvl = 0;

    if(reg_username == "" || reg_password == "" || reg_name == "" || reg_lastname == ""){
        alert("Failed registration");
        return;
    }
    
    $.ajax({
        url: "http://localhost:3000/registration",
        method: "POST",
        data: {
            reg_username: reg_username,
            reg_password: reg_password,
            reg_name: reg_name,
            reg_lastname: reg_lastname,
            reg_lvl: reg_lvl
        }
    }).done(function(response){
        if(response.Result == "ERR"){
            alert("Neuspesna registracija");
            return;
        }
        
        console.log("registracija uspesna");
        $("#my-modal").css("display","none");
        window.alert("Registration complete! Please sign in!");
    });
});

$("#admin_modal_reg_btn").click(function(){
    var admin_reg_username = $("#admin_reg_username").val();
    var admin_reg_password = $("#admin_reg_password").val();
    var admin_reg_name = $("#admin_reg_name").val();
    var admin_reg_lastname = $("#admin_reg_lastname").val();
    var admin_reg_lvl = 1;
	//console.log(admin_reg_username);
    if(admin_reg_username == "" || admin_reg_password == "" || admin_reg_name == "" || admin_reg_lastname == ""){
        alert("Failed registration");
        return;
    }
    $.ajax({
        url: "http://localhost:3000/registration/admin",
        method: "POST",
        data: {
            admin_reg_username: admin_reg_username,
            admin_reg_password: admin_reg_password,
            admin_reg_name: admin_reg_name,
            admin_reg_lastname: admin_reg_lastname,
            admin_reg_lvl: admin_reg_lvl
        }
    }).done(function(response){
        if(response.Result == "ERR"){
            alert("Neuspesna registracija");
            return;
        }

        console.log("Registracija admina uspesna")
        $("#my-modal-admin").css("display","none");
        window.alert("Admin Registration complete! Please sign in!");
    });
});

$("#final-rezervacija").click(function(){
    var date_preuzimanje = $("#pick-up-date-rezervacije").val();
    var date_povratak = $("#drop-off-date-rezervacije").val();
    var auto_id = autoid;
    var korisnik_id = korid;

    if(date_preuzimanje == "" || date_povratak == ""){
        console.log("Unesite datume!");
        return;
    }
    $.ajax({
        url: 'http://localhost:3000/proverirezervaciju',
        method: 'POST',
        data: {
            date_preuzimanje: date_preuzimanje,
            date_povratak: date_povratak,
            auto_id: auto_id
        }
    }).done(function(response){
        for(i=0;i<response.data.length;i++){
            if(response.data[i].aut_id == auto_id){
                alert("Auto je rezervisan za taj datum");
                return;
            }
        }
        $.ajax({
            url: 'http://localhost:3000/rezervisi',
            method: 'POST',
            data: {
                date_preuzimanje: date_preuzimanje,
                date_povratak: date_povratak,
                auto_id: auto_id,
                korisnik_id: korisnik_id
            }
        }).done(function(response){
            $("#my-modal-rezervacija").css("display", "none");
            alert("Reservation is sent");
            $("#"+auto_id+"").css("display","inline");
        });
    });

    
});

$("#login-btn").click(function(){
    var username = $("#username").val();
    var password = $("#password").val();

    if(username == "" || password == ""){
        console.log("Unesite username i password!");
        return;
    }

    $.ajax({
        url: 'http://localhost:3000/auth/login',
        method: 'POST',
        data: {
            username: username,
            password: password
        }
    }).done(function(response){
        if(response.Result == "ERR"){
           alert("Invalid credentials");
            return;
        }
        if(response.data.kor_lvl == 1){
            $(".rezervacija-auta").css("display", "block");
            $(".izbrisi-auto").css("display", "block");
            $(".izmeni-auto").css("display", "block");
            $("#register_admin").css("display","flex");
        }
        
        $("#sign-out").css("display","flex");
        $("#ispis").css("display","flex");
        $("#ispis").html("User: "+ response.data.kor_name);
        $("#prijava").css("display", "none");
        $("#signOut_btn").css("display", "flex");
        $(".rezervacija-auta").css("display", "block");
        korId(response.data.kor_id);
        korLvl(response.data.kor_lvl);
        
    });
});

$("#trazi_najam").click(function(){
    var date_preuzimanje = $("#date_preuzimanje").val();
    var date_povratak = $("#date_povratak").val();
    if(date_preuzimanje == "" || date_povratak == ""){
        alert("Pick dates!");
        return;
    }
    if(date_preuzimanje > date_povratak){
        alert("Wrong dates");
        return;
    }

    $.ajax({
        url: 'http://localhost:3000/najam',
        method: 'POST',
        data: {
            date_preuzimanje: date_preuzimanje,
            date_povratak: date_povratak
        }
    }).done(function(response){
        if(response.Result == "ERR"){
            console.log("neuspesna pretraga");
            return;
        }
        
        
        $("#search").hide();
        $("#pretragaVozila").hide();
        $("#newsletter").hide();
        $("#boxes").hide();
        $("#showcase").css("background-position", "-9999px -9999px");

        function osveziTrazinajam(){
            var container = $("<div class='flex-container'></div>");
            container.empty();
            $("#showcase").append(container);
            for(var i=0;i<response.data.length;i++){
                var auto = response.data[i];
                var car = $("<div class='car'></div>");
                container.append(car);
                var slikaAuta = $("<div class='car-img'></div>");
                var slikaText = $("<div id='"+ auto.aut_id +"' class='car-img-text'></div>");
                car.append(slikaAuta);
                slikaAuta.append(slikaText);
                slikaText.html("Reserved")
            
                if(auto.aut_model == 'Passat'){
                    var img = $("<img src='./img/passat.png'>");
                }
                else if(auto.aut_model == 'Navara'){
                    var img = $("<img src='./img/nissan.png'>");
                }
                else if(auto.aut_model == 'F-150'){
                    var img = $("<img src='./img/fordf150.png'>");
                }
                else if(auto.aut_model == 'RAV4'){
                    var img = $("<img src='./img/toyota.png'>");
                }
                else if(auto.aut_model == 'Elantra'){
                    var img = $("<img src='./img/hyundai.png'>");
                }
                else if(auto.aut_model == 'Mondeo'){
                    var img = $("<img src='./img/fordmondeo.png'>");
                }
                else if(auto.aut_model == 'Colt'){
                    var img = $("<img src='./img/mitsubishi.png'>");
                }
                else if(auto.aut_model == 'Logan'){
                    var img = $("<img src='./img/dacia.png'>");
                }
                else if(auto.aut_model == 'Grande'){
                    var img = $("<img src='./img/dodge.png'>");
                }
                else {
                    var img = $("<img src='./img/random.png'>");
                }

                slikaAuta.append(img);

                var markaAuta = $("<h2></h2>").text(auto.mar_naziv);
                var modelAuta = $("<h3></h3>").text(auto.aut_model);
                var tipAuta = $("<h4></h4>").text(auto.tip_naziv);
                var cenaAuta = $("<p></p>").text(auto.aut_cena);
                car.append(markaAuta, modelAuta, tipAuta, cenaAuta);

                var buttonDiv = $("<div id='car-buttons'></div>");
                car.append(buttonDiv);

                var red1 = $("<div class='button-row'></div>");
                car.append(red1);
                
                var kolona11 = $("<div class='button-column'></div>");
                var ikona11 = $("<i style='font-size:20px' class='fa'>&#xf085;</i>");
                var tekst11 = $("<p></p>").text(response.data[i].aut_menjac);

                var kolona21 = $("<div class='button-column'></div>");
                var ikona21 = $("<i style='font-size:24px' class='fas'>&#xf1b9;</i>");
                var tekst21 = $("<p></p>").text(response.data[i].aut_brojVrata);
                
                var kolona31 = $("<div class='button-column'></div>");
                var ikona31 = $("<i style='font-size:20px' class='fas'>&#xf007;</i>");
                var tekst31 = $("<p></p>").text(response.data[i].aut_brojOsoba);

                red1.append(kolona11, kolona21, kolona31);
                kolona11.append(ikona11, tekst11);
                kolona21.append(ikona21, tekst21);
                kolona31.append(ikona31, tekst31);
                /*
                ZAVRSEN PRVI RED
                */

                var red2 = $("<div class='button-row'></div>");
                car.append(red2);

                var kolona12 = $("<div class='button-column'></div>");
                var kolona22 = $("<div class='button-column'></div>");
                var kolona32 = $("<div class='button-column'></div>");
                red2.append(kolona12, kolona22, kolona32);

                var ikona12 = $("<i style='font-size:20px' class='fa'>&#xf0f2;</i>");
                var tekst12 = $("<p></p>").text(response.data[i].aut_brojKofera);

                var ikona22 = $("<i style='font-size:24px' class='fas'>&#xf2dc;</i>");
                var tekst22 = $("<p></p>").text(response.data[i].aut_klima);

                var ikona32 = $("<i style='font-size:20px' class='fas'>&#xf52f;</i>");
                var tekst32 = $("<p></p>").text(response.data[i].aut_vrstaGoriva);

                kolona12.append(ikona12, tekst12);
                kolona22.append(ikona22, tekst22);
                kolona32.append(ikona32, tekst32);

                /*
                ZAVRSEN DRUGI RED
                */

                buttonDiv.append(red1, red2);
                
                var dugmeRezervisi = $("<button type='submit' id='"+ auto.aut_id +"' class='rezervacija-auta'>Reserve</button>");
                buttonDiv.append(dugmeRezervisi);
                if(korid !== undefined){
                    dugmeRezervisi.css("display","block");
                }

                dugmeRezervisi.click(function(event){
                    $("#my-modal-rezervacija").css("display","block");
                    autId(event.target.id);
                });

                $("#close-rezervacija").click(function(){
                    $("#my-modal-rezervacija").css("display","none");
                });
            }
        }
        osveziTrazinajam();
    });
});

function getCars(){
    $("#showcase").empty();
    $.ajax({
        url: 'http://localhost:3000/cars',
        method: 'GET',
        data: {
            car : 'car'
        }
    }).done(function(response){
        if(response.Result == "ERR"){
            console.log("neuspesna pretraga");
            return;
        }
            console.log(response.data);
            $("#showcaseVozila").empty();
            var container = $("<div class='flex-container'></div>");
            $("#showcaseVozila").append(container);
            for(var i=0;i<response.data.length;i++){
                var auto = response.data[i];
                var car = $("<div class='car'></div>");
                container.append(car);
                var slikaAuta = $("<div class='car-img'></div>");
                car.append(slikaAuta);

                if(auto.aut_model == 'Passat'){
                    var img = $("<img src='./img/passat.png'>");
                }
                else if(auto.aut_model == 'Navara'){
                    var img = $("<img src='./img/nissan.png'>");
                }
                else if(auto.aut_model == 'F-150'){
                    var img = $("<img src='./img/fordf150.png'>");
                }
                else if(auto.aut_model == 'RAV4'){
                    var img = $("<img src='./img/toyota.png'>");
                }
                else if(auto.aut_model == 'Elantra'){
                    var img = $("<img src='./img/hyundai.png'>");
                }
                else if(auto.aut_model == 'Mondeo'){
                    var img = $("<img src='./img/fordmondeo.png'>");
                }
                else if(auto.aut_model == 'Colt'){
                    var img = $("<img src='./img/mitsubishi.png'>");
                }
                else if(auto.aut_model == 'Logan'){
                    var img = $("<img src='./img/dacia.png'>");
                }
                else if(auto.aut_model == 'Grande'){
                    var img = $("<img src='./img/dodge.png'>");
                }
                else {
                    var img = $("<img src='./img/random.png'>");
                }
                slikaAuta.append(img);

                var markaAuta = $("<h2></h2>").text(auto.mar_naziv);
                var modelAuta = $("<h3></h3>").text(auto.aut_model);
                var tipAuta = $("<h4></h4>").text(auto.tip_naziv);
                var cenaAuta = $("<p></p>").text(auto.aut_cena);
                car.append(markaAuta, modelAuta, tipAuta, cenaAuta);

                var buttonDiv = $("<div id='car-buttons'></div>");
                car.append(buttonDiv);

                var red1 = $("<div class='button-row'></div>");
                car.append(red1);
                
                var kolona11 = $("<div class='button-column'></div>");
                var ikona11 = $("<i style='font-size:24px' class='fa'>&#xf085;</i>");
                var tekst11 = $("<p></p>").text(auto.aut_menjac);

                var kolona21 = $("<div class='button-column'></div>");
                var ikona21 = $("<i style='font-size:24px' class='fas'>&#xf1b9;</i>");
                var tekst21 = $("<p></p>").text(auto.aut_brojVrata);
                
                var kolona31 = $("<div class='button-column'></div>");
                var ikona31 = $("<i style='font-size:24px' class='fas'>&#xf007;</i>");
                var tekst31 = $("<p></p>").text(auto.aut_brojOsoba);

                red1.append(kolona11, kolona21, kolona31);
                kolona11.append(ikona11, tekst11);
                kolona21.append(ikona21, tekst21);
                kolona31.append(ikona31, tekst31);
                /*
                ZAVRSEN PRVI RED
                */

                var red2 = $("<div class='button-row'></div>");
                car.append(red2);

                var kolona12 = $("<div class='button-column'></div>");
                var kolona22 = $("<div class='button-column'></div>");
                var kolona32 = $("<div class='button-column'></div>");
                red2.append(kolona12, kolona22, kolona32);

                var ikona12 = $("<i style='font-size:24px' class='fa'>&#xf0f2;</i>");
                var tekst12 = $("<p></p>").text(auto.aut_brojKofera);

                var ikona22 = $("<i style='font-size:24px' class='fas'>&#xf2dc;</i>");
                var tekst22 = $("<p></p>").text(auto.aut_klima);

                var ikona32 = $("<i style='font-size:24px' class='fas'>&#xf52f;</i>");
                var tekst32 = $("<p></p>").text(auto.aut_vrstaGoriva);

                kolona12.append(ikona12, tekst12);
                kolona22.append(ikona22, tekst22);
                kolona32.append(ikona32, tekst32);

                /*
                ZAVRSEN DRUGI RED
                */

                buttonDiv.append(red1, red2);
                
                var dugmeIzbrisi = $("<button type='submit' id='"+ auto.aut_id +"'  class='izbrisi-auto'>Delete</button>");
                var dugmeIzmeni = $("<button type='submit' id='"+ auto.aut_id +"'  class='izmeni-auto'>Change</button>");
                
                buttonDiv.append(dugmeIzbrisi, dugmeIzmeni);

                if(korid !== undefined){
                    dugmeIzbrisi.css("display","block");
                    dugmeIzmeni.css("display","block");
                }

                $("#close-rezervacija").click(function(){
                    $("#my-modal-rezervacija").css("display","none");
                });

                dugmeIzmeni.click(function(){
                    $("#my-modal-izmena").css("display", "block");
                    autId(event.target.id);
                });
                
                dugmeIzbrisi.click(function(){
                    autId(event.target.id);
                    $.ajax({
                        url: 'http://localhost:3000/izbrisiauto',
                        method: 'POST',
                        data: {
                           auto_id: autoid
                        }
                    }).done(function(response){
                        if(response.Result == "ERR"){
                            console.log("Neuspesno brisanje auta!");
                            return;
                        }
                        getCars();
                        alert("Auto je izbrisan!");
                
                    });
                });

                $("#close-izmena").click(function(){
                    $("#my-modal-izmena").css("display","none");
                });
            }
        });
};

function menjacCheckbox(){
    if($("#manuelni").is(':checked')){
        var manuelni = $("#manuelni").val();
        return manuelni;
    }else{
        var automatski = $("#automatski").val();
        return automatski;
    }
}

function klimaCheckbox(){
    if($("#klima").is(':checked')){
        var klima = $("#klima").val();
        return klima;
    }else{
        var bez_klime = $("#bez_klime").val();
        return bez_klime;
    }
}

function gorivoCheckbox(){
    if($("#diesel").is(':checked')){
        var diesel = $("#diesel").val();
        return diesel;
    }else{
        var benzin = $("#benzin").val();
        return benzin;
    }
}

$("#izmeniAuto").click(function(){
    menjacCheckbox();
    klimaCheckbox();
    gorivoCheckbox();

    var marka_auta = $("#marka_auta").val();
    var model_auta = $("#model_auta").val();
    var tip_auta = $("#tip_auta").val();
    var cena_auta = $("#cena_auta").val();
    var broj_vrata = $("#broj_vrata").val();
    var broj_osoba = $("#broj_osoba").val();
    var broj_kofera = $("#broj_kofera").val();
    var auto_id = autoid;

    switch (tip_auta) {
        case "Sedan" :
            tip_auta = 1;
            break;
        case "Pick up":
            tip_auta = 2;
            break;
        case "Jeep":
            tip_auta = 3;
            break;
        case "Minivan":
            tip_auta = 4;
            break;
        case "Hatchback":
            tip_auta = 5;
            break;
        case "Limusine":
            tip_auta = 6;
            break;
      }

      switch (marka_auta) {
        case "Volkswagen" :
            marka_auta = 1;
          break;
        case "Nissan":
            marka_auta = 2;
          break;
        case "Ford":
            marka_auta = 3;
          break;
        case "Toyota":
            marka_auta = 4;
          break;
        case "Hyundai":
            marka_auta = 5;
          break;
        case "Mitsubishi":
            marka_auta = 6;
          break;
          case "Dacia":
            marka_auta = 7;
          break;
          case "Dodge":
            marka_auta = 8;
          break;
          case "BMW":
            marka_auta = 9;
          break;
      }
    
    if(model_auta == "" || cena_auta == ""){
        alert("Popunite sva polja!");
        return;
    }
    
    $.ajax({
        url: 'http://localhost:3000/izmeniauto',
        method: 'POST',
        data: {
           marka_auta: marka_auta,
           model_auta: model_auta,
           tip_auta: tip_auta,
           cena_auta: cena_auta,
           broj_vrata: broj_vrata,
           broj_osoba: broj_osoba,
           broj_kofera: broj_kofera,
           auto_id: auto_id,
           menjac: menjacCheckbox(),
           klima: klimaCheckbox(),
           gorivo: gorivoCheckbox()

        }
    }).done(function(response){
        if(response.Result == "ERR"){
            alert("Neuspesna izmena auta!");
            return;
        }
        getCars();
        $("#my-modal-izmena").css("display", "none");
        alert("Auto je izmenjen!");

    });

});

$("#dodajAuto").click(function(){
    menjacCheckbox();
    klimaCheckbox();
    gorivoCheckbox();
	
	var marka_auta = $("#marka_auta").val();
    var model_auta = $("#model_auta").val();
    var tip_auta = $("#tip_auta").val();
    var cena_auta = $("#cena_auta").val();
    var broj_vrata = $("#broj_vrata").val();
    var broj_osoba = $("#broj_osoba").val();
    var broj_kofera = $("#broj_kofera").val();
    
    switch (tip_auta) {
        case "Sedan" :
            tip_auta = 1;
            break;
        case "Pick up":
            tip_auta = 2;
            break;
        case "Jeep":
            tip_auta = 3;
            break;
        case "Minivan":
            tip_auta = 4;
            break;
        case "Hatchback":
            tip_auta = 5;
            break;
        case "Limusine":
            tip_auta = 6;
            break;
      }

      switch (marka_auta) {
        case "Volkswagen" :
            marka_auta = 1;
          break;
        case "Nissan":
            marka_auta = 2;
          break;
        case "Ford":
            marka_auta = 3;
          break;
        case "Toyota":
            marka_auta = 4;
          break;
        case "Hyundai":
            marka_auta = 5;
          break;
        case "Mitsubishi":
            marka_auta = 6;
          break;
          case "Dacia":
            marka_auta = 7;
          break;
          case "Dodge":
            marka_auta = 8;
          break;
          case "BMW":
            marka_auta = 9;
          break;
      }
    if(model_auta == "" || cena_auta == ""){
        alert("Popunite sva polja!");
        return;
    }

    $.ajax({
        url: 'http://localhost:3000/dodajauto',
        method: 'POST',
        data: {
           marka_auta: marka_auta,
           model_auta: model_auta,
           tip_auta: tip_auta,
           cena_auta: cena_auta,
           broj_vrata: broj_vrata,
           broj_osoba: broj_osoba,
           broj_kofera: broj_kofera,
           menjac: menjacCheckbox(),
           klima: klimaCheckbox(),
           gorivo: gorivoCheckbox()

        }
    }).done(function(response){
        if(response.Result == "ERR"){
            alert("Neuspesno dodavanje auta!");
            return;
        }
        getCars();
        $("#my-modal-izmena").css("display", "none");
        alert("Auto je dodat u bazu!");

    });
});
