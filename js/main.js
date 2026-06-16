(function () {
    'use strict';

    /*
        This file replaces the old obfuscated main.js.

        What it does:
        1. Hides the preloader.
        2. Shows only the Enter Now tab first.
        3. When Enter Now is clicked, shows the original Gamer ID tab.
        4. Keeps the original tab classes untouched.
        5. Adds front-end-only email saving with localStorage.

        No PHP.
        No popup.
        No CSS file changes.
    */

    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function hidePreloader() {
        var status = document.getElementById('status');
        var preloader = document.getElementById('preloader');

        if (status) {
            status.style.display = 'none';
        }

        if (preloader) {
            preloader.style.display = 'none';
        }
    }

    function initializeCheckboxStyle() {
        if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.labelauty === 'function') {
            window.jQuery(':checkbox').labelauty();
        }
    }

    function showMainGeneratorTab() {
        var entryLandingTab = document.getElementById('entryLandingTab');
        var mainGeneratorTab = document.getElementById('mainGeneratorTab');
        var gamerIdInput = document.getElementById('ccUsername');

        if (entryLandingTab) {
            entryLandingTab.style.display = 'none';
        }

        if (mainGeneratorTab) {
            mainGeneratorTab.style.display = 'block';
        }

        if (gamerIdInput) {
            setTimeout(function () {
                gamerIdInput.focus();
            }, 100);
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    function showGeneratorMessage(message, type) {
        var stepTwo = document.querySelector('#mainGeneratorTab .step-two');
        var loaderMsg = document.querySelector('#mainGeneratorTab .loader-msg');
        var consoleBox = document.querySelector('#mainGeneratorTab .generator-console');

        if (!stepTwo || !consoleBox) {
            alert(message);
            return;
        }

        stepTwo.style.display = 'block';

        if (loaderMsg) {
            loaderMsg.textContent = type === 'success' ? 'Complete' : 'Please check your details';
        }

        var alertClass = 'alert alert-info';

        if (type === 'success') {
            alertClass = 'alert alert-success';
        }

        if (type === 'error') {
            alertClass = 'alert alert-danger';
        }

        consoleBox.innerHTML = '<div class="' + alertClass + '">' + message + '</div>';
    }

    function getSelectedValue(selector) {
        var element = document.querySelector(selector);
        return element ? element.value : '';
    }

    function getCheckboxValue(index) {
        var checkboxes = document.querySelectorAll('#mainGeneratorTab input[type="checkbox"]');
        return checkboxes[index] ? checkboxes[index].checked : false;
    }

    function handleMainGenerateClick(event) {
        event.preventDefault();

        var gamerIdInput = document.getElementById('ccUsername');
        var emailInput = document.getElementById('visitorEmail');

        var gamerId = gamerIdInput ? gamerIdInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim() : '';

        var platform = getSelectedValue('#ccMode select');
        var currency = getSelectedValue('#ccCoins select');
        var proxySelected = getCheckboxValue(0);
        var invisibilitySelected = getCheckboxValue(1);

        if (!gamerId) {
            showGeneratorMessage('Please enter your Gamer ID.', 'error');

            if (gamerIdInput) {
                gamerIdInput.focus();
            }

            return false;
        }

        if (!email) {
            showGeneratorMessage('Please enter your email address.', 'error');

            if (emailInput) {
                emailInput.focus();
            }

            return false;
        }

        if (!isValidEmail(email)) {
            showGeneratorMessage('Please enter a valid email address.', 'error');

            if (emailInput) {
                emailInput.focus();
            }

            return false;
        }

        saveEntry({
            gamerId: gamerId,
            email: email,
            platform: platform,
            currency: currency,
            proxy: proxySelected,
            invisibility: invisibilitySelected,
            page: window.location.href,
            submittedAt: new Date().toISOString()
        });

        showGeneratorMessage('Thank you. Your entry has been saved for this demo.', 'success');

        return true;
    }

    ready(function () {
        hidePreloader();
        initializeCheckboxStyle();

        var enterNowBtn = document.getElementById('enterNowBtn');
        var mainGenerateBtn = document.getElementById('mainGenerateBtn');

        if (enterNowBtn) {
            enterNowBtn.addEventListener('click', showMainGeneratorTab);
        }

        if (mainGenerateBtn) {
            mainGenerateBtn.addEventListener('click', handleMainGenerateClick);
        }
    });
}());
