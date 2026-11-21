const MENU2_TOGGLES_KEY = 'sentierovivo2_menu_toggles';
const MENU2_GEMINI_CONFIG_KEY = 'sentierovivo2_gemini_config';
const MENU2_ADMIN_PASSWORDS = ['MASSIMO2026', 'MASSIMOMASTER2026', 'SENTIEROVIP', 'SENTIERO2026'];

const MENU2_FALLBACK_GEMINI_MODELS = [
    { id: 'gemini-2.5-flash', label: 'gemini-2.5-flash (rapido e versatile)' },
    { id: 'gemini-2.5-pro', label: 'gemini-2.5-pro (ragionamento approfondito)' },
    { id: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite (leggero e veloce)' }
];

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
    const inserita = prompt("Inserisci la password (es. Massimo2026):");
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

function assicuraPannelloGeminiEsistente2() {
    let box = document.getElementById('gemini-admin-panel');
    if (box) {
        box.style.zIndex = '10000';
        return box;
    }

    box = document.createElement('div');
    box.id = 'gemini-admin-panel';
    box.className = 'sv2-fullscreen-drawer';
    box.style.cssText = 'background:#16202a; display:none; z-index:10000;';
    box.innerHTML = `
        <div style="max-width:620px; margin:0 auto; padding-bottom:40px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #37474f; padding-bottom:10px;">
                <h2 style="margin:0; color:#80cbc4; font-size:20px;">⚙️ Configurazione Gemini</h2>
                <button type="button" onclick="chiudiPannelloGemini2()" style="padding:8px 14px; border:none; border-radius:8px; background:#c62828; color:#fff; font-weight:bold; cursor:pointer;">✕ Chiudi</button>
            </div>

            <label for="gemini-api-key-input" style="display:block; margin-bottom:6px; font-weight:bold; color:#e0f2f1;">Chiave API Gemini attuale / nuova:</label>
            <input id="gemini-api-key-input" type="text" placeholder="Incolla qui la chiave API Gemini..." style="width:100%; padding:11px; border-radius:8px; border:1px solid #546e7a; background:#263238; color:#fff; margin-bottom:14px; box-sizing:border-box; font-size:15px;">

            <label for="gemini-model-input" style="display:block; margin-bottom:6px; font-weight:bold; color:#e0f2f1;">Modello Gemini:</label>
            <input id="gemini-model-input" type="text" placeholder="es. gemini-2.5-flash" style="width:100%; padding:11px; border-radius:8px; border:1px solid #546e7a; background:#263238; color:#fff; margin-bottom:12px; box-sizing:border-box; font-size:15px;">

            <div id="gemini-models-list" style="display:none; margin-bottom:14px;"></div>

            <button type="button" onclick="salvaConfigurazioneGemini2()" style="width:100%; padding:12px; border:none; border-radius:8px; background:#2e7d32; color:#fff; font-weight:bold; font-size:15px; cursor:pointer;">💾 Salva configurazione Gemini</button>
        </div>
    `;
    document.body.appendChild(box);
    return box;
}

function chiudiPannelloGemini2() {
    const box = document.getElementById('gemini-admin-panel');
    if (box) box.style.display = 'none';
}

function apriPannelloGeminiProtetto2(focusField) {
    if (!richiediPasswordAdminMenu2()) return;
    const box = assicuraPannelloGeminiEsistente2();
    box.style.display = 'block';
    box.scrollTop = 0;
    loadGeminiConfigToInputs2();
    if (focusField === 'model') {
        const mInp = document.getElementById('gemini-model-input');
        if (mInp) mInp.focus();
    } else {
        const kInp = document.getElementById('gemini-api-key-input');
        if (kInp) kInp.focus();
    }
}

function renderGeminiModelsButtons2(modelsArray, intestazione) {
    const listBox = document.getElementById('gemini-models-list');
    if (!listBox) return;
    listBox.style.display = 'block';

    const buttonsHtml = modelsArray.map((m) => {
        const safeId = String(m.id || '').replace(/'/g, "\\'");
        const safeLabel = String(m.label || m.id || '');
        return `<button type="button" onclick="selezionaModelloGemini2('${safeId}')" style="display:block; width:100%; text-align:left; padding:8px 10px; margin-bottom:6px; border-radius:6px; border:1px solid #546e7a; background:#263238; color:#fff; font-size:14px; cursor:pointer;">${safeLabel}</button>`;
    }).join('');

    listBox.innerHTML = `
        <div style="font-size:13px; color:#ffd54f; font-weight:bold; margin-bottom:8px;">${intestazione}</div>
        <div style="max-height:260px; overflow-y:auto; padding-right:4px;">${buttonsHtml}</div>
    `;
}

async function mostraModelliGeminiDisponibili2() {
    if (!richiediPasswordAdminMenu2()) return;
    const box = assicuraPannelloGeminiEsistente2();
    box.style.display = 'block';
    box.scrollTop = 0;
    loadGeminiConfigToInputs2();

    const listBox = document.getElementById('gemini-models-list');
    const kInp = document.getElementById('gemini-api-key-input');
    const apiKey = (kInp && kInp.value.trim()) || getGeminiConfig2().apiKey;

    if (!apiKey) {
        renderGeminiModelsButtons2(
            MENU2_FALLBACK_GEMINI_MODELS,
            'Nessuna chiave API salvata: ecco i modelli predefiniti (clicca per selezionare):'
        );
        return;
    }

    if (listBox) {
        listBox.style.display = 'block';
        listBox.innerHTML = `<div style="font-size:13px; color:#80cbc4; padding:8px;">⏳ Recupero elenco modelli da Gemini in corso...</div>`;
    }

    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}`);
        }
        const data = await resp.json();
        const rawModels = Array.isArray(data.models) ? data.models : [];

        const filtered = rawModels
            .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
            .map((m) => {
                const shortId = String(m.name || '').replace(/^models\//, '');
                const disp = m.displayName ? `${shortId} — ${m.displayName}` : shortId;
                return { id: shortId, label: disp };
            })
            .filter((m) => !!m.id);

        if (filtered.length > 0) {
            renderGeminiModelsButtons2(
                filtered,
                `Modelli Gemini disponibili per la tua chiave (${filtered.length} trovati — clicca per selezionare):`
            );
        } else {
            renderGeminiModelsButtons2(
                MENU2_FALLBACK_GEMINI_MODELS,
                'Elenco vuoto restituito: mostrati i modelli predefiniti (clicca per selezionare):'
            );
        }
    } catch (err) {
        renderGeminiModelsButtons2(
            MENU2_FALLBACK_GEMINI_MODELS,
            'Impossibile leggere l’elenco in tempo reale: mostrati i modelli predefiniti (clicca per selezionare):'
        );
    }
}

function selezionaModelloGemini2(nomeModello) {
    const mInp = document.getElementById('gemini-model-input');
    if (mInp) mInp.value = nomeModello;
}

function getGeminiConfig2() {
    try {
        const raw = localStorage.getItem(MENU2_GEMINI_CONFIG_KEY);
        if (!raw) return { apiKey: '', model: 'gemini-2.5-flash' };
        const parsed = JSON.parse(raw);
        return {
            apiKey: (parsed.apiKey || '').trim(),
            model: (parsed.model || '').trim() || 'gemini-2.5-flash'
        };
    } catch (err) {
        return { apiKey: '', model: 'gemini-2.5-flash' };
    }
}

function loadGeminiConfigToInputs2() {
    try {
        const cfg = getGeminiConfig2();
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
    chiudiPannelloGemini2();
}
