const GEMINI2_CONFIG_KEY = 'sv2_gemini_config';
const SENTIERO2_ADMIN_PASS = 'MASSIMO2026';
const MACRO_LICENSE_KEY_PRESET = 'MASSIMO2026';
const MACRO_API_KEY_PRESET = 'AQ.Ab8RN6LQL1NnaeJAR4D9Tj4MPoXb-BBdSak9cclLxoY_DchFhA';
const MACRO_MODEL_PRESET = 'Gemini-3.5-flash-lite';

function getGeminiConfig2() {
    const raw = localStorage.getItem(GEMINI2_CONFIG_KEY);
    if (!raw) {
        return { apiKey: '', model: MACRO_MODEL_PRESET };
    }
    try {
        const parsed = JSON.parse(raw);
        return {
            apiKey: parsed.apiKey || '',
            model: parsed.model || MACRO_MODEL_PRESET
        };
    } catch (e) {
        return { apiKey: '', model: MACRO_MODEL_PRESET };
    }
}

function saveGeminiConfig2(apiKey, model) {
    const current = getGeminiConfig2();
    const updated = {
        apiKey: apiKey !== undefined ? apiKey.trim() : current.apiKey,
        model: model !== undefined ? model.trim() : current.model
    };
    localStorage.setItem(GEMINI2_CONFIG_KEY, JSON.stringify(updated));
}

function askAdminPassword2(promptMessage) {
    const entered = prompt(promptMessage || "Inserisci la password principale (MASSIMO2026):");
    if (entered === null) return false;
    const cleanEntered = entered.trim().toUpperCase();
    const cleanExpected = SENTIERO2_ADMIN_PASS.trim().toUpperCase();

    if (cleanEntered === cleanExpected) {
        return true;
    }
    alert("Password errata. Accesso negato.");
    return false;
}

function eseguiMacroConfigurazioneCompleta2() {
    let entered = prompt("Inserisci la password principale (MASSIMO2026) per attivare la MACRO:");
    if (entered === null) return;
    
    if (entered.trim().toUpperCase() !== SENTIERO2_ADMIN_PASS) {
        alert("Password errata! Accesso negato.");
        return;
    }

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
        "• Licenza attivata: " + MACRO_LICENSE_KEY_PRESET + "\n" +
        "• API Key Gemini: configurata\n" +
        "• Modello Gemini: " + MACRO_MODEL_PRESET + "\n\n" +
        "L'applicazione è ora pronta all'uso."
    );
}

function apriGestioneLicenzaDaMenu2() {
    if (!askAdminPassword2("Inserisci la password principale (MASSIMO2026) per gestire la licenza:")) {
        return;
    }
    if (typeof showLicenseInputBox2 === 'function') {
        showLicenseInputBox2();
    }
}

function apriPannelloGeminiProtetto2(modo) {
    if (!askAdminPassword2("Inserisci la password principale (MASSIMO2026) per le impostazioni Gemini:")) {
        return;
    }
    const current = getGeminiConfig2();
    if (modo === 'key') {
        const newKey = prompt("Inserisci la chiave API Gemini:", current.apiKey);
        if (newKey !== null) {
            saveGeminiConfig2(newKey, current.model);
            alert("Chiave API Gemini salvata.");
        }
    } else if (modo === 'model') {
        const newModel = prompt("Inserisci il modello Gemini:", current.model);
        if (newModel !== null) {
            saveGeminiConfig2(current.apiKey, newModel);
            alert("Modello Gemini salvato: " + newModel);
        }
    }
}

function mostraModelliGeminiDisponibili2() {
    if (!askAdminPassword2("Inserisci la password principale (MASSIMO2026) per vedere i modelli:")) {
        return;
    }
    alert("Modello configurato:\n- Gemini-3.5-flash-lite");
}
