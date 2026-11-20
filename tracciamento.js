const TRACCIAMENTO2_DRAFT_KEY = 'sentierovivo2_single_draft';

let track2Active = false;
let track2Paused = false;
let track2Name = '';
let track2Color = '#00bfff';
let track2StartPoint = null;
let track2Coordinates = [];
let track2Polyline = null;

function redrawTrack2Line() {
    if (!sentieroMap) return;
    if (track2Polyline) {
        sentieroMap.removeLayer(track2Polyline);
        track2Polyline = null;
    }
    if (track2Coordinates.length > 1) {
        track2Polyline = L.polyline(track2Coordinates, {
            color: track2Color,
            weight: 7,
            opacity: 0.95
        }).addTo(sentieroMap);
    }
}

function startTrack2(nameInput) {
    const cleanName = (nameInput || '').trim() || 'Percorso 2.0';
    clearTrack2Draft();

    if (track2Polyline && sentieroMap) {
        sentieroMap.removeLayer(track2Polyline);
        track2Polyline = null;
    }

    track2Active = true;
    track2Paused = false;
    track2Name = cleanName;
    track2Color = '#00bfff';
    track2StartPoint = [sentieroCurrentLat, sentieroCurrentLng];
    track2Coordinates = [[sentieroCurrentLat, sentieroCurrentLng]];

    if (sentieroMap) {
        sentieroMap.setView(track2StartPoint, 16);
    }

    if (typeof resetAutoWaypointTimer2 === 'function') {
        resetAutoWaypointTimer2();
    }

    return { ok: true, name: track2Name };
}

function togglePauseTrack2() {
    if (!track2Active) {
        return { ok: false, paused: false, message: "Nessun percorso attivo." };
    }
    track2Paused = !track2Paused;
    if (!track2Paused && typeof resetAutoWaypointTimer2 === 'function') {
        resetAutoWaypointTimer2();
    }
    return {
        ok: true,
        paused: track2Paused,
        message: track2Paused ? "Registrazione in pausa." : "Registrazione ripresa."
    };
}

function recordTrack2Point(lat, lng) {
    if (!track2Active || track2Paused) return;
    track2Coordinates.push([lat, lng]);
    redrawTrack2Line();
    if (typeof checkMissedAutoWaypoint2 === 'function') {
        checkMissedAutoWaypoint2();
    }
}

function saveTrack2Draft() {
    if (!track2Active) return;
    try {
        const draft = {
            active: true,
            paused: track2Paused,
            name: track2Name || 'Percorso 2.0',
            color: track2Color,
            startPoint: track2StartPoint,
            coordinates: track2Coordinates,
            waypoints: typeof waypoint2List !== 'undefined' ? waypoint2List : [],
            lastAutoWpTime: typeof lastAutoWp2Time !== 'undefined' ? lastAutoWp2Time : Date.now(),
            savedAt: Date.now()
        };
        localStorage.setItem(TRACCIAMENTO2_DRAFT_KEY, JSON.stringify(draft));
    } catch (err) {
        console.warn("Salvataggio bozza non riuscito:", err);
    }
}

function clearTrack2Draft() {
    localStorage.removeItem(TRACCIAMENTO2_DRAFT_KEY);
}

function restoreTrack2DraftIfPresent() {
    const raw = localStorage.getItem(TRACCIAMENTO2_DRAFT_KEY);
    if (!raw) return false;

    try {
        const draft = JSON.parse(raw);
        if (!draft || !draft.active || !Array.isArray(draft.coordinates) || draft.coordinates.length === 0) {
            return false;
        }

        const riprendi = confirm(
            `Trovata una bozza di "${draft.name}". Vuoi ripristinare il tracciamento in corso?`
        );

        if (!riprendi) {
            clearTrack2Draft();
            return false;
        }

        track2Active = true;
        track2Paused = !!draft.paused;
        track2Name = draft.name || 'Percorso 2.0';
        track2Color = draft.color || '#00bfff';
        track2StartPoint = draft.startPoint || draft.coordinates[0];
        track2Coordinates = draft.coordinates;

        redrawTrack2Line();

        if (typeof waypoint2List !== 'undefined' && Array.isArray(draft.waypoints)) {
            waypoint2List = draft.waypoints;
            if (typeof renderAllWaypoints2OnMap === 'function') {
                renderAllWaypoints2OnMap();
            }
        }

        if (typeof lastAutoWp2Time !== 'undefined') {
            lastAutoWp2Time = draft.lastAutoWpTime || Date.now();
            if (typeof startAutoWaypointTimer2 === 'function') {
                startAutoWaypointTimer2();
            }
            if (typeof checkMissedAutoWaypoint2 === 'function') {
                checkMissedAutoWaypoint2();
            }
        }

        const lastPt = track2Coordinates[track2Coordinates.length - 1];
        if (lastPt && sentieroMap) {
            sentieroMap.setView(lastPt, 16);
        }

        return true;
    } catch (err) {
        clearTrack2Draft();
        return false;
    }
}

function resetTrack2Session() {
    track2Active = false;
    track2Paused = false;
    track2Name = '';
    track2StartPoint = null;
    track2Coordinates = [];
    if (track2Polyline && sentieroMap) {
        sentieroMap.removeLayer(track2Polyline);
        track2Polyline = null;
    }
    clearTrack2Draft();
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        saveTrack2Draft();
    } else if (typeof checkMissedAutoWaypoint2 === 'function') {
        checkMissedAutoWaypoint2();
    }
});

window.addEventListener('pagehide', () => {
    saveTrack2Draft();
});
