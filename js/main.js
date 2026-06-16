(function () {
    'use strict';

    /*
        Clean replacement for the old obfuscated main.js.

        Features included:
        - Hides the preloader.
        - Shows Enter Now first.
        - Reveals the original Gamer ID / Platform / currency / Proxy / Invisibility tab.
        - Adds email validation.
        - Saves demo entries in localStorage.
        - Makes the chat room work on the current setup.

        No PHP.
        No CSS changes.
        No popup.
    */

    var chatUserName = '';

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function getEl(selector) {
        return document.querySelector(selector);
    }

    function getAll(selector) {
        return document.querySelectorAll(selector);
    }

    function hideElement(element) {
        if (element) {
            element.style.display = 'none';
        }
    }

    function showElement(element) {
        if (element) {
            element.style.display = 'block';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
        }
    }

    function hidePreloader() {
        hideElement(document.getElementById('status'));
        hideElement(document.getElementById('preloader'));
    }

    function initializeCheckboxes() {
        if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.labelauty === 'function') {
            window.jQuery(':checkbox').labelauty();
        }
    }

    function showEnterNowView() {
        var enterNowView = document.getElementById('enterNowView');
        var originalGeneratorView = document.getElementById('originalGeneratorView');

        showElement(enterNowView);
        hideElement(originalGeneratorView);
    }

    function showOriginalGeneratorView() {
        var enterNowView = document.getElementById('enterNowView');
        var originalGeneratorView = document.getElementById('originalGeneratorView');
        var stepOne = getEl('#originalGeneratorView .step-one');
        var nojs = getEl('#originalGeneratorView .nojs');
        var stepTwo = getEl('#originalGeneratorView .step-two');
        var gamerIdInput = document.getElementById('ccUsername');

        hideElement(enterNowView);
        showElement(originalGeneratorView);
        showElement(stepOne);
        showElement(nojs);
        hideElement(stepTwo);

        initializeCheckboxes();

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

    function getSelectedValue(selector) {
        var element = getEl(selector);
        return element ? element.value : '';
    }

    function getCheckboxValue(index) {
        var checkboxes = getAll('#originalGeneratorView input[type="checkbox"]');
        return checkboxes[index] ? checkboxes[index].checked : false;
    }

    function showGeneratorMessage(message, type) {
        var stepTwo = getEl('#originalGeneratorView .step-two');
        var loaderMsg = getEl('#originalGeneratorView .loader-msg');
        var consoleBox = getEl('#originalGeneratorView .generator-console');

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

        consoleBox.innerHTML = '<div class="' + alertClass + '">' + escapeHtml(message) + '</div>';
    }

    function handleMainGenerateClick(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

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

        return false;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function appendChatMessage(name, message, isUser) {
        var chatList = getEl('.chatList');
        var chatListArea = getEl('.livechatListArea');

        if (!chatList) {
            return;
        }

        var item = document.createElement('li');
        item.className = isUser ? 'chat-message user-message' : 'chat-message bot-message';

        var nameSpan = document.createElement('strong');
        nameSpan.textContent = name + ': ';

        var messageSpan = document.createElement('span');
        messageSpan.textContent = message;

        item.appendChild(nameSpan);
        item.appendChild(messageSpan);

        chatList.appendChild(item);

        if (chatListArea) {
            chatListArea.scrollTop = chatListArea.scrollHeight;
        }
    }

    function submitNickname(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        var nameInput = getEl('.livechatName');
        var nameBox = getEl('.livechatNameBox');

        var enteredName = nameInput ? nameInput.value.trim() : '';

        if (!enteredName) {
            alert('Please enter a nickname.');

            if (nameInput) {
                nameInput.focus();
            }

            return false;
        }

        chatUserName = enteredName;

        hideElement(nameBox);

        var chatList = getEl('.chatList');

        if (chatList && chatList.children.length === 0) {
            appendChatMessage('Admin', 'Welcome ' + chatUserName + '.', false);
            appendChatMessage('Guest143', 'Anyone else here?', false);
            appendChatMessage('Player88', 'Yes, it is working.', false);
        }

        var messageInput = getEl('.livechatMsg');

        if (messageInput) {
            messageInput.focus();
        }

        return false;
    }

    function submitChatMessage(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        var messageInput = getEl('.livechatMsg');
        var nameBox = getEl('.livechatNameBox');

        if (!chatUserName) {
            showElement(nameBox);
            alert('Please enter a nickname first.');

            var nameInput = getEl('.livechatName');

            if (nameInput) {
                nameInput.focus();
            }

            return false;
        }

        var message = messageInput ? messageInput.value.trim() : '';

        if (!message) {
            if (messageInput) {
                messageInput.focus();
            }

            return false;
        }

        appendChatMessage(chatUserName, message, true);

        if (messageInput) {
            messageInput.value = '';
            messageInput.focus();
        }

        setTimeout(function () {
            var replies = [
                'Nice.',
                'I see your message.',
                'That worked.',
                'Welcome.',
                'Thanks for joining.',
                'The chat is active.'
            ];

            var randomReply = replies[Math.floor(Math.random() * replies.length)];
            var guestNumber = Math.floor(Math.random() * 900 + 100);

            appendChatMessage('Guest' + guestNumber, randomReply, false);
        }, 700);

        return false;
    }

    function setupChatRoom() {
        var nicknameBtn = getEl('.livechatNicknameBtn');
        var submitBtn = getEl('.livechatSubmtBtn');
        var nameInput = getEl('.livechatName');
        var messageInput = getEl('.livechatMsg');
        var nameBox = getEl('.livechatNameBox');

        showElement(nameBox);

        if (nicknameBtn) {
            nicknameBtn.onclick = submitNickname;
        }

        if (submitBtn) {
            submitBtn.onclick = submitChatMessage;
        }

        if (nameInput) {
            nameInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    submitNickname(event);
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    submitChatMessage(event);
                }
            });
        }
    }

    function setupEnterNowFlow() {
        var enterNowBtn = document.getElementById('enterNowBtn');
        var mainGenerateBtn = document.getElementById('mainGenerateBtn');

        showEnterNowView();

        if (enterNowBtn) {
            enterNowBtn.onclick = function (event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                showOriginalGeneratorView();
                return false;
            };
        }

        if (mainGenerateBtn) {
            mainGenerateBtn.onclick = handleMainGenerateClick;
        }
    }

    ready(function () {
        hidePreloader();
        initializeCheckboxes();
        setupEnterNowFlow();
        setupChatRoom();
    });

    window.addEventListener('load', function () {
        hidePreloader();
    });

}());
