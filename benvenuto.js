function renderWelcomeScreen(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const state = typeof initTrialAndLicense === 'function'
        ? initTrialAndLicense()
        : { status: 'trial', daysLeft: 30 };

    if (state.status === 'activated') {
        el.innerHTML = '';
        return;
    }

    const messaggioGiorni = state.status === 'expired'
        ? "I 30 giorni di prova sono terminati. Inserisci qui sotto la chiave di sblocco oppure contatta Massimo per riceverla."
        : `Hai a disposizione 30 giorni di prova gratuita (giorni residui: ${state.daysLeft}). Se hai già la chiave di sblocco, inseriscila qui sotto oppure contatta Massimo.`;

    el.innerHTML = `
        <div style="max-width:520px; margin:12px auto; background:#1e1e1e; color:#ffffff; padding:18px; border-radius:14px; border:2px solid #2e7d32; font-family:system-ui, sans-serif;">
            <h2 style="margin:0 0 8px 0; color:#66bb6a; font-size:20px;">Benvenuto in SentieroVivo 2.0</h2>
            <p style="margin:0 0 12px 0; line-height:1.45; font-size:14px; color:#e0e0e0;">
                Applicazione per la registrazione delle tracce, waypoint e sicurezza sul percorso. ${messaggioGiorni}
            </p>
            <div style="background:#262626; padding:12px; border-radius:10px; border:1px solid #444;">
                <label for="welcome-license-input" style="display:block; font-size:13px; font-weight:bold; color:#ffd54f; margin-bottom:6px;">
                    Hai già la password / chiave di sblocco? Inseriscila qui:
                </label>
                <input id="welcome-license-input" type="text" placeholder="Inserisci password o chiave di sblocco..." style="width:100%; padding:10px; border-radius:8px; border:1px solid #666; background:#141414; color:#ffffff; font-size:14px; margin-bottom:10px; box-sizing:border-box;">
                <button type="button" onclick="handleWelcomeUnlock2()" style="width:100%; padding:11px; border:none; border-radius:8px; background:#2e7d32; color:#ffffff; font-weight:bold; font-size:14px; cursor:pointer;">
                    Sblocca SentieroVivo 2.0
                </button>
            </div>
        </div>
    `;
}
