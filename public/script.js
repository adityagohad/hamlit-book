window.onload = function () {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    const name = document.querySelector("#title")
    const description = document.querySelector("#bookDiscription")
    const img = document.querySelector("#poster")
    const progressBar = document.querySelector("#progress");

    getNewData(name, description, img, progressBar)

    document.querySelector("#refresh").onclick = function () {
        getNewData(name, description, img, progressBar)
    }
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getNewData(name, description, img, progressBar) {
    httpGetAsync("http://getfreeideas.xyz/getBook", function (callback) {
        var data = JSON.parse(callback);
        name.innerText = data.name
        description.innerText = data.description
        img.src = data.img
        if (data.money_raised < 100) {
            progressBar.setAttribute('aria-valuenow', data.money_raised)
            progressBar.setAttribute('style', 'width:' + data.money_raised + '%')
        } else {
            progressBar.setAttribute('aria-valuenow', 0.1)
            progressBar.setAttribute('style', 'width:' + data + '%')
        }
    })
}
