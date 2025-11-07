let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map).bindPopup("Hello!!!!").openPopup();

navigator.geolocation.getCurrentPosition(() => {}, () => {}, {timeout:1});
if (Notification.permission === "default") Notification.requestPermission();

document.getElementById("getLocation").onclick = () => {
    navigator.geolocation.getCurrentPosition(pos => {
        let lat = pos.coords.latitude, lon = pos.coords.longitude;
        map.setView([lat, lon], 18);
        marker.setLatLng([lat, lon]).setPopupContent(`${lat.toFixed(6)}, ${lon.toFixed(6)}`).openPopup();
    });
};

document.getElementById("saveButton").onclick = () => {
    leafletImage(map, (err, canvas) => {
        let rs = document.getElementById("rasterMap");
        rs.width = 600;
        rs.height = 300;
        rs.getContext("2d").drawImage(canvas, 0, 0, 600, 300);
        rs.style.display = "block";
        document.getElementById("startPuzzle").disabled = false;
    });
};

document.getElementById("startPuzzle").onclick = () => {
    let canvas = document.getElementById("rasterMap");
    let puzzle = document.getElementById("puzzle-area");
    let table = document.getElementById("table");
    puzzle.innerHTML = ""; table.innerHTML = "";
    let correct = 0;

    for (let i = 0; i < 16; i++) {
        let slot = document.createElement("div");
        slot.className = "slot";
        slot.dataset.index = i;

        slot.ondragover = e => e.preventDefault();
        slot.ondragenter = () => slot.classList.add('over');
        slot.ondragleave = () => slot.classList.remove('over');
        slot.ondrop = e => {
            e.preventDefault();
            slot.classList.remove('over');
            let index = e.dataTransfer.getData("text");
            let piece = document.querySelector(`.piece[data-index="${index}"]`);
            if (!piece || slot.children.length) return;

            if (piece.parentElement && piece.parentElement.classList.contains("slot")) {
                let old = piece.parentElement;
                if (old.dataset.index == index) correct--;
                old.innerHTML = "";
            }

            slot.appendChild(piece);
            piece.style.position = "static";

            if (slot.dataset.index == index) {
                piece.classList.add("correct");
               if (++correct === 16 && Notification.permission === "granted") {
                    new Notification("Mapa ułożona!", { body: "ułożyłeś całe puzzle!" });
                    console.log("ułożyłeś puzzle!");
                }
            } else {
                piece.classList.remove("correct");
            }
        };

        puzzle.appendChild(slot);
    }


   let positions = Array.from({length: 16}, (_, i) => i);
    positions.sort(() => Math.random() - 0.5); 

       for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            let slot = document.createElement("div");
            slot.className = "slot";
            table.appendChild(slot);

        let pCanvas = document.createElement("canvas");
            pCanvas.width = 150;
            pCanvas.height = 75;
            let ctx = pCanvas.getContext("2d");
            let pos = positions[r * 4 + c];
            let srcX = (pos % 4) * 150;
            let srcY = Math.floor(pos / 4) * 75;
            ctx.drawImage(canvas, srcX, srcY, 150, 75, 0, 0, 150, 75);

            let img = new Image();
            img.src = pCanvas.toDataURL();
            img.className = "piece";
            img.draggable = true;
            img.dataset.index = pos;

            img.ondragstart = e => e.dataTransfer.setData("text", img.dataset.index);
            slot.appendChild(img);
        }
    }
};