function cambiaChiaveLicenza2(nuovaChiave) {
    const pulita = (nuovaChiave || '').trim().toUpperCase();
    if (!pulita) {
        return { ok: false, message: "Inserisci una chiave valida." };
    }
    if (typeof LICENZA2_VALID_KEYS !== 'undefined' && !LICENZA2_VALID_KEYS.includes(pulita)) {
        return { ok: false, message: "Chiave non riconosciuta nell'elenco autorizzato." };
    }
    if (typeof resetLicenseState2 === 'function') {
        resetLicenseState2();
    }
    if (typeof activateLicenseKey === 'function' && activateLicenseKey(pulita)) {
        return { ok: true, message: "Chiave aggiornata a: " + pulita };
    }
    return { ok: false, message: "Impossibile aggiornare la chiave." };
}

function mostraPannelloCambioChiave2() {
    const panel = document.getElementById('license-panel');
    const statusText = document.getElementById('license-status-text');
    const input = document.getElementById('license-code-input');
    if (panel) panel.style.display = 'block';
    if (statusText) statusText.innerText = "Inserisci la tua Master Key (MASSIMOMASTER2026) per aggiornare la chiave attiva:";
    if (input) {
        input.value = "";
        input.focus();
    }
}
