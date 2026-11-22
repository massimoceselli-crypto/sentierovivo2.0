const LICENZA2_STORAGE_KEY = 'sentierovivo2_license_state';
const LICENZA2_TRIAL_DAYS = 30;
const LICENZA2_VALID_KEYS = [
    'SENTIEROVIP2026',
    'MASSIMOMASTER2026',
    'SENTIEROVIP',
    'MASSIMO2026',
    'SENTIERO2026'
];

function getTodayDateString2() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function initTrialAndLicense() {
    const todayStr = getTodayDateString2();
    const raw = localStorage.getItem(LICENZA2_STORAGE_KEY);

    if (!raw) {
        const initial = {
            startDate: todayStr,
            lastSeenDate: todayStr,
            activated: false,
            activeKey: ''
        };
        localStorage.setItem(LICENZA2_STORAGE_KEY, JSON.stringify(initial));
        return { status: 'trial', daysLeft: LICENZA2_TRIAL_DAYS };
    }

    const data = JSON.parse(raw);

    if (data.activated) {
        return { status: 'activated', daysLeft: 999, activeKey: data.activeKey || '' };
    }

    if (data.lastSeenDate && todayStr < data.lastSeenDate) {
        return { status: 'tampered', daysLeft: 0 };
    }

    data.lastSeenDate = todayStr;
    localStorage.setItem(LICENZA2_STORAGE_KEY, JSON.stringify(data));

    const start = new Date(data.startDate + 'T00:00:00');
    const now = new Date(todayStr + 'T00:00:00');
    const elapsedDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const daysLeft = LICENZA2_TRIAL_DAYS - elapsedDays;

    if (daysLeft <= 0) {
        return { status: 'expired', daysLeft: 0 };
    }

    return { status: 'trial', daysLeft };
}

function activateLicenseKey(codeInput) {
    const cleaned = (codeInput || '').trim().toUpperCase();
    if (!LICENZA2_VALID_KEYS.includes(cleaned)) {
        return false;
    }
    const todayStr = getTodayDateString2();
    const current = {
        startDate: todayStr,
        lastSeenDate: todayStr,
        activated: true,
        activeKey: cleaned
    };
    localStorage.setItem(LICENZA2_STORAGE_KEY, JSON.stringify(current));
    return true;
}

function resetLicenseState2() {
    localStorage.removeItem(LICENZA2_STORAGE_KEY);
}

function handleLicenseSubmit() {
    const inputEl = document.getElementById('license-code-input');
    const statusEl = document.getElementById('license-status-text');
    const panelEl = document.getElementById('license-panel');
    const code = inputEl ? inputEl.value : '';

    if (activateLicenseKey(code)) {
        const clean = String(code).trim().toUpperCase();
        if (statusEl) {
            statusEl.innerText = "Licenza attivata (" + clean + ").";
        }
        alert("Licenza attivata con successo (" + clean + ")!");
        if (panelEl) {
            panelEl.style.display = 'none';
        }
        if (typeof refreshLicenseUi === 'function') {
            refreshLicenseUi();
        }
    } else {
        if (statusEl) {
            statusEl.innerText = "Codice non valido. Usa ad esempio SENTIEROVIP2026 o MASSIMOMASTER2026.";
        }
        alert("Codice di licenza non valido.");
    }
}
