$("#mainDiv").on("click", "#publishBtn", () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    const payload = JSON.stringify({
        'title': $('#articleName').val(),
        'game': $('#articleGame').val(),
        'tags': $('#articleTAG').val(),
        'text': $('#articleContent').val(),
        'published': today,
    });
    let url = APIURL + '/articles/new';
    console.log(url);
    console.log(payload);
    sendHTTPRequest(url, payload, HTTTPMethods.post, (response) => {
        console.log(`Artículo publicado ${response.status}`);
    }, (response) => {
        console.error(`Artículo no publicado ${response}`);
    }, TOKEN);
    $("#mainDiv").load('./articleList.html');
});
