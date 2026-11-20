const SENTIERO_VIVO2_TRIAL_DAYS = 30;
const SENTIERO_VIVO2_MASTER_KEYS = ["MassimoMaster2026", "SentieroVIP"];

function initTrialAndLicense() {
    const now = Date.now();
    const isActivated = localStorage.getItem('sentierovivo2_activated') === 'true';

    if (isActivated) {
        return { status: 'activated', daysLeft: SENTIERO_VIVO2_TRIAL_DAYS };
    }

    let installTime = parseInt(localStorage.getItem('sentierovivo2_install') || '0', 10);
    let maxSeenTime = parseInt(localStorage.getItem('sentierovivo2_maxtime') || '0', 10);

    if (!installTime) {
        installTime = now;
        maxSeenTime = now;
        localStorage.setItem('sentierovivo2_install', String(installTime));
        localStorage.setItem('sentierovivo2_maxtime', String(maxSeenTime));
    } else if (now < maxSeenTime) {
        return { status: 'tampered', daysLeft: 0 };
    } else {
        localStorage.setItem('sentierovivo2_maxtime', String(now));
    }

    const trialMs = SENTIERO_VIVO2_TRIAL_DAYS * 24 * 60 * 60 * 1000;
    const elapsedMs = now - installTime;

    if (elapsedMs > trialMs) {
        return { status: 'expired', daysLeft: 0 };
    }

    const daysLeft = Math.ceil((trialMs - elapsedMs) / (24 * 60 * 60 * 1000));
    return { status: 'trial', daysLeft: daysLeft };
}

function activateLicenseKey(inputKey) {
    const cleanKey = (inputKey || '').trim();
    if (SENTIERO_VIVO2_MASTER_KEYS.includes(cleanKey)) {
        localStorage.setItem('sentierovivo2_activated', 'true');
        return true;
    }
    return false;
}
