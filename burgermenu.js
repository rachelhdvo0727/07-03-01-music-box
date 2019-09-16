document.addEventListener("DOMContentLoaded", start);

function start() {
    document.querySelector("#menuknap").addEventListener("click", toggleMenu);
}



function toggleMenu() {
    console.log("toggleMenu");
    document.querySelector("#burgermenu").classList.toggle("hide");

    let erSkjult = document.querySelector("#burgermenu").classList.contains("hide");

    if (erSkjult == true) {
        document.querySelector("#menuknap").textContent = "☰";
    } else {
        document.querySelector("#menuknap").textContent = "X";
    }
}
