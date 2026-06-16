(function () {
    'use strict';

    /*
        This file adds only the new updates:
        - Enter Now first
        - Reveal the original Gamer ID / Platform / currency / Proxy / Invisibility tab
        - Add front-end-only email validation/storage

        It does NOT replace your original js/main.js.
        It does NOT control the chat room.
        Your original js/main.js must stay in place for the original chat room.
    */

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function showElement(element) {
        if (!element) return;

        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
    }

    function hideElement(element) {
        if (!element) return;

        element.style.display = 'none';
    }

    function hidePreloader() {
        hideElement(document.getElementById('status'));
        hideElement(document.getElementById('preloader'));
    }

    function showOriginalGeneratorTab() {
        var enterNowView = document.getElementById('enterNowView');
        var originalGeneratorView = document.getElementById('originalGeneratorView');
        var stepOne = document.querySelector('#originalGeneratorView .step-one');
        var nojs = document.querySelector('#originalGeneratorView .nojs');
        var stepTwo = document.querySelector('#originalGeneratorView .step-two');
        var gamerId = document.getElementById('ccUsername');

        hideElement(enterNowView);
        showElement(originalGeneratorView);
        showElement(stepOne);
        showElement(nojs);
        hideElement(stepTwo);

        if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.labelauty === 'function') {
            window.jQuery(':checkbox').labelauty();
        }

        if (gamerId) {
            setTimeout(function () {
                gamerId.focus();
            }, 100);
        }
    }

    function showEnterNowOnly() {
        var enterNowView = document.getElementById('enterNowView');
        var originalGeneratorView = document.getElementById('originalGeneratorView');

        showElement(enterNowView);
        hideElement(originalGeneratorView);
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

    function getSelectedValue(selector) {
        var element = document.querySelector(selector);
        return element ? element.value : '';
    }

    function getCheckboxValue(index) {
        var checkboxes = document.querySelectorAll('#originalGeneratorView input[type="checkbox"]');
        return checkboxes[index] ? checkboxes[index].checked : false;
    }

    function showGeneratorMessage(message, type) {
        var stepTwo = document.querySelector('#originalGeneratorView .step-two');
        var loaderMsg = document.querySelector('#originalGeneratorView .loader-msg');
        var consoleBox = document.querySelector('#originalGeneratorView .generator-console');

        if (!stepTwo || !consoleBox) {
            alert(message);
            return;
        }

        showElement(stepTwo);

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

    function handleGenerateButtonBeforeOriginalScript(event) {
        var originalGeneratorView = document.getElementById('originalGeneratorView');

        if (!originalGeneratorView || originalGeneratorView.style.display === 'none') {
            return true;
        }

        var gamerIdInput = document.getElementById('ccUsername');
        var emailInput = document.getElementById('visitorEmail');

        var gamerId = gamerIdInput ? gamerIdInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim() : '';

        if (!gamerId) {
            event.preventDefault();
            event.stopImmediatePropagation();
            showGeneratorMessage('Please enter your Gamer ID.', 'error');

            if (gamerIdInput) {
                gamerIdInput.focus();
            }

            return false;
        }

        if (!email) {
            event.preventDefault();
            event.stopImmediatePropagation();
            showGeneratorMessage('Please enter your email address.', 'error');

            if (emailInput) {
                emailInput.focus();
            }

            return false;
        }

        if (!isValidEmail(email)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            showGeneratorMessage('Please enter a valid email address.', 'error');

            if (emailInput) {
                emailInput.focus();
            }

            return false;
        }

        saveEntry({
            gamerId: gamerId,
            email: email,
            platform: getSelectedValue('#ccMode select'),
            currency: getSelectedValue('#ccCoins select'),
            proxy: getCheckboxValue(0),
            invisibility: getCheckboxValue(1),
            page: window.location.href,
            submittedAt: new Date().toISOString()
        });

        /*
            Do not stop the event when valid.
            This allows your original main.js generator behavior to continue.
        */
        return true;
    }

    ready(function () {
        hidePreloader();
        showEnterNowOnly();

        var enterNowBtn = document.getElementById('enterNowBtn');
        var generateBtn = document.querySelector('#originalGeneratorView .generate-btn');

        if (enterNowBtn) {
            enterNowBtn.onclick = function (event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                showOriginalGeneratorTab();
                return false;
            };
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', handleGenerateButtonBeforeOriginalScript, true);
        }
    });

    window.addEventListener('load', hidePreloader);
}());
