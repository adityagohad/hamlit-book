window.onload = function () {
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  const name = document.querySelector('#title');
  const description = document.querySelector('#bookDiscription');
  const img = document.querySelectorAll('figure.poster');
  const progressBar = document.querySelector('#progress');
  const moneyRaised = document.querySelector("#moneyRaised")
  const targetRemaining = document.querySelector("targetremaining")
  const donateCount = document.getElementById("donateCount")

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
    const mImg = document.createElement("img");
    mImg.src = data.img;
    document.body.appendChild(mImg);
    mImg.onload = function(){
      const {width, height} = mImg.getBoundingClientRect();
      document.body.removeChild(mImg);
      document.getElementById("book-container").style.width = 500*width/height;
      document.getElementById("book-container").style.margin = "1rem auto 1rem";
      img.forEach((e) => (e.style.backgroundImage = `url(${data.img})`));
      donateCount.innerText = "you've donated  " + parseInt(data.money_raised/10) + " books so far"
      const progressValue = ((data.money_raised%10)*10).toFixed(2);
      targetRemaining.innerText = (100 - progressValue).toFixed(2)+"% to donate your next book";
      //targetRemaining.innerText = ((100 * data.money_raised)/(data.cost * data.target)).toFixed(4)+"% to donate your next book";
        progressBar.setAttribute('aria-valuenow', progressValue);
        progressBar.setAttribute(
          'style',
          'width:' + (progressValue) + '%'
        );
        //targetRemaining.innerText = ((100 * data.money_raised)/(data.cost * data.target)).toFixed(4)+"% to donate your next book";
    }
  });
}
