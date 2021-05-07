window.onload = function () {
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  const name = document.querySelector('#title');
  const description = document.querySelector('#bookDiscription');
  const img = document.querySelectorAll('.poster');
  const progressBar = document.querySelector('#progress');
  const moneyRaised = document.querySelector("#moneyRaised")
  const targetRemaining = document.querySelector("targetremaining")

  getNewData(name, description, img, progressBar);

  document.querySelector('#refresh').onclick = function () {
    getNewData(name, description, img, progressBar);
  };
};

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.response);
  };
  xmlHttp.open('GET', theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function getNewData(name, description, img, progressBar) {
  httpGetAsync('http://getfreeideas.xyz/getBook', function (callback) {
    var data = JSON.parse(callback);
    name.innerText = data.name;
    description.innerText = data.description;
    moneyRaised.innerText = "$ "+data.money_raised.toFixed(2);
    img.forEach((e) => (e.src = data.img));
    if (data.money_raised < 100) {
      progressBar.setAttribute('aria-valuenow', data.money_raised);
      progressBar.setAttribute(
        'style',
        'width:' + (data.money_raised) + '%'
      );
      targetRemaining.innerText = (100 * data.money_raised)/(data.cost * data.tagetUnits)+" to donate your next book"
      //progressBar.innerText = '$ ' + data.money_raised.toFixed(2);
    } else {
      progressBar.setAttribute('aria-valuenow', 100);
      progressBar.setAttribute('style', 'width:' + 100 + '%');
    }
  });
}
