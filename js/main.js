(function () {
    'use strict';

    /*
        Flow:
        1. User sees the landing tab with Enter Now.
        2. User clicks Enter Now.
        3. The original Gamer ID / Platform / Email / currency / Proxy tab appears.
        4. Form submission is saved in browser localStorage.

        No popup.
        No PHP.
        No CSS changes.
    */

    var landingSection = document.getElementById('landingSection');
    var originalFormSection = document.getElementById('originalFormSection');
    var enterNowBtn = document.getElementById('enterNowBtn');
    var entryForm = document.getElementById('entryForm');

    var gamerIdInput = document.getElementById('ccUsername');
    var emailInput = document.getElementById('visitorEmail');
    var platformSelect = document.getElementById('ccModeSelect');
    var currencySelect = document.getElementById('ccCoinsSelect');
    var proxyOption = document.getElementById('proxyOption');
    var invisibilityOption = document.getElementById('invisibilityOption');

    var stepTwo = document.querySelector('.step-two');
    var consoleBox = document.querySelector('.generator-console');

    function initLabelauty() {
        if (window.jQuery && typeof window.jQuery.fn.labelauty === 'function') {
            window.jQuery(':checkbox').labelauty();
        }
    }

    function showOriginalForm() {
        if (landingSection) {
            landingSection.style.display = 'none';
        }

        if (originalFormSection) {
            originalFormSection.style.display = 'block';
            originalFormSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        if (gamerIdInput) {
            setTimeout(function () {
                gamerIdInput.focus();
            }, 300);
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showConsoleMessage(message, type) {
        if (!stepTwo || !consoleBox) {
            alert(message);
            return;
        }

        stepTwo.style.display = 'block';

        var className = 'alert alert-info';

        if (type === 'success') {
            className = 'alert alert-success';
        }

        if (type === 'error') {
            className = 'alert alert-danger';
        }

        consoleBox.innerHTML = '<div class="' + className + '">' + message + '</div>';
    }

    function getSavedEntries() {
        try {
            return JSON.parse(localStorage.getItem('demo_entries') || '[]');
        } catch (error) {
            return [];
        }
    }

    function saveEntry(entry) {
        var entries = getSavedEntries();
        entries.push(entry);
        localStorage.setItem('demo_entries', JSON.stringify(entries));
    }

    function handleEntrySubmit(event) {
        event.preventDefault();

        var gamerId = gamerIdInput ? gamerIdInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim() : '';
        var platform = platformSelect ? platformSelect.value : '';
        var currency = currencySelect ? currencySelect.value : '';
        var proxy = proxyOption ? proxyOption.checked : false;
        var invisibility = invisibilityOption ? invisibilityOption.checked : false;

        if (!gamerId) {
            showConsoleMessage('Please enter your Gamer ID.', 'error');
            if (gamerIdInput) {
                gamerIdInput.focus();
            }
            return;
        }

        if (!email) {
            showConsoleMessage('Please enter your email address.', 'error');
            if (emailInput) {
                emailInput.focus();
            }
            return;
        }

        if (!isValidEmail(email)) {
            showConsoleMessage('Please enter a valid email address.', 'error');
            if (emailInput) {
                emailInput.focus();
            }
            return;
        }

        var entry = {
            gamerId: gamerId,
            email: email,
            platform: platform,
            currency: currency,
            proxy: proxy,
            invisibility: invisibility,
            page: window.location.href,
            submittedAt: new Date().toISOString()
        };

        saveEntry(entry);

        showConsoleMessage('Thank you. Your entry has been saved for this demo.', 'success');

        entryForm.reset();

        if (window.jQuery && typeof window.jQuery.fn.labelauty === 'function') {
            window.jQuery(':checkbox').labelauty();
        }
    }

    if (enterNowBtn) {
        enterNowBtn.addEventListener('click', showOriginalForm);
    }

    if (entryForm) {
        entryForm.addEventListener('submit', handleEntrySubmit);
    }

    initLabelauty();
}());
