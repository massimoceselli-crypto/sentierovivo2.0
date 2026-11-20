const MENU2_TOGGLES_KEY = 'sentierovivo2_menu_toggles';
const MENU2_GEMINI_CONFIG_KEY = 'sentierovivo2_gemini_config';
const MENU2_ADMIN_PASSWORDS = ['MASSIMOMASTER2026', 'SENTIEROVIP'];

function loadMenu2Toggles() {
    const defaults = {
        poi: true,
        mountainRoads: true,
        meteo24: true
    };
    try {
        const raw = localStorage.getItem(MENU2_TOGGLES_KEY);
        if (!raw) return defaults;
        const parsed = JSON.parse(raw);
        return {
            poi: parsed.poi !== undefined ? !!parsed.poi : true,
            mountainRoads: parsed.mountainRoads !== undefined ? !!parsed.mountainRoads : true,
            meteo24: parsed.meteo24 !== undefined ? !!parsed.meteo24 : true
        };
    } catch (err) {
        return defaults;
    }
}

function saveMenu2Toggles(toggles) {
    localStorage.setItem(MENU2_TOGGLES_KEY, JSON.stringify(toggles));
    renderMenu2TogglesUi();
}

function toggleMenu2Feature(keyName) {
    const current = loadMenu2Toggles();
    current[keyName] = !current[keyName];
    saveMenu2Toggles(current);
}

function renderMenu2TogglesUi() {
    const t = loadMenu2Toggles();
    const setLabel = (id, active) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerText = active ? 'ATTIVATA' : 'DISATTIVATA';
        el.style.color = active ? '#81c784' : '#ef9a9a';
    };
    setLabel('toggle-status-poi', t.poi);
    setLabel('toggle-status-mountain', t.mountainRoads);
    setLabel('toggle-status-meteo24', t.meteo24);
}

function isMenu2FeatureEnabled(keyName, labelItaliano) {
    const t = loadMenu2Toggles();
    if (!t[keyName]) {
        alert(`La funzione "${labelItaliano}" è attualmente DISATTIVATA. Puoi riattivarla dal Menu.`);
        return false;
    }
    return true;
}

function apriCartellaPercorsi2() {
    if (typeof renderSavedTracks2Ui === 'function') {
        renderSavedTracks2Ui();
    }
    const drawer = document.getElementById('sentiero2-menu-drawer');
    if (drawer) drawer.style.display = 'none';
    const panel = document.getElementById('sentiero2-archivio-modal');
    if (panel) panel.style.display = 'block';
}

function menuRegistraVocale2() {
    if (typeof handleAudioWp2 === 'function') {
        handleAudioWp2();
    }
}

function menuRegistraVideo2() {
    const input = document.getElementById('wp2-video-file');
    if (input) input.click();
}

function menuScattaFotoWaypoint2() {
    const input = document.getElementById('wp2-photo-file');
    if (input) input.click();
}

function menuRitornoARitroso2() {
    const coords = typeof track2Coordinates !== 'undefined' ? track2Coordinates : [];
    if (!coords || coords.length < 2) {
        alert("Servono almeno 2 punti registrati per calcolare il ritorno a ritroso.");
        return;
    }
    const reversed = [...coords].reverse();
    if (typeof sentieroMap !== 'undefined' && sentieroMap) {
        if (window._sentiero2BacktrackLine) {
            sentieroMap.removeLayer(window._sentiero2BacktrackLine);
        }
        window._sentiero2BacktrackLine = L.polyline(reversed, {
            color: '#ff9800',
            weight: 6,
            dashArray: '10, 10',
            opacity: 0.95
        }).addTo(sentieroMap);
        sentieroMap.fitBounds(window._sentiero2BacktrackLine.getBounds(), { padding: [25, 25] });
    }
    alert("Ritorno a ritroso tracciato sulla mappa (linea tratteggiata arancione).");
}

function menuCreaNuovoPercorsoRientro2() {
    const coords = typeof track2Coordinates !== 'undefined' ? track2Coordinates : [];
    if (!coords || coords.length < 2) {
        alert("Servono almeno 2 punti registrati per creare un nuovo percorso di rientro.");
        return;
    }
    const returnCoords = [...coords].reverse();
    if (typeof startTrack2 === 'function') {
        startTrack2((typeof track2Name !== 'undefined' && track2Name ? track2Name : 'Percorso') + ' - Rientro');
        track2Coordinates = returnCoords;
        if (typeof redrawTrack2Line === 'function') {
            redrawTrack2Line();
        }
        if (typeof sentieroMap !== 'undefined' && sentieroMap && returnCoords.length > 0) {
            sentieroMap.setView(returnCoords[0], 16);
        }
        const statusLbl = document.getElementById('track2-status-label');
        if (statusLbl) statusLbl.innerText = "Nuovo percorso di rientro avviato";
        alert("Nuovo percorso di rientro creato e avviato dal punto attuale verso la partenza.");
    }
}

function menuCercaPuntiInteresse2() {
    if (!isMenu2FeatureEnabled('poi', 'Cerca punti di interesse')) return;
    const lat = typeof sentieroCurrentLat !== 'undefined' ? sentieroCurrentLat : 43.5485;
    const lng = typeof sentieroCurrentLng !== 'undefined' ? sentieroCurrentLng : 10.3106;
    if (typeof sentieroMap !== 'undefined' && sentieroMap) {
        L.circle([lat, lng], {
            radius: 1500,
            color: '#4fc3f7',
            fillColor: '#4fc3f7',
            fillOpacity: 0.12
        }).addTo(sentieroMap);
        sentieroMap.setView([lat, lng], 14);
    }
    alert(`Ricerca punti di interesse (rifugi, sorgenti, aree sosta) entro 1,5 km da: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
}

function menuStradeInMontagna2() {
    if (!isMenu2FeatureEnabled('mountainRoads', 'Strade in montagna')) return;
    const lat = typeof sentieroCurrentLat !== 'undefined' ? sentieroCurrentLat : 43.5485;
    const lng = typeof sentieroCurrentLng !== 'undefined' ? sentieroCurrentLng : 10.3106;
    alert(`Modalità Strade in montagna attiva intorno a ${lat.toFixed(5)}, ${lng.toFixed(5)}: verifica pendenze, tornanti e viabilità sterrata.`);
}

function menuMeteo24Ore2() {
    if (!isMenu2FeatureEnabled('meteo24', 'Meteo 24')) return;
    const lat = typeof sentieroCurrentLat !== 'undefined' ? sentieroCurrentLat : 43.5485;
    const lng = typeof sentieroCurrentLng !== 'undefined' ? sentieroCurrentLng : 10.3106;
    alert(`Meteo 24 ore per coordinate ${lat.toFixed(4)}, ${lng.toFixed(4)}: controlla le previsioni locali prima di proseguire.`);
}

function richiediPasswordAdminMenu2() {
    const inserita = prompt("Inserisci la password per accedere alle impostazioni Licenza e Gemini:");
    if (inserita === null) return false;
    const pulita = inserita.trim().toUpperCase();
    if (!MENU2_ADMIN_PASSWORDS.includes(pulita)) {
        alert("Password non corretta.");
        return false;
    }
    return true;
}

function apriGestioneLicenzaDaMenu2() {
    if (!richiediPasswordAdminMenu2()) return;
    if (typeof mostraPannelloCambioChiave2 === 'function') {
        mostraPannelloCambioChiave2();
    } else {
        const panel = document.getElementById('license-panel');
        if (panel) panel.style.display = 'block';
    }
}

function apriPannelloGeminiProtetto2(focusField) {
    if (!richiediPasswordAdminMenu2()) return;
    const box = document.getElementById('gemini-admin-panel');
    if (box) box.style.display = 'block';
    loadGeminiConfigToInputs2();
    if (focusField === 'model') {
        const mInp = document.getElementById('gemini-model-input');
        if (mInp) mInp.focus();
    } else {
        const kInp = document.getElementById('gemini-api-key-input');
        if (kInp) kInp.focus();
    }
}

function mostraModelliGeminiDisponibili2() {
    if (!richiediPasswordAdminMenu2()) return;
    const box = document.getElementById('gemini-admin-panel');
    if (box) box.style.display = 'block';
    loadGeminiConfigToInputs2();
    const listBox = document.getElementById('gemini-models-list');
    if (listBox) {
        listBox.style.display = 'block';
        listBox.innerHTML = `
            <div style="font-size:12px; color:#ffd54f; margin-bottom:6px;">Modelli consigliati (clicca per selezionare):</div>
            <button type="button" onclick="selezionaModelloGemini2('gemini-2.5-flash')" style="display:block; width:100%; text-align:left; padding:7px; margin-bottom:5px; border-radius:6px; border:1px solid #555; background:#2a2a2a; color:#fff; cursor:pointer;">gemini-2.5-flash (rapido e versatile)</button>
            <button type="button" onclick="selezionaModelloGemini2('gemini-2.5-pro')" style="display:block; width:100%; text-align:left; padding:7px; margin-bottom:5px; border-radius:6px; border:1px solid #555; background:#2a2a2a; color:#fff; cursor:pointer;">gemini-2.5-pro (ragionamento approfondito)</button>
            <button type="button" onclick="selezionaModelloGemini2('gemini-2.5-flash-lite')" style="display:block; width:100%; text-align:left; padding:7px; border-radius:6px; border:1px solid #555; background:#2a2a2a; color:#fff; cursor:pointer;">gemini-2.5-flash-lite (leggero e veloce)</button>
        `;
    }
}

function selezionaModelloGemini2(nomeModello) {
    const mInp = document.getElementById('gemini-model-input');
    if (mInp) mInp.value = nomeModello;
}

function loadGeminiConfigToInputs2() {
    try {
        const raw = localStorage.getItem(MENU2_GEMINI_CONFIG_KEY);
        const cfg = raw ? JSON.parse(raw) : { apiKey: '', model: 'gemini-2.5-flash' };
        const kInp = document.getElementById('gemini-api-key-input');
        const mInp = document.getElementById('gemini-model-input');
        if (kInp) kInp.value = cfg.apiKey || '';
        if (mInp) mInp.value = cfg.model || 'gemini-2.5-flash';
    } catch (err) {
        console.warn("Errore lettura configurazione Gemini:", err);
    }
}

function salvaConfigurazioneGemini2() {
    const kInp = document.getElementById('gemini-api-key-input');
    const mInp = document.getElementById('gemini-model-input');
    const apiKey = kInp ? kInp.value.trim() : '';
    const model = (mInp ? mInp.value.trim() : '') || 'gemini-2.5-flash';

    localStorage.setItem(MENU2_GEMINI_CONFIG_KEY, JSON.stringify({ apiKey, model }));
    alert(`Configurazione Gemini salvata.\nModello attivo: ${model}`);
}
