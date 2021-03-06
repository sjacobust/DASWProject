'use strict';
const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
let TOKEN = getTokenValue('token');
const HTTPStatusCodes = {
    "notFound": {
        "code": 404,
        "page": "./404.html",
    },
    "forbidden": {
        "code": 403,
        "page": "./403.html",
    },
    "unauthorized": {
        "code": 401,
        "page": "./401.html",
    },
}


let NAME_FILTER = ''
let PAGES = {
    current: 1,
    currentIndex: 0,
};
let searchBar = document.getElementById('searchBar');

function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/* * * * * * * * * * * * * * * * * *
 * ARTICLE LIST REQUEST *** START ***
 * * * * * * * * * * * * * * * * * */

const articleToHTML = (article) => {
    return `
    <tr>
                    <td>${article.title}</td>
                    <td>${article.game}</td>
                    <td>${article.text.substring(0, 10)}</td>
                    <td>${article.published}</td>
                    <td><button class="btn btn-primary" type="button" index-db-value="${article.id}" id="editBtn">Edit</button></td>
                    <td><button class="btn btn-danger" type="button"  index-db-value="${article.id}" id="deleteBtn">Delete</button></td>
                </tr>
    `
}

const articleListToHTML = (list) => {
    if (list) {
        $("#articleTable").html(list.map(articleToHTML).join(''));
    }
};


function getArticlesPage(page, filter) {
    let articlesURL = APIURL + `/articles?page=${page}&limit=10` + filter;
    sendHTTPRequest(articlesURL, "", HTTTPMethods.get, (response) => {
        console.log(`Loaded ${response.status}`);
        let articleList = JSON.parse(response.data);
        articleListToHTML(articleList);
    }, () => {
        console.error(`Something Went Wrong ${response.data}`);
    }, "");
}

/* * * * * * * * * * * * * * * * *
 * ARTICLE LIST REQUEST *** END ***
 * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * *
 * GAME LIST REQUEST *** START ***
 * * * * * * * * * * * * * * * * * */

const gameToOption = (game) => {
    return `<option value="${game.game}"> ${game.game} </option>`;
}

const gameListToOption = (list) => {
    if (list) {
        $("#articleGame").html(list.map(gameToOption).join(''));
    }
};


function getGamesToOption() {
    let gamesURL = APIURL + `/games`;
    sendHTTPRequest(gamesURL, "", HTTTPMethods.get, (response) => {
        console.log(`Loaded ${response.status}`);
        let gamelist = JSON.parse(response.data);
        gameListToOption(gamelist);
    }, () => {
        console.error(`Something Went Wrong ${response.data}`);
    }, "");
}

const gameToCard = (game) => {
    return `<div class="card mb-3 bg-soothing-white" style="max-width: 540px;">
    <div class="row no-gutters">
        <div class="col-md-4 align-items-center">
            <img src="${game.image_url}"
                class="card-img" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${game.game}</h5>
                <p class="card-text">${game.genre}</p>
                <p class="card-text"><small class="text-muted">Last updated 3 mins
                        ago</small></p>
            </div>
        </div>
    </div>
</div>`
}

const gameListToCard = (list) => {
    if (list) {
        $("#gamesCards").html(list.map(gameToCard).join(''));
    }
};


function getGamesCards() {
    let gamesURL = APIURL + `/games`;
    sendHTTPRequest(gamesURL, "", HTTTPMethods.get, (response) => {
        console.log(`Loaded ${response.status}`);
        let gamelist = JSON.parse(response.data);
        gameListToCard(gamelist);
    }, () => {
        console.error(`Something Went Wrong ${response.data}`);
    }, "");
}

/* * * * * * * * * * * * * * * * *
 * GAME LIST REQUEST *** END ***
 * * * * * * * * * * * * * * * * * */

const APIURL = window.location.protocol + '//' + window.location.host + '/api';

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
            cbError(xhr.status + ': ' + xhr.statusText, xhr.status);
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
            sendHTTPRequest(url, payload, HTTTPMethods.post, (response) => {
                console.log(`Usuario registrado ${response}`);
                $("#modalRegistro").modal("toggle");
            }, (response) => {
                console.error(`Usuario no registrado ${response}`);
            }, null);

        })

    });

    $('#modalLogin').on('show.bs.modal', function (event) {
        $('#loginBtn').click(() => {
            const payload = JSON.stringify({
                'email': $('#emailId').val(),
                'password': $('#passwordID').val(),
            });
            let url = APIURL + '/login';
            console.log(url);
            sendHTTPRequest(url, payload, HTTTPMethods.post, (response) => {
                console.log(`Bienvenido`);
                $("#mainDiv").load("./articleList.html");
                $("#articlesLink").parent().addClass("active");
                $("#articlesLink").parent().siblings().removeClass("active");
                $("#modalLogin").modal("toggle");

            }, (response) => {
                console.error(`Usuario no registrado ${response}`);
            }, null);

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
        let url = APIURL + "/gameList";
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
        $("#gamesLink").addClass("active");
        $("#gamesLink").siblings().removeClass("active");
    });
    $("#genresLink").on("click", function () {
        let url = APIURL + "/genreList";
        $("#mainDiv").load("./genreList.html");
        sendHTTPRequest(url, "", HTTTPMethods.get, () => {
            console.log("Loaded");
        }, () => {
            console.error("Something Went Wrong");
        }, "");
        $("#genresLink").addClass("active");
        $("#genresLink").siblings().removeClass("active");
    });
    $("#articlesLink").on("click", function () {
        $("#mainDiv").load("./articleList.html");
    });

});

$("#mainDiv").on('click', "#newArticleBtn", () => {
    $("#mainDiv").load("./newArticle.html");
    let url = APIURL + "/games";
    sendHTTPRequest(url, "", HTTTPMethods.get, () => {
        console.log("Loaded");
    }, () => {
        console.error("Something Went Wrong");
    }, "");
});

$("#mainDiv").on('click', "#editBtn", () => {
    console.log("I was clicked, prepared to be edited");
    let $row = $(this).closest("tr"), // Finds the closest row <tr> 
        $tds = $row.find("td"); // Finds all children <td> elements

    $.each($tds, function () { // Visits every single <td> element
        console.log($(this).text()); // Prints out the text within the <td>
    });
})

$("#mainDiv").on('click', "#deleteBtn", () => {
    console.log("I was clicked, prepared to be deleted");
    let url = APIURL + "/articles";
    let id = JSON.stringify({ "id": $("#deleteBtn").attr("index-db-value") });
    sendHTTPRequest(url, id, HTTTPMethods.delete, () => {
        console.log("Deleted");
    }, () => {
        console.error("Something Went Wrong");
    }, "");
})
