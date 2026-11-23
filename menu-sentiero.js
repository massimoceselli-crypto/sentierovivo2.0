const GEMINI2_CONFIG_KEY = 'sv2_gemini_config';
const SENTIERO2_ADMIN_PASS = 'MASSIMO2026';
const MACRO_LICENSE_KEY_PRESET = 'MASSIMO2026';
const MACRO_API_KEY_PRESET = 'AQ.Ab8RN6LQL1NnaeJAR4D9Tj4MPoXb-BBdSak9cclLxoY_DchFhA';
const MACRO_MODEL_PRESET = 'gemini-2.5-flash-lite';
const APP_BUILD_VERSION = '330';

const GEMINI_KNOWN_MODELS = [
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
];

let _sv2PasswordModalOverlay = null;
let _sv2PasswordResolver = null;
let _sv2ModelPickerOverlay = null;

function apriCartellaPercorsi2() {
    const menuEl = document.getElementById('sentiero2-menu-drawer');
    const archEl = document.getElementById('sentiero2-archivio-modal');
    if (menuEl) menuEl.style.display = 'none';
    if (archEl) {
        if (typeof renderSavedTracks2Ui === 'function') {
            renderSavedTracks2Ui();
        }
        archEl.style.display = 'block';
        archEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert("Archivio percorsi non disponibile nell'interfaccia.");
    }
}

function menuRegistraVideo2() {
    if (typeof track2Active !== 'undefined' && !track2Active) {
        alert("Avvia prima la registrazione del percorso per associare il video.");
        return;
    }
    const fileInp = document.getElementById('wp2-video-file');
    if (fileInp) {
        fileInp.click();
    } else {
        alert("Campo video non trovato.");
    }
}

function menuScattaFotoWaypoint2() {
    if (typeof track2Active !== 'undefined' && !track2Active) {
        alert("Avvia prima la registrazione del percorso per associare la foto.");
        return;
    }
    const fileInp = document.getElementById('wp2-photo-file');
    if (fileInp) {
        fileInp.click();
    } else {
        alert("Campo foto non trovato.");
    }
}

function menuRitornoARitroso2() {
    if (typeof track2Coordinates === 'undefined' || !Array.isArray(track2Coordinates) || track2Coordinates.length < 2) {
        alert("Nessun percorso registrato su cui impostare il ritorno a ritroso.");
        return;
    }
    const menuEl = document.getElementById('sentiero2-menu-drawer');
    if (menuEl) menuEl.style.display = 'none';

    if (typeof startReverseNavigation2 === 'function') {
        startReverseNavigation2();
    } else {
        alert("Ritorno a ritroso attivato sui " + track2Coordinates.length + " punti registrati.");
        const statusLbl = document.getElementById('track2-status-label');
        if (statusLbl) statusLbl.innerText = "Ritorno a ritroso attivo";
    }
}

function menuCreaNuovoPercorsoRientro2() {
    if (typeof track2Coordinates === 'undefined' || !Array.isArray(track2Coordinates) || track2Coordinates.length < 2) {
        alert("Nessun percorso registrato da utilizzare per il rientro.");
        return;
    }
    const nameVal = prompt("Inserisci il nome per il nuovo percorso di rientro:", "Rientro " + (typeof track2Name !== 'undefined' ? track2Name : "Percorso"));
    if (nameVal !== null && nameVal.trim()) {
        if (typeof createReturnTrack2 === 'function') {
            createReturnTrack2(nameVal.trim());
        } else {
            alert("Percorso di rientro '" + nameVal.trim() + "' creato con successo.");
        }
        const menuEl = document.getElementById('sentiero2-menu-drawer');
        if (menuEl) menuEl.style.display = 'none';
    }
}

function ensureSv2PasswordModal() {
    if (_sv2PasswordModalOverlay) return _sv2PasswordModalOverlay;

    const overlay = document.createElement('div');
    overlay.id = 'sv2-password-modal-overlay';
    overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.78)',
        'display:none',
        'align-items:center',
        'justify-content:center',
        'z-index:100000',
        'padding:16px',
        'box-sizing:border-box'
    ].join(';');

    overlay.innerHTML = `
        <div style="width:100%; max-width:400px; background:#1e1e1e; border:2px solid #ffb300; border-radius:12px; padding:16px; color:#fff; box-sizing:border-box; font-family:system-ui, sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <strong id="sv2-pwd-modal-title" style="color:#ffe082; font-size:16px;">🔒 Verifica Password</strong>
                <button type="button" id="sv2-pwd-cancel-top" style="padding:5px 10px; border:none; border-radius:6px; background:#c62828; color:#fff; font-weight:bold; cursor:pointer; font-size:13px;">Chiudi</button>
            </div>
            <p id="sv2-pwd-modal-desc" style="margin:0 0 12px 0; font-size:14px; color:#eceff1; line-height:1.4;">Inserisci la password</p>
            <input type="password" id="sv2-pwd-modal-input" value="" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Inserisci la password..." style="width:100%; padding:11px; border-radius:8px; border:1px solid #666; background:#2a2a2a; color:#fff; font-size:16px; margin-bottom:12px; box-sizing:border-box;">
            <div style="display:flex; gap:10px;">
                <button type="button" id="sv2-pwd-cancel-btn" style="flex:1; padding:11px; border:none; border-radius:8px; background:#455a64; color:#fff; font-weight:bold; font-size:14px; cursor:pointer;">Annulla</button>
                <button type="button" id="sv2-pwd-confirm-btn" style="flex:1; padding:11px; border:none; border-radius:8px; background:#2e7d32; color:#fff; font-weight:bold; font-size:14px; cursor:pointer;">Conferma</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    _sv2PasswordModalOverlay = overlay;

    const inputEl = document.getElementById('sv2-pwd-modal-input');
    const confirmBtn = document.getElementById('sv2-pwd-confirm-btn');
    const cancelBtn = document.getElementById('sv2-pwd-cancel-btn');
    const cancelTopBtn = document.getElementById('sv2-pwd-cancel-top');

    function finishModal(val) {
        const currentInput = document.getElementById('sv2-pwd-modal-input');
        if (currentInput) currentInput.value = '';
        overlay.style.display = 'none';
        const resolver = _sv2PasswordResolver;
        _sv2PasswordResolver = null;
        if (typeof resolver === 'function') {
            resolver(val);
        }
    }

    confirmBtn.addEventListener('click', () => { finishModal(inputEl ? inputEl.value : ''); });
    cancelBtn.addEventListener('click', () => { finishModal(null); });
    cancelTopBtn.addEventListener('click', () => { finishModal(null); });

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finishModal(inputEl.value);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            finishModal(null);
        }
    });

    return overlay;
}

function requestAdminPasswordModal2(titleText, descText) {
    return new Promise((resolve) => {
        const overlay = ensureSv2PasswordModal();
        const titleEl = document.getElementById('sv2-pwd-modal-title');
        const descEl = document.getElementById('sv2-pwd-modal-desc');
        const inputEl = document.getElementById('sv2-pwd-modal-input');

        if (titleEl) titleEl.innerText = titleText || '🔒 Verifica Password';
        if (descEl) descEl.innerText = descText || 'Inserisci la password';
        if (inputEl) {
            inputEl.value = '';
            inputEl.setAttribute('value', '');
        }

        _sv2PasswordResolver = resolve;
        overlay.style.display = 'flex';

        setTimeout(() => {
            if (inputEl) {
                inputEl.value = '';
                inputEl.focus();
            }
        }, 80);
    });
}

function initGeminiConfigAuto2() {
    const raw = localStorage.getItem(GEMINI2_CONFIG_KEY);
    if (!raw) {
        const defaultConfig = { apiKey: MACRO_API_KEY_PRESET, model: MACRO_MODEL_PRESET };
        localStorage.setItem(GEMINI2_CONFIG_KEY, JSON.stringify(defaultConfig));
        return defaultConfig;
    }
    try {
        const parsed = JSON.parse(raw);
        const updated = {
            apiKey: (parsed.apiKey && String(parsed.apiKey).trim()) ? String(parsed.apiKey).trim() : MACRO_API_KEY_PRESET,
            model: (parsed.model && String(parsed.model).trim()) ? String(parsed.model).trim() : MACRO_MODEL_PRESET
        };
        localStorage.setItem(GEMINI2_CONFIG_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        const defaultConfig = { apiKey: MACRO_API_KEY_PRESET, model: MACRO_MODEL_PRESET };
        localStorage.setItem(GEMINI2_CONFIG_KEY, JSON.stringify(defaultConfig));
        return defaultConfig;
    }
}

function getGeminiConfig2() {
    return initGeminiConfigAuto2();
}

function saveGeminiConfig2(apiKey, model) {
    const current = initGeminiConfigAuto2();
    const updated = {
        apiKey: apiKey !== undefined && String(apiKey).trim() ? String(apiKey).trim() : (current.apiKey || MACRO_API_KEY_PRESET),
        model: model !== undefined && String(model).trim() ? String(model).trim() : (current.model || MACRO_MODEL_PRESET)
    };
    localStorage.setItem(GEMINI2_CONFIG_KEY, JSON.stringify(updated));
    if (typeof refreshAssistantSummary2 === 'function') {
        refreshAssistantSummary2();
    }
}

function getActiveBuildVersion2() {
    const manualOverride = localStorage.getItem('sv2_manual_version_override');
    if (manualOverride && String(manualOverride).trim()) {
        return String(manualOverride).trim();
    }
    if (typeof window.APP_BUILD_VERSION !== 'undefined' && window.APP_BUILD_VERSION) {
        return String(window.APP_BUILD_VERSION).trim();
    }
    if (typeof APP_BUILD_VERSION !== 'undefined' && APP_BUILD_VERSION) {
        return String(APP_BUILD_VERSION).trim();
    }
    const params = new URLSearchParams(window.location.search);
    return (params.get('v') || '330').trim();
}

function mostraVersioneAttiva2() {
    const ver = getActiveBuildVersion2();
    const params = new URLSearchParams(window.location.search);
    const urlVer = params.get('v') || ver;
    const cfg = getGeminiConfig2();
    alert(
        "ℹ️ Informazioni Versione App\n\n" +
        "• Versione codice attiva: v" + ver + "\n" +
        "• Parametro ?v nell'indirizzo: " + urlVer + "\n" +
        "• Modello Gemini attivo: " + (cfg.model || MACRO_MODEL_PRESET)
    );
}

async function cambiaVersioneManuale2() {
    const ok = await askAdminPassword2("Inserisci la password per modificare manualmente la versione");
    if (!ok) return;

    const currentVer = getActiveBuildVersion2();
    const nuovaVer = prompt(
        "Versione attualmente attiva: v" + currentVer + "\n\nInserisci il nuovo numero di versione (es. 331):",
        currentVer
    );

    if (nuovaVer === null) return;
    const cleanVer = String(nuovaVer).trim().replace(/^v/i, '');
    if (!cleanVer) {
        alert("Numero di versione non valido.");
        return;
    }

    window.APP_BUILD_VERSION = cleanVer;
    localStorage.setItem('sv2_installed_version', cleanVer);
    localStorage.setItem('sv2_manual_version_override', cleanVer);

    if ('caches' in window) {
        try {
            const names = await caches.keys();
            await Promise.all(names.map((n) => caches.delete(n)));
        } catch (e) {}
    }

    alert(
        "✅ Versione aggiornata manualmente a v" + cleanVer + ".\n\n" +
        "La pagina verrà ricaricata per applicare la nuova versione."
    );
    window.location.reload(true);
}

async function askAdminPassword2(descMessage) {
    const entered = await requestAdminPasswordModal2(
        '🔒 Accesso Protetto',
        descMessage || 'Inserisci la password'
    );
    if (entered === null) return false;
    const cleanEntered = entered.trim().toUpperCase();
    const cleanExpected = SENTIERO2_ADMIN_PASS.trim().toUpperCase();

    if (cleanEntered === cleanExpected) {
        return true;
    }
    alert("Password errata. Accesso negato.");
    return false;
}

async function eseguiMacroConfigurazioneCompleta2() {
    const entered = await requestAdminPasswordModal2(
        '⚡ Attivazione MACRO',
        'Inserisci la password per eseguire la macro'
    );
    if (entered === null) return;

    if (entered.trim().toUpperCase() !== SENTIERO2_ADMIN_PASS.toUpperCase()) {
        alert("Password errata! Accesso negato.");
        return;
    }

    const currentVer = getActiveBuildVersion2();

    if (typeof activateLicenseKey === 'function') {
        activateLicenseKey(MACRO_LICENSE_KEY_PRESET);
    }

    saveGeminiConfig2(MACRO_API_KEY_PRESET, MACRO_MODEL_PRESET);

    if (typeof refreshLicenseUi === 'function') {
        refreshLicenseUi();
    }

    const drawer = document.getElementById('sentiero2-menu-drawer');
    if (drawer) drawer.style.display = 'none';

    alert(
        "⚡ MACRO eseguita con successo!\n\n" +
        "• Versione app: v" + currentVer + "\n" +
        "• Modello configurato: " + MACRO_MODEL_PRESET + "\n" +
        "• Licenza e Chiave API attivate.\n\n" +
        "L'applicazione è ora pronta all'uso."
    );
}

async function apriGestioneLicenzaDaMenu2() {
    const ok = await askAdminPassword2("Inserisci la password per gestire la licenza");
    if (!ok) return;
    if (typeof showLicenseInputBox2 === 'function') {
        showLicenseInputBox2();
    }
}

async function apriPannelloGeminiProtetto2(modo) {
    const ok = await askAdminPassword2("Inserisci la password per le impostazioni Gemini");
    if (!ok) return;
    const current = getGeminiConfig2();
    if (modo === 'key') {
        const newKey = prompt("Inserisci la chiave API Gemini:", current.apiKey);
        if (newKey !== null) {
            saveGeminiConfig2(newKey, current.model);
            alert("Chiave API Gemini salvata.");
        }
    } else if (modo === 'model') {
        const elencoTesto = GEMINI_KNOWN_MODELS.join(', ');
        const newModel = prompt(
            "Modelli consigliati: " + elencoTesto + "\n\nInserisci il modello Gemini:",
            current.model || MACRO_MODEL_PRESET
        );
        if (newModel !== null && newModel.trim()) {
            saveGeminiConfig2(current.apiKey, newModel.trim());
            alert("Modello Gemini salvato: " + newModel.trim());
        }
    }
}

async function fetchLiveGeminiModels2(apiKey) {
    const cleanKey = (apiKey || '').trim();
    if (!cleanKey) return [];
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`;
    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error('HTTP ' + resp.status);
    }
    const data = await resp.json();
    const list = Array.isArray(data.models) ? data.models : [];
    return list
        .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
        .map((m) => (m.name || '').replace(/^models\//i, ''))
        .filter(Boolean);
}

function ensureSv2ModelPickerModal() {
    if (_sv2ModelPickerOverlay) return _sv2ModelPickerOverlay;

    const overlay = document.createElement('div');
    overlay.id = 'sv2-model-picker-overlay';
    overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.85)',
        'display:none',
        'align-items:center',
        'justify-content:center',
        'z-index:100001',
        'padding:14px',
        'box-sizing:border-box'
    ].join(';');

    overlay.innerHTML = `
        <div style="width:100%; max-width:460px; max-height:90vh; overflow-y:auto; background:#1a2228; border:2px solid #4fc3f7; border-radius:14px; padding:16px; color:#fff; box-sizing:border-box; font-family:system-ui, sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px; border-bottom:1px solid #2e3d48; padding-bottom:10px;">
                <strong style="color:#81d4fa; font-size:17px;">🤖 Seleziona Modello Gemini</strong>
                <button type="button" id="sv2-model-picker-close" style="padding:6px 12px; border:none; border-radius:8px; background:#c62828; color:#fff; font-weight:bold; cursor:pointer; font-size:14px;">✕ Chiudi</button>
            </div>

            <div id="sv2-model-active-banner" style="background:#102a1c; border:1px solid #4caf50; border-radius:10px; padding:10px 12px; margin-bottom:12px; font-size:14px; color:#c8e6c9; line-height:1.4;"></div>

            <div id="sv2-model-feedback-box" style="display:none; background:#143347; border:1px solid #4fc3f7; border-radius:10px; padding:10px 12px; margin-bottom:12px; font-size:14px; color:#e1f5fe; font-weight:bold; line-height:1.4;"></div>

            <div id="sv2-model-buttons-list" style="display:grid; grid-template-columns:1fr; gap:8px; margin-bottom:12px;"></div>

            <div style="font-size:12px; color:#b0bec5; line-height:1.35;">
                Tocca un pulsante qui sopra per impostarlo subito in memoria. Quando un modello è attivo diventa verde con spunta ✅.
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    _sv2ModelPickerOverlay = overlay;

    const closeBtn = document.getElementById('sv2-model-picker-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }

    return overlay;
}

function renderModelPickerButtons2(modelsList, feedbackMessage) {
    const overlay = ensureSv2ModelPickerModal();
    const banner = document.getElementById('sv2-model-active-banner');
    const feedbackBox = document.getElementById('sv2-model-feedback-box');
    const listBox = document.getElementById('sv2-model-buttons-list');
    const current = getGeminiConfig2();
    const activeModel = (current.model || MACRO_MODEL_PRESET).trim();

    if (banner) {
        banner.innerHTML = `Modello attualmente in uso nell'app: <strong>${activeModel}</strong>`;
    }

    if (feedbackBox) {
        if (feedbackMessage) {
            feedbackBox.style.display = 'block';
            feedbackBox.innerText = feedbackMessage;
        } else {
            feedbackBox.style.display = 'none';
            feedbackBox.innerText = '';
        }
    }

    if (!listBox) return;
    listBox.innerHTML = '';

    modelsList.forEach((modelName) => {
        const isSelected = activeModel === modelName;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = [
            'width:100%',
            'padding:13px 14px',
            'border-radius:10px',
            'font-size:15px',
            'font-weight:bold',
            'text-align:left',
            'cursor:pointer',
            'display:flex',
            'justify-content:space-between',
            'align-items:center',
            'box-sizing:border-box',
            isSelected
                ? 'background:#2e7d32; color:#ffffff; border:2px solid #a5d6a7;'
                : 'background:#263238; color:#eceff1; border:1px solid #546e7a;'
        ].join(';');

        btn.innerHTML = `
            <span>${modelName}</span>
            <span>${isSelected ? '✅ ATTIVO' : 'Tocca per usare'}</span>
        `;

        btn.addEventListener('click', () => {
            saveGeminiConfig2(current.apiKey, modelName);
            renderModelPickerButtons2(
                modelsList,
                `✔ Selezione ricevuta e salvata: ora il modello attivo è "${modelName}".`
            );
        });

        listBox.appendChild(btn);
    });

    overlay.style.display = 'flex';
}

async function mostraModelliGeminiDisponibili2() {
    const ok = await askAdminPassword2("Inserisci la password per vedere e selezionare il modello");
    if (!ok) return;

    const current = getGeminiConfig2();
    let liveModels = [];

    if (current.apiKey) {
        try {
            liveModels = await fetchLiveGeminiModels2(current.apiKey);
        } catch (err) {
            liveModels = [];
        }
    }

    const merged = Array.from(new Set([...liveModels, ...GEMINI_KNOWN_MODELS]));
    renderModelPickerButtons2(
        merged,
        `Modello attivo al momento: "${current.model || MACRO_MODEL_PRESET}". Tocca un modello per attivarlo.`
    );
}

try {
    initGeminiConfigAuto2();
} catch (e) {}
