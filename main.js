var modal = $("#my-modal");

$("#modal-btn").click(function(){
    modal.css("display","block");
});

$(".close").click(function(){
    modal.css("display","none");
});

window.addEventListener('click', outsideClick);

function outsideClick(e) {
    if (e.target == modal) {
        modal.css("display","none");
    }
}

$("#signOut_btn").click(function(){
    $("#signOut_btn").css("display", "none");
    $("#prijava").css("display","inline");
    $("#ispis").html("");
});

$("#modal_reg_btn").click(function(){
    var reg_username = $("#reg_username").val();
    var reg_password = $("#reg_password").val();
    var reg_name = $("#reg_name").val();
    var reg_lastname = $("#reg_lastname").val();
    
    
    $.ajax({
        url: "http://localhost:3000/registration",
        method: "POST",
        data: {
            reg_username: reg_username,
            reg_password: reg_password,
            reg_name: reg_name,
            reg_lastname: reg_lastname
        }
    }).done(function(response){
        if(response.Result == "ERR"){
            $("#reg_ispis").html("Neuspesna registracija");
            return;
        }
        //$("#reg_ispis").html(response.data.reg_name);
        console.log("registracija uspesna");
        modal.css("display","none");
        window.alert("Registration complete! Please sign in!");
    });
});

$("#login-btn").click(function(){
    var username = $("#username").val();
    var password = $("#password").val();
    
    $.ajax({
        url: 'http://localhost:3000/auth/login',
        method: 'POST',
        data: {
            username: username,
            password: password
        }
    }).done(function(response){
        if(response.Result == "ERR"){
            $("#ispis").html("Neuspesan login, probajte ponovo");
            return;
        }
        
        $("#ispis").html(response.data.kor_name);
        $("#prijava").css("display","none");
        $("#signOut_btn").css("display", "block");
		$("#signOut_btn").css("float", "right");
        
    });
});

$("#trazi_najam").click(function(){
    var date_preuzimanje = $("#date_preuzimanje").val();
    var date_povratak = $("#date_povratak").val();

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
        console.log(response.data);
    });
});


