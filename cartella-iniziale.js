const CARTELLA2_KEYS = {
    configured: 'sentierovivo2_setup_done',
    defaultFolder: 'sentierovivo2_default_folder',
    tracksList: 'sentierovivo2_tracks'
};

function isCartella2Configured() {
    return localStorage.getItem(CARTELLA2_KEYS.configured) === 'true';
}

function getDefaultFolder2() {
    return localStorage.getItem(CARTELLA2_KEYS.defaultFolder) || 'Trekking';
}

function saveDefaultFolder2(folderName) {
    const cleanName = (folderName || '').trim() || 'Trekking';
    localStorage.setItem(CARTELLA2_KEYS.defaultFolder, cleanName);
    localStorage.setItem(CARTELLA2_KEYS.configured, 'true');

    if (!localStorage.getItem(CARTELLA2_KEYS.tracksList)) {
        localStorage.setItem(CARTELLA2_KEYS.tracksList, JSON.stringify([]));
    }

    return cleanName;
}

function getKnownFolders2() {
    const folderSet = new Set([getDefaultFolder2()]);
    try {
        const tracks = JSON.parse(localStorage.getItem(CARTELLA2_KEYS.tracksList) || '[]');
        if (Array.isArray(tracks)) {
            tracks.forEach((tr) => {
                if (tr && tr.folder && String(tr.folder).trim()) {
                    folderSet.add(String(tr.folder).trim());
                }
            });
        }
    } catch (err) {
        console.warn("Errore lettura cartelle salvate:", err);
    }
    return Array.from(folderSet);
}
