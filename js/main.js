(function () {
    'use strict';

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

    function forceOriginalTabVisible() {
        var originalView = document.getElementById('originalGeneratorView');

        if (!originalView) {
            return;
        }

        originalView.style.display = 'block';

        /*
            Important:
            Your original code uses <div class="nojs"> around the Gamer ID,
            Platform and currency fields. Some templates hide .nojs with CSS.
            This line forces that original area to show without changing the class name.
        */
        var nojsBlocks = originalView.querySelectorAll('.nojs');

        for (var i = 0; i < nojsBlocks.length; i++) {
            nojsBlocks[i].style.display = 'block';
            nojsBlocks[i].style.visibility = 'visible';
            nojsBlocks[i].style.opacity = '1';
        }

        var stepOne = originalView.querySelector('.step-one');

        if (stepOne) {
            stepOne.style.display = 'block';
            stepOne.style.visibility = 'visible';
            stepOne.style.opacity = '1';
        }
    }

    function hideOriginalTab() {
        var originalView = document.getElementById('originalGeneratorView');

        if (originalView) {
            originalView.style.display = 'none';
        }
    }

    function showEnterNowView() {
        var enterView = document.getElementById('enterNowView');

        if (enterView) {
            enterView.style.display = 'block';
        }

        hideOriginalTab();
    }

    function showOriginalGeneratorView() {
        var enterView = document.getElementById('enterNowView');
        var gamerIdInput = document.getElementById('ccUsername');
        var stepTwo = document.querySelector('#originalGeneratorView .step-two');

        if (enterView) {
            enterView.style.display = 'none';
        }

        forceOriginalTabVisible();

        if (stepTwo) {
            stepTwo.style.display = 'none';
        }

        if (gamerIdInput) {
            setTimeout(function () {
                gamerIdInput.focus();
            }, 100);
        }

        if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.labelauty === 'function') {
            window.jQuery(':checkbox').labelauty();
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

    function getSelectedValue(selector) {
        var element = document.querySelector(selector);
        return element ? element.value : '';
    }

    function getCheckboxValue(index) {
        var checkboxes = document.querySelectorAll('#originalGeneratorView input[type="checkbox"]');

        if (!checkboxes[index]) {
            return false;
        }

        return checkboxes[index].checked;
    }

    function showGeneratorMessage(message, type) {
        var stepTwo = document.querySelector('#originalGeneratorView .step-two');
        var loaderMsg = document.querySelector('#originalGeneratorView .loader-msg');
        var consoleBox = document.querySelector('#originalGeneratorView .generator-console');

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
        showEnterNowView();

        var enterNowBtn = document.getElementById('enterNowBtn');
        var mainGenerateBtn = document.getElementById('mainGenerateBtn');

        if (enterNowBtn) {
            enterNowBtn.addEventListener('click', function (event) {
                event.preventDefault();
                showOriginalGeneratorView();
            });
        }

        if (mainGenerateBtn) {
            mainGenerateBtn.addEventListener('click', handleMainGenerateClick);
        }

        if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.labelauty === 'function') {
            window.jQuery(':checkbox').labelauty();
        }
    });

    window.addEventListener('load', hidePreloader);
}());
