const BENVENUTO_CONFIG = {
    appName: "SentieroVivo 2.0",
    trialDays: 30,
    creatorContact: "Contatta Massimo Ceselli per richiedere il codice di attivazione."
};

function getWelcomeMessageData() {
    const installDate = parseInt(localStorage.getItem('sentierovivo2_install') || Date.now(), 10);
    const msPerDay = 24 * 60 * 60 * 1000;
    const elapsedDays = Math.floor((Date.now() - installDate) / msPerDay);
    const daysLeft = Math.max(0, BENVENUTO_CONFIG.trialDays - elapsedDays);
    const isActivated = localStorage.getItem('sentierovivo2_activated') === 'true';

    return {
        title: `Benvenuto in ${BENVENUTO_CONFIG.appName}`,
        description:
            "Applicazione per la registrazione di percorsi, waypoint, note vocali, foto, video e supporto alle escursioni e agli spostamenti.",
        trialNotice: isActivated
            ? "Licenza attiva: l'applicazione è sbloccata su questo dispositivo."
            : `Hai la possibilità di consultare e provare questa app entro i prossimi ${BENVENUTO_CONFIG.trialDays} giorni (giorni residui: ${daysLeft}). Al termine del periodo di prova, per continuare ad utilizzarla dovrai contattare la persona che ha creato questa app.`,
        contactInfo: BENVENUTO_CONFIG.creatorContact
    };
}

function renderWelcomeScreen(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = getWelcomeMessageData();
    container.innerHTML = `
        <div style="background:#1e1e1e; color:#ffffff; border:2px solid #2e7d32; border-radius:14px; padding:20px; max-width:460px; margin:20px auto; line-height:1.5;">
            <h2 style="margin-bottom:10px; color:#66bb6a;">${data.title}</h2>
            <p style="margin-bottom:12px; font-size:15px;">${data.description}</p>
            <p style="margin-bottom:12px; font-size:14px; color:#ffd54f; font-weight:bold;">${data.trialNotice}</p>
            <p style="font-size:13px; color:#cccccc;">${data.contactInfo}</p>
        </div>
    `;
}
