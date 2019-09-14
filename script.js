let sanger;
let filter = "alle";
let filtergenre = "alle";
const sangListe = document.querySelector("#listeindhold");
const sangTemplate = document.querySelector("template");
let urlParams = new URLSearchParams(window.location.search);
let getBruger = urlParams.get("bruger");
let bruger = `spotify:user:${getBruger}`;
let uri = urlParams.get("uri");

document.addEventListener("DOMContentLoaded", start);




function start() {
    document.querySelectorAll(".box").forEach(pBtn => {
        pBtn.addEventListener("click", whichPlayList);
    })

    hentJson();
}


function whichPlayList() {
    lister = this.dataset.bruger;
    playListSelect();
}


function playListSelect() {
    /*   lister = this.dataset.bruger;*/
    location.href = `playlist.html?bruger=${lister}`;

}


async function hentJson() {
    const minJson = await fetch("https://spreadsheets.google.com/feeds/list/1Y6c_YOI5XmIz6zh6OT_943mOkupPzIyyYaDALWxi6LQ/od6/public/values?alt=json&fbclid=IwAR3GvdQvKcjYnqT18MlJN99RDpNzlUmAW68sfh6Vl2ChXgjJi_lKYb9sou8");
    sanger = await minJson.json();
    visSangListen();
    klikFilter();
    clickonFilterknap();
    tilbageKlik();
}

function clickonFilterknap() {
    console.log("clickonFilterknap");
    document.querySelector("#filterknap").addEventListener("click", toggleFilterlist);

}

function toggleFilterlist() {
    document.querySelector("#menu").classList.toggle("hidden");
}

function tilbageKlik() {
    console.log("tilbageKlik")
    document.querySelector(".tilbage").addEventListener("click", tilbageForside);
}

function tilbageForside() {
    window.history.back();
}

function visSangListen() {

    sanger.feed.entry.forEach(sang => {
        if (sang.gsx$bruger.$t == bruger || "alle" == getBruger) {
            if (filtergenre == "alle" || filtergenre == sang.gsx$genre.$t) {
                let klon = sangTemplate.cloneNode(true).content;
                klon.querySelector("img").src = "albums-billeder/" + sang.gsx$albumcover.$t + "-album.jpg";
                klon.querySelector("h2").textContent = sang.gsx$navn.$t;
                klon.querySelector(".kunstner").textContent = sang.gsx$kunstner.$t;
                klon.querySelector(".album").textContent = sang.gsx$album.$t;
                klon.querySelector(".tid").textContent = sang.gsx$varihed.$t;
                klon.querySelector("#spille-knap").src = "assets/spille-knap.svg";
                sangListe.appendChild(klon);
                sangListe.lastElementChild.addEventListener("click", () => {

                    location.href = `single.html?uri=${sang.gsx$uri.$t}`;
                });
            }

        }
    })
    visLyrics();

}

function klikFilter() {
    document.querySelectorAll(".filter").forEach(elm => {
        elm.addEventListener("click", filtreringGenre);
    })
}

function filtreringGenre() {
    filtergenre = this.dataset.genre;
    document.querySelector("h1").textContent = this.textContent;

    document.querySelectorAll(".filter").forEach(elm => {
        elm.classList.remove("valgt");
    });

    this.classList.add("valgt");
    sangListe.innerHTML = "";
    visSangListen();
}

function visLyrics() {
    console.log("kage");
    if (uri) {
        document.querySelector(".back").addEventListener("click", () => {
            history.back();
        })
        sanger.feed.entry.forEach(song => {
            if (song.gsx$uri.$t == uri) {
                document.querySelector(".titel").textContent = song.gsx$navn.$t;
                document.querySelector(".full h2").textContent = song.gsx$kunstner.$t;
                //                document.querySelector(".artist").textContent = song.gsx$kunstner.$t;
                document.querySelector(".full h3").textContent = "Album: " + song.gsx$album.$t;


                document.querySelector(".image").src = "albums-billeder/" + song.gsx$albumcover.$t + "-album.jpg";
                document.querySelector(".image").alt = song.gsx$albumcover.$t;
                document.querySelector(".lyrics").innerHTML = `<pre>${song.gsx$lyrics.$t}</pre>`;
            }
        });
    }
}
