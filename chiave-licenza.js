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
    const menuEl = document.getElementById('sentiero2-menu-drawer');
    if (menuEl) menuEl.style.display = 'none';

    const panel = document.getElementById('license-panel');
    const statusText = document.getElementById('license-status-text');
    const input = document.getElementById('license-code-input');
    if (panel) {
        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (statusText) {
        statusText.innerText = "Password verificata. Inserisci il codice di licenza:";
    }
    if (input) {
        input.value = "";
        setTimeout(() => input.focus(), 120);
    }
}
