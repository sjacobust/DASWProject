'use strict';
const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol+'//'+window.location.host+'/api';

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    //agrega tu codigo de asignación de eventos...

    // sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken)

    $('#modalRegistro').on('show.bs.modal', function (event) {
        // console.log(event.relatedTarget);
        //agrega tu codigo...
        
        $('#signUpBtn').on("click", () => {
            const payload = JSON.stringify({
                'nombre': $('#registerName').val(),
                'apellidos': $('#registerLastname').val(),
                'username': $('#registerUsername').val(),
                'email': $('#registerEmail').val(),
                'password': $('#registerPassword').val(),
                'fecha': $('#registerDate').val(),
            });            
                let url = APIURL + '/users/register';
                console.log(url);
                sendHTTPRequest(url, payload, HTTTPMethods.post, () => {
                    console.log("Usuario Registrado");
                }, () => {
                    console.error("Usuario no registrado");
                }, null);
            
        })

    });

    $('#modalLogin').on('show.bs.modal', function (event) {
        // console.log(event.relatedTarget);
        //agrega tu codigo...
        
        $('#loginBtn').on("click", () => {
            const payload = JSON.stringify({
                'email': $('#registerEmail').val(),
                'password': $('#registerPassword').val()
            });            
                let url = APIURL + '/login';
                console.log(url);
                sendHTTPRequest(url, payload, HTTTPMethods.post, () => {
                    console.log("Bienvenido");
                }, () => {
                    console.error("Usuario no registrado");
                }, null);
                $("#mainDiv").load("./articleList.html");
            
        })

    });


});



$(document).ready(function () {

    $("#homeLink, #logoLink").on("click", function () {
        $("#mainDiv").load("./Welcome.html");
        $("#homeLink").parent().addClass("active");
        $("#homeLink").parent().siblings().removeClass("active");
    });

    $("#gamesLink").on("click", function () {
        $("#mainDiv").load("./gameList.html");
        let url = APIURL+"/gameList";
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
        $("#gamesLink").addClass("active");
        $("#gamesLink").siblings().removeClass("active");
    });
    $("#genresLink").on("click", function () {
        let url = APIURL+"/genreList";
        $("#mainDiv").load("./genreList.html");
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
        $("#genresLink").addClass("active");
        $("#genresLink").siblings().removeClass("active");
    });
    $("#rpgGamesLink").on("click", function () {
        $("#mainDiv").load("./gameList.html");
        let gfilter = 'rpg';
        let url = APIURL+"/gameList?page=1&limit=3"+gfilter;
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
        $("#rpgGamesLink").addClass("active");
        $("#rpgGamesLink").siblings().removeClass("active");
    });
    $("#fpsGamesLink").on("click", function () {
        $("#mainDiv").load("./gameList.html");
        let gfilter = 'fps';
        let url = APIURL+"/gameList?page=1&limit=3"+gfilter;
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
        $("#fpsGamesLink").addClass("active");
        $("#fpsGamesLink").siblings().removeClass("active");
    });
    $("#mobaGamesLink").on("click", function () {
        $("#mainDiv").load("./gameList.html");
        let gfilter = 'moba';
        let url = APIURL+"/gameList?page=1&limit=3"+gfilter;
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
        $("#mobaGamesLink").addClass("active");
        $("#mobaGamesLink").siblings().removeClass("active");
    });



});


$("#mainDiv").on('click', () => {
    $("#rpgGamesLink").on("click", function () {
        $("#mainDiv").load("./gameList.html");
        let gfilter = 'rpg';
        let url = APIURL+"/gameList?page=1&limit=3"+gfilter;
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
    });
    $("#fpsGamesLink").on("click", function () {
        $("#mainDiv").load("./gameList.html");
        let gfilter = 'fps';
        let url = APIURL+"/gameList?page=1&limit=3"+gfilter;
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
    });
    $("#mobaGamesLink").on("click", function () {
        $("#mainDiv").load("./gameList.html");
        let gfilter = 'moba';
        let url = APIURL+"/gameList?page=1&limit=3"+gfilter;
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
    });
})