let sanger;
let filter = "alle";
let filtergenre = "alle";
const sangListe = document.querySelector("#listeindhold");
const sangTemplate = document.querySelector("template");
let urlParams = new URLSearchParams(window.location.search);
let getBruger = urlParams.get("bruger");
let filterbruger = "alle";
let getUri = urlParams.get("uri");
let bruger = `spotify:user:${getBruger}`;

document.addEventListener("DOMContentLoaded", hentJson);


async function hentJson() {
    const minJson = await fetch("https://spreadsheets.google.com/feeds/list/1Y6c_YOI5XmIz6zh6OT_943mOkupPzIyyYaDALWxi6LQ/od6/public/values?alt=json&fbclid=IwAR3GvdQvKcjYnqT18MlJN99RDpNzlUmAW68sfh6Vl2ChXgjJi_lKYb9sou8");
    sanger = await minJson.json(); /*Henter google sheet ind som jSon asynkront og afventer indholdet, mens resten af koden kører viderer*/
    visSangListen();
    if (window.location.href.indexOf('spotify') < 0) {
        /*Hvis url IKKE indeholder 'spotify' kald disse funktioner*/

        klikFilter();
        clickonFilterknap();
        tilbageKlik();
    }
}

function clickonFilterknap() {
    console.log("clickonFilterknap");
    document.querySelector("#filterknap").addEventListener("click", toggleFilterlist);

}

function toggleFilterlist() {
    document.querySelector("#menu").classList.toggle("hidden");
    /*Toggle filterknap*/
}

function tilbageKlik() {
    console.log("tilbageKlik")
    document.querySelector(".back").addEventListener("click", tilbageForside);
}

function tilbageForside() {
    window.history.back(); /*Gå tilbage til forrige side*/
}

function visSangListen() {

    sanger.feed.entry.forEach(sang => {
        /*For hver sang*/
        let getBrugerNavn = urlParams.get("brugernavn"); /*Tag værdien af "brugernavn" fra url*/
        if (sang.gsx$bruger.$t == bruger || "alle" == getBruger) {
            /*Hvis sangens bruger-id er det samme som bruger i url ELLER hvis brugeren i url er "alle" */
            document.querySelector(".brugerplaylist").textContent = getBrugerNavn; /*Skriv brugernavn fra url ud i .brugerplaylist*/

            if (filtergenre == "alle" || filtergenre == sang.gsx$genre.$t) {
                /*Hvis der er trykket på "alle" ELLER en bestemt genre*/
                let klon = sangTemplate.cloneNode(true).content; /*Klon koden i html for hver sang, der forekommer*/
                klon.querySelector("img").src = "albums-billeder/" + sang.gsx$albumcover.$t + "-album.jpg";
                klon.querySelector("h2").textContent = sang.gsx$navn.$t;
                klon.querySelector(".kunstner").textContent = `af ${sang.gsx$kunstner.$t}`;
                klon.querySelector(".album").textContent = sang.gsx$album.$t;
                klon.querySelector(".tid").textContent = sang.gsx$varihed.$t;
                klon.querySelector("#spille-knap").src = "assets/spille-knap.svg";
                sangListe.appendChild(klon);
                sangListe.lastElementChild.addEventListener("click", () => {
                    /*Tilføj eventlistener på det sidste barn af listen*/

                    location.href = `single.html?uri=${sang.gsx$uri.$t}`; /*Når der klikkes, åbn single.html med denne sti*/
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
    filtergenre = this.dataset.genre; /*tag værdien af dataatribute med genre på den knap, der bliver trykket på*/
    document.querySelector(".filtretnavn").textContent = this.textContent; /*Udskriv navnet i overskrift*/

    document.querySelectorAll(".filter").forEach(elm => {
        elm.classList.remove("valgt"); /*Fjern klassen "avalgt fra alle knapper*/
    });

    this.classList.add("valgt"); /*Tilføj klassen "valgt" på knappen, der er trykket på*/

    sangListe.innerHTML = ""; /*nulstil*/
    visSangListen();
}

function visLyrics() {

    if (window.location.href.indexOf('single.html') > 0) {
        /*Hvis url indeholder "single.html" fra https://www.encodedna.com/javascript/check-if-url-contains-a-given-string-using-javascript.htm
         */
        /*IndexOf vil give et tal for hver gang teksten forekommer. Hvis den ikke forekommer vil den give -1*/
        document.querySelector(".back").addEventListener("click", () => {
            history.back();
        })
        sanger.feed.entry.forEach(song => {
            if (song.gsx$uri.$t == getUri) {
                document.querySelector(".titel").textContent = song.gsx$navn.$t;
                document.querySelector(".full h2").textContent = song.gsx$kunstner.$t;
                document.querySelector(".full h3").textContent = "Album: " + song.gsx$album.$t;

                document.querySelector(".image").src = "albums-billeder/" + song.gsx$albumcover.$t + "-album.jpg";
                document.querySelector(".image").alt = song.gsx$albumcover.$t;
                document.querySelector(".lyrics").innerHTML = `<pre>${song.gsx$lyrics.$t}</pre>`;
            }
        });
    }
}
