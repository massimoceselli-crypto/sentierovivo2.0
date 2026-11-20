const WAYPOINT2_INTERVAL_MS = 3 * 60 * 1000;

let waypoint2List = [];
let waypoint2Markers = [];
let waypoint2TimerId = null;
let lastAutoWp2Time = 0;

function resetAutoWaypointTimer2() {
    lastAutoWp2Time = Date.now();
    startAutoWaypointTimer2();
}

function startAutoWaypointTimer2() {
    if (waypoint2TimerId) {
        clearInterval(waypoint2TimerId);
        waypoint2TimerId = null;
    }
    if (!lastAutoWp2Time) {
        lastAutoWp2Time = Date.now();
    }
    waypoint2TimerId = setInterval(() => {
        if (typeof track2Active !== 'undefined' && track2Active && !track2Paused) {
            addAutoWaypoint2();
            lastAutoWp2Time = Date.now();
        }
    }, WAYPOINT2_INTERVAL_MS);
}

function checkMissedAutoWaypoint2() {
    if (typeof track2Active === 'undefined' || !track2Active || track2Paused || !lastAutoWp2Time) {
        return;
    }
    const now = Date.now();
    if (now - lastAutoWp2Time >= WAYPOINT2_INTERVAL_MS) {
        addAutoWaypoint2();
        lastAutoWp2Time = now;
    }
}

function getDisplayLatLngForWaypoint2(wp, allWaypoints, currentIdx) {
    const baseLat = wp.latlng[0];
    const baseLng = wp.latlng[1];
    const clusterIndices = [];

    for (let i = 0; i < allWaypoints.length; i++) {
        const other = allWaypoints[i];
        if (!other || !Array.isArray(other.latlng)) continue;
        if (Math.abs(other.latlng[0] - baseLat) < 0.00002 && Math.abs(other.latlng[1] - baseLng) < 0.00002) {
            clusterIndices.push(i);
        }
    }

    if (clusterIndices.length <= 1) {
        return [baseLat, baseLng];
    }

    const posInCluster = clusterIndices.indexOf(currentIdx);
    const totalInCluster = clusterIndices.length;
    const angle = (2 * Math.PI * posInCluster) / totalInCluster;
    const radiusDeg = 0.000045;

    return [
        baseLat + radiusDeg * Math.cos(angle),
        baseLng + radiusDeg * Math.sin(angle)
    ];
}

function renderAllWaypoints2OnMap() {
    waypoint2Markers.forEach((m) => {
        if (sentieroMap) sentieroMap.removeLayer(m);
    });
    waypoint2Markers = [];

    if (!sentieroMap || !Array.isArray(waypoint2List)) return;

    waypoint2List.forEach((wp, idx) => {
        let prefix = '📍 ';
        if (wp.type === 'manual') prefix = '🏁 ';
        else if (wp.type === 'audio') prefix = '🎙️ ';
        else if (wp.type === 'photo') prefix = '📸 ';
        else if (wp.type === 'video') prefix = '🎥 ';

        const displayLatLng = getDisplayLatLngForWaypoint2(wp, waypoint2List, idx);
        const icon = L.divIcon({
            className: '',
            html: `<div style="background:rgba(18,18,18,0.92); color:#fff; padding:3px 7px; border-radius:6px; font-size:11px; font-weight:bold; border:1px solid #2e7d32; white-space:nowrap; cursor:pointer;">${prefix}${wp.index}</div>`
        });

        const marker = L.marker(displayLatLng, {
            icon: icon,
            zIndexOffset: 100 + idx
        }).addTo(sentieroMap);

        marker.on('click', () => {
            if (typeof onWaypoint2Clicked === 'function') {
                onWaypoint2Clicked(wp);
            }
        });

        waypoint2Markers.push(marker);
    });
}

function addAutoWaypoint2() {
    if (typeof sentieroCurrentLat === 'undefined' || typeof sentieroCurrentLng === 'undefined') return;
    const wpIndex = waypoint2List.length;
    waypoint2List.push({
        type: 'auto',
        index: wpIndex,
        latlng: [sentieroCurrentLat, sentieroCurrentLng],
        timestamp: Date.now()
    });
    lastAutoWp2Time = Date.now();
    renderAllWaypoints2OnMap();
    return wpIndex;
}

function addManualWaypoint2() {
    const wpIndex = waypoint2List.length;
    waypoint2List.push({
        type: 'manual',
        index: wpIndex,
        latlng: [sentieroCurrentLat, sentieroCurrentLng],
        timestamp: Date.now()
    });
    renderAllWaypoints2OnMap();
    return wpIndex;
}

function addAudioWaypoint2(noteText) {
    const wpIndex = waypoint2List.length;
    waypoint2List.push({
        type: 'audio',
        index: wpIndex,
        latlng: [sentieroCurrentLat, sentieroCurrentLng],
        note: (noteText || '').trim(),
        timestamp: Date.now()
    });
    renderAllWaypoints2OnMap();
    return wpIndex;
}

function addPhotoWaypoint2(photoDataUrl, captionText) {
    const wpIndex = waypoint2List.length;
    waypoint2List.push({
        type: 'photo',
        index: wpIndex,
        latlng: [sentieroCurrentLat, sentieroCurrentLng],
        photo: photoDataUrl,
        caption: (captionText || '').trim(),
        timestamp: Date.now()
    });
    renderAllWaypoints2OnMap();
    return wpIndex;
}

function addVideoWaypoint2(videoDataUrl, captionText) {
    const wpIndex = waypoint2List.length;
    waypoint2List.push({
        type: 'video',
        index: wpIndex,
        latlng: [sentieroCurrentLat, sentieroCurrentLng],
        video: videoDataUrl,
        caption: (captionText || '').trim(),
        timestamp: Date.now()
    });
    renderAllWaypoints2OnMap();
    return wpIndex;
}

function clearWaypoints2Session() {
    if (waypoint2TimerId) {
        clearInterval(waypoint2TimerId);
        waypoint2TimerId = null;
    }
    waypoint2Markers.forEach((m) => {
        if (sentieroMap) sentieroMap.removeLayer(m);
    });
    waypoint2Markers = [];
    waypoint2List = [];
    lastAutoWp2Time = 0;
}
