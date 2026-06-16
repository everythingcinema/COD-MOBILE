/* ===== CUSTOM UPDATES: ENTER NOW + EMAIL ONLY ===== */
/* This code does not touch the original chat room. */

(function () {
    'use strict';

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

    function showOriginalGeneratorTab() {
        var enterNowView = document.getElementById('enterNowView');
        var originalGeneratorView = document.getElementById('originalGeneratorView');
        var stepOne = document.querySelector('#originalGeneratorView .step-one');
        var nojs = document.querySelector('#originalGeneratorView .nojs');
        var stepTwo = document.querySelector('#originalGeneratorView .step-two');
        var nicknameInput = document.getElementById('ccUsername');

        hideElement(enterNowView);
        showElement(originalGeneratorView);
        showElement(stepOne);
        showElement(nojs);
        hideElement(stepTwo);

        if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.labelauty === 'function') {
            window.jQuery(':checkbox').labelauty();
        }

        if (nicknameInput) {
            setTimeout(function () {
                nicknameInput.focus();
            }, 100);
        }
    }

    function showEnterNowOnly() {
        var enterNowView = document.getElementById('enterNowView');
        var originalGeneratorView = document.getElementById('originalGeneratorView');

        showElement(enterNowView);
        hideElement(originalGeneratorView);
    }

    function saveEmailBeforeOriginalGenerator(event) {
        var originalGeneratorView = document.getElementById('originalGeneratorView');

        if (!originalGeneratorView || originalGeneratorView.style.display === 'none') {
            return true;
        }

        var emailInput = document.getElementById('visitorEmail');
        var nicknameInput = document.getElementById('ccUsername');

        if (!emailInput) {
            return true;
        }

        var email = emailInput.value.trim();
        var nickname = nicknameInput ? nicknameInput.value.trim() : '';

        if (!email) {
            event.preventDefault();
            event.stopImmediatePropagation();
            alert('Please enter your email address.');
            emailInput.focus();
            return false;
        }

        if (!isValidEmail(email)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            alert('Please enter a valid email address.');
            emailInput.focus();
            return false;
        }

        saveEntry({
            nickname: nickname,
            email: email,
            submittedAt: new Date().toISOString(),
            page: window.location.href
        });

        return true;
    }

    if (window.jQuery) {
        window.jQuery(document).ready(function () {
            var enterNowBtn = document.getElementById('enterNowBtn');
            var generateBtn = document.querySelector('#originalGeneratorView .generate-btn');

            showEnterNowOnly();

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
                generateBtn.addEventListener('click', saveEmailBeforeOriginalGenerator, true);
            }
        });
    }
}());
/* ===== END CUSTOM UPDATES ===== */
