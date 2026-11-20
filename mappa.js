let sentieroMap = null;
let sentieroUserMarker = null;
let sentieroAccuracyCircle = null;
let sentieroCurrentLat = 43.5485;
let sentieroCurrentLng = 10.3106;
let sentieroHasCenteredOnce = false;

function initSentieroMap(containerId) {
    const mapEl = document.getElementById(containerId);
    if (!mapEl || typeof L === 'undefined') return;

    if (sentieroMap) {
        sentieroMap.invalidateSize();
        return;
    }

    sentieroMap = L.map(containerId, { zoomControl: false }).setView(
        [sentieroCurrentLat, sentieroCurrentLng],
        16
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(sentieroMap);

    L.control.zoom({ position: 'bottomright' }).addTo(sentieroMap);

    setTimeout(() => {
        if (sentieroMap) sentieroMap.invalidateSize();
    }, 200);

    startSentieroGpsWatch();
}

function startSentieroGpsWatch() {
    if (!navigator.geolocation) {
        updateGpsStatusBadge(false, 'GPS non supportato');
        return;
    }

    navigator.geolocation.watchPosition(
        (pos) => {
            sentieroCurrentLat = pos.coords.latitude;
            sentieroCurrentLng = pos.coords.longitude;
            const latlng = [sentieroCurrentLat, sentieroCurrentLng];

            updateGpsStatusBadge(true, 'GPS Attivo');

            if (!sentieroMap) return;

            if (!sentieroUserMarker) {
                sentieroUserMarker = L.circleMarker(latlng, {
                    radius: 9,
                    color: '#ffffff',
                    weight: 2,
                    fillColor: '#2e7d32',
                    fillOpacity: 1
                }).addTo(sentieroMap);

                sentieroAccuracyCircle = L.circle(latlng, {
                    radius: pos.coords.accuracy || 15,
                    color: '#2e7d32',
                    weight: 1,
                    fillColor: '#2e7d32',
                    fillOpacity: 0.15
                }).addTo(sentieroMap);

                if (!sentieroHasCenteredOnce) {
                    sentieroMap.setView(latlng, 16);
                    sentieroHasCenteredOnce = true;
                }
            } else {
                sentieroUserMarker.setLatLng(latlng);
                if (sentieroAccuracyCircle) {
                    sentieroAccuracyCircle.setLatLng(latlng);
                    sentieroAccuracyCircle.setRadius(pos.coords.accuracy || 15);
                }
            }
        },
        () => {
            updateGpsStatusBadge(false, 'GPS in attesa...');
        },
        {
            enableHighAccuracy: true,
            maximumAge: 2000,
            timeout: 10000
        }
    );
}

function updateGpsStatusBadge(isActive, labelText) {
    const dot = document.getElementById('gps-status-dot');
    const txt = document.getElementById('gps-status-text');
    if (dot) {
        dot.style.backgroundColor = isActive ? '#2e7d32' : '#d32f2f';
    }
    if (txt) {
        txt.innerText = labelText;
    }
}
