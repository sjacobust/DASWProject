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



$(document).ready(function () {
    $("#gamesLink").on("click", function () {
        $("#mainDiv").load("./gameList.html");
        let url = APIURL+"/gameList";
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
    });
    $("#genresLink").on("click", function () {
        $("#mainDiv").load("./genreList.html");
        let url = APIURL+"/genreList";
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
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
});