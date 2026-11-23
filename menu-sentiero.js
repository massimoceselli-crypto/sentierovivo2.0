const GEMINI2_CONFIG_KEY = 'sv2_gemini_config';
const SENTIERO2_ADMIN_PASS = 'MASSIMO2026';
const MACRO_LICENSE_KEY_PRESET = 'MASSIMO2026';
const MACRO_API_KEY_PRESET = 'AQ.Ab8RN6LQL1NnaeJAR4D9Tj4MPoXb-BBdSak9cclLxoY_DchFhA';
const MACRO_MODEL_PRESET = 'gemini-1.5-flash';

let _sv2PasswordModalOverlay = null;
let _sv2PasswordResolver = null;

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

    confirmBtn.addEventListener('click', () => {
        finishModal(inputEl ? inputEl.value : '');
    });

    cancelBtn.addEventListener('click', () => {
        finishModal(null);
    });

    cancelTopBtn.addEventListener('click', () => {
        finishModal(null);
    });

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
        const newModel = prompt("Inserisci il modello Gemini:", current.model);
        if (newModel !== null) {
            saveGeminiConfig2(current.apiKey, newModel);
            alert("Modello Gemini salvato: " + newModel);
        }
    }
}

async function mostraModelliGeminiDisponibili2() {
    const ok = await askAdminPassword2("Inserisci la password per vedere i modelli");
    if (!ok) return;
    alert("Modello configurato:\n- gemini-1.5-flash");
}
