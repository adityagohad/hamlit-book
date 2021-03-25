window.onload = function () {
    const name = document.querySelector("#title")
    const description = document.querySelector("#bookDiscription")
    const img = document.querySelector("#poster")
    // const names = ["Above the circle of the moon", "Gunmetal Gods", "How much of these hills is gold", "Valkyrie"]
    // const descriptions = ["This unique tale crosses the genres of Historical Fiction, Fantasy, and Horror, with the latter most prevalent. If you love a good gas lamp story filled with darkness and gore, then Above the Circle of the Moon will be a page-turning, riveting read from beginning to end. Personally, I wasn't prepared for quite the amount of horror this tale puts forth, but that being said, the plot was well-delivered; it set my spine tingling with that sensation that makes you turn around repeatedly even though you know nothing is there, creating a unique fable from the more traditional lycanthropy."
    //     , "A page-turning war between men and gods in a fully realized world that is engrossing and spectacular, this is a must-read. The book is full of well realized characters, a deep culture that is well thought out, incredible creatures and amazing beings that turn the tide of the story and everything else you would want in a fantasy tale. This book easily stands with the best of epic fantasy fiction.⠀If you love sweeping epics like the Game of Thrones series or Throne of the Crescent Moon, drop whatever else you are reading and pick up this book. It's as bold as the title and it delivers on all fronts. Remember Zamil Akhtar's name because if he keeps writing like this, he will be the next well known epic fantasy author to have a global fanbase."
    //     , "An electric debut novel set against the twilight of the American gold rush, two siblings are on the run in an unforgiving landscape—trying not just to survive but to find a home."
    //     , "What do you do when you realise that the things you've learnt have all been a lie? How do you deal with a world that's no longer your own?⠀If science fiction is about pushing new boundaries and exploring new worlds, Ludwa takes that to heart. One doesn’t need to go far in her Odin Prime to enter a new space and the boundaries are only as much as our characters place on themselves.⠀If you like your soap opera full of politics and philosophical questions that don’t bog down the narrative, then this is the book for you. If anything, Valkyrie is a taste of what can be done with a few ideas well done"]
    // const imgs = ["https://m.media-amazon.com/images/I/51tcFt8z6hL.jpg", "https://m.media-amazon.com/images/I/51ARF1Ai8EL.jpg", "https://images-na.ssl-images-amazon.com/images/I/51E1y-GYtaL._SX329_BO1,204,203,200_.jpg", "https://m.media-amazon.com/images/I/41Twkz8XS8L.jpg"]
    // var i = Math.floor(Math.random() * 4);
    // console.log(i)
    // name.innerText = names[i]
    // description.innerText = descriptions[i]
    // img.src = imgs[i]
    httpGetAsync("http://getfreeideas.xyz/getBook", function (callback) {
        var data = JSON.parse(callback);
        name.innerText = data.title
        description.innerText = data.description
        img.src = data.img
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
