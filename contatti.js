const SOS2_KEYS = {
    configured: 'sentierovivo2_sos_configured',
    userName: 'sentierovivo2_sos_name',
    c1: 'sentierovivo2_sos_c1',
    c2: 'sentierovivo2_sos_c2',
    c3: 'sentierovivo2_sos_c3'
};

function isSos2Configured() {
    return localStorage.getItem(SOS2_KEYS.configured) === 'true';
}

function getSos2Contacts() {
    return {
        userName: localStorage.getItem(SOS2_KEYS.userName) || '',
        c1: localStorage.getItem(SOS2_KEYS.c1) || '',
        c2: localStorage.getItem(SOS2_KEYS.c2) || '',
        c3: localStorage.getItem(SOS2_KEYS.c3) || ''
    };
}

function saveSos2Contacts(userName, c1, c2 = '', c3 = '') {
    const cleanName = (userName || '').trim();
    const cleanC1 = (c1 || '').trim();
    if (!cleanName || !cleanC1) {
        return { ok: false, message: "Inserisci almeno il tuo nome e il primo contatto." };
    }

    localStorage.setItem(SOS2_KEYS.userName, cleanName);
    localStorage.setItem(SOS2_KEYS.c1, cleanC1);
    localStorage.setItem(SOS2_KEYS.c2, (c2 || '').trim());
    localStorage.setItem(SOS2_KEYS.c3, (c3 || '').trim());
    localStorage.setItem(SOS2_KEYS.configured, 'true');

    return { ok: true, message: "Contatti S.O.S. salvati." };
}

function buildSos2Message(lat, lng) {
    const contacts = getSos2Contacts();
    const sender = contacts.userName || 'Escursionista';
    const coords = `Lat: ${Number(lat).toFixed(5)}, Lng: ${Number(lng).toFixed(5)}`;
    const link = `https://maps.google.com/?q=${lat},${lng}`;
    return `SONO ${sender.toUpperCase()}. HO BISOGNO DI AIUTO! Coordinate: ${coords}. Mappa: ${link}`;
}

function openSos2Sms(lat, lng) {
    const contacts = getSos2Contacts();
    const recipients = [contacts.c1, contacts.c2, contacts.c3].filter(Boolean).join(',');
    const body = encodeURIComponent(buildSos2Message(lat, lng));
    window.location.href = recipients ? `sms:${recipients}?body=${body}` : `sms:?body=${body}`;
}
