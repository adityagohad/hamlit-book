window.onload = function () {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    const name = document.querySelector("#title")
    const description = document.querySelector("#bookDiscription")
    const img = document.querySelector("#poster")

    getNewData(name, description, img)

    document.querySelector("#refresh").onclick = function () {
        getNewData(name, description, img)
    }

    var myModal = document.getElementById("exampleModal")
    var myInput = document.getElementById("info")

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus()
    })
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

function getNewData(name, description, img) {
    httpGetAsync("http://getfreeideas.xyz/getBook", function (callback) {
        var data = JSON.parse(callback);
        name.innerText = data.title
        description.innerText = data.description
        img.src = data.img
    })
}
