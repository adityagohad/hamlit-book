const faillog = (msg) =>
  console.log(`%c${msg}`, 'color:white;background-color: tomato;');
const successlog = (msg) =>
  console.log(`%c${msg}`, 'color:white;background-color: green;');

window.fbAsyncInit = function () {
  FB.init({
    appId: '849453379203719',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v12.0',
  });
};

window.onload = async function () {
  FB.getLoginStatus(async function (response) {
    if (response.status === 'connected') {
      FB.api(
        '/me',
        'GET',
        { fields: 'name,picture.type(large)' },
        function (response) {
          const userHTML = document.querySelector('.user-title');
          const picHTML = document.querySelector('.profile-pic');
          userHTML.innerHTML = `Hello, ${response.name}!`;
          picHTML.src = response.picture.data.url;
        }
      );
    } else {
      faillog('Not logged in from FACEBOOK');
      var auth2 = await gapi.auth2.getAuthInstance();
      if (auth2.isSignedIn.get()) {
        console.log(auth2);
      } else {
        faillog('not logged in from GOOGLE');
        window.location.pathname = '/auth.html';
      }
    }
  });

  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  const name = document.querySelector('#title');
  const description = document.querySelector('#bookDiscription');
  const imageContainer = document.getElementById('cover');
  const moneyRaised = document.querySelector('#moneyRaised');
  const targetRemaining = document.querySelector('targetremaining');
  const donateCount = document.getElementById('donateCount');
  console.log('NEXT LINE FUNC CALL');
  getNewData(name, description, imageContainer);

  // document.querySelector('#refresh').onclick = function () {
  //   getNewData(name, description, img);
  // };
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

function changeBackground(to) {
  const body = document.querySelector('body');
  switch (to) {
    case 'white':
      body.style.background = 'white';
      return;

    case 'black':
      body.style.background = 'black';
      return;

    case 'gradient':
      body.style.background =
        'transparent linear-gradient(180deg, #d3cce3 0%, #eef2f3 100%) 0% 0% no-repeat padding-box';
      return;
  }
}

function getNewData(name, description, img) {
  console.log('Func executing...');
  httpGetAsync('http://spreadjoy.online/getBook', function (callback) {
    console.log('Inside get req');
    var data = JSON.parse(callback);
    name.innerText = data.name;
    description.innerText = data.description;
    moneyRaised.innerText = '$ ' + data.money_raised.toFixed(2);
    const mImg = document.createElement('img');
    mImg.src = data.img;
    console.log('here', data.img);
    img.style.backgroundImage = `url("${data.img}")`;
    document.body.appendChild(mImg);
    mImg.onload = function () {
      const { width, height } = mImg.getBoundingClientRect();
      document.body.removeChild(mImg);
      document.getElementById('book-container').style.width =
        (500 * width) / height;
      document.getElementById('book-container').style.margin = '1rem auto 1rem';
      img.forEach((e) => (e.style.backgroundImage = `url(${data.img})`));
      donateCount.innerText =
        "you've donated  " + parseInt(data.money_raised / 10) + ' books so far';
      const progressValue = ((data.money_raised % 10) * 10).toFixed(2);
      targetRemaining.innerText =
        (100 - progressValue).toFixed(2) + '% to donate your next book';
      //targetRemaining.innerText = ((100 * data.money_raised)/(data.cost * data.target)).toFixed(4)+"% to donate your next book";

      //targetRemaining.innerText = ((100 * data.money_raised)/(data.cost * data.target)).toFixed(4)+"% to donate your next book";
    };
  });

  console.log('Data fetch failed  ');
}

function onSignIn(googleUser) {
  const userHTML = document.querySelector('.user-title');
  const picHTML = document.querySelector('.profile-pic');
  var profile = googleUser.getBasicProfile();
  userHTML.innerHTML = `Hello, ${profile.getName()}!`;
  picHTML.src = profile.getImageUrl();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  const userHTML = document.querySelector('.user-title');
  const picHTML = document.querySelector('.profile-pic');

  if (auth2.isSignedIn.get()) {
    auth2.signOut().then(function () {
      window.location.pathname = '/auth.html';

      userHTML.innerHTML = `Hello!`;
      picHTML.src = 'https://cdn-icons-png.flaticon.com/512/747/747376.png';
      console.log('User signed out.');
    });
  } else {
    FB.logout(function (response) {
      console.log(response);
      console.log('logged out success');
      window.location.pathname = '/auth.html';
    });
  }
}
