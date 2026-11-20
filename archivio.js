const ARCHIVIO2_STORAGE_KEY = 'sentierovivo2_tracks';

function loadSavedTracks2() {
    try {
        const raw = localStorage.getItem(ARCHIVIO2_STORAGE_KEY) || '[]';
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.warn("Errore lettura percorsi salvati:", err);
        return [];
    }
}

function saveCurrentTrack2(trackName, folderName) {
    const cleanTitle = (trackName || '').trim() || 'Escursione 2.0';
    const cleanFolder = (folderName || '').trim() || (typeof getDefaultFolder2 === 'function' ? getDefaultFolder2() : 'Trekking');

    if (typeof saveDefaultFolder2 === 'function') {
        saveDefaultFolder2(cleanFolder);
    }

    const coords = typeof track2Coordinates !== 'undefined' ? track2Coordinates : [];
    const wps = typeof waypoint2List !== 'undefined' ? waypoint2List : [];
    const color = typeof track2Color !== 'undefined' ? track2Color : '#00bfff';

    const entry = {
        id: Date.now(),
        name: cleanTitle,
        folder: cleanFolder,
        date: new Date().toLocaleDateString('it-IT') + ' ' + new Date().toLocaleTimeString('it-IT').slice(0, 5),
        coordinates: coords,
        waypoints: wps,
        color: color
    };

    const list = loadSavedTracks2();
    list.push(entry);
    localStorage.setItem(ARCHIVIO2_STORAGE_KEY, JSON.stringify(list));

    if (typeof clearTrack2Draft === 'function') {
        clearTrack2Draft();
    }
    if (typeof clearWaypoints2Session === 'function') {
        clearWaypoints2Session();
    }
    if (typeof resetTrack2Session === 'function') {
        resetTrack2Session();
    }

    return { ok: true, track: entry };
}

function deleteSavedTrack2(trackId) {
    const updated = loadSavedTracks2().filter((item) => item.id !== trackId);
    localStorage.setItem(ARCHIVIO2_STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

function openSavedTrack2OnMap(trackId) {
    const track = loadSavedTracks2().find((item) => item.id === trackId);
    if (!track) return false;

    if (typeof clearWaypoints2Session === 'function') {
        clearWaypoints2Session();
    }
    if (typeof track2Polyline !== 'undefined' && track2Polyline && sentieroMap) {
        sentieroMap.removeLayer(track2Polyline);
        track2Polyline = null;
    }

    if (typeof track2Active !== 'undefined') track2Active = false;
    if (typeof track2Paused !== 'undefined') track2Paused = false;
    if (typeof track2Name !== 'undefined') track2Name = track.name || 'Percorso 2.0';
    if (typeof track2Color !== 'undefined') track2Color = track.color || '#00bfff';
    if (typeof track2Coordinates !== 'undefined') {
        track2Coordinates = Array.isArray(track.coordinates) ? track.coordinates : [];
        if (typeof redrawTrack2Line === 'function') {
            redrawTrack2Line();
        }
        if (track2Coordinates.length > 0 && sentieroMap) {
            sentieroMap.setView(track2Coordinates[0], 16);
        }
    }

    if (typeof waypoint2List !== 'undefined') {
        waypoint2List = Array.isArray(track.waypoints) ? track.waypoints : [];
        if (typeof renderAllWaypoints2OnMap === 'function') {
            renderAllWaypoints2OnMap();
        }
    }

    return true;
}
