(function () {
    'use strict';

    /*
        HTML + CSS + JavaScript only cannot silently send emails to your inbox.

        This script does three things:
        1. Opens the email popup when "Enter Now" is clicked.
        2. Validates the email form.
        3. Saves the lead in the visitor browser using localStorage.

        Optional:
        Add your email below if you want the visitor's mail app to open
        with a pre-filled email after they submit the form.

        Example:
        const OWNER_EMAIL = 'your-email@example.com';
    */
    const OWNER_EMAIL = '';

    const enterNowBtn = document.getElementById('enterNowBtn');
    const emailModal = document.getElementById('emailPopupModal');
    const emailForm = document.getElementById('emailForm');
    const visitorName = document.getElementById('visitorName');
    const visitorEmail = document.getElementById('visitorEmail');
    const emailConsent = document.getElementById('emailConsent');
    const emailMessage = document.getElementById('emailMessage');
    const emailSubmitBtn = document.getElementById('emailSubmitBtn');
    const closeButtons = document.querySelectorAll('[data-close-email-popup]');

    let modalBackdrop = null;

    function openEmailPopup() {
        if (!emailModal) return;

        emailModal.style.display = 'block';
        emailModal.removeAttribute('aria-hidden');
        emailModal.classList.add('in');

        document.body.classList.add('modal-open');

        if (!modalBackdrop) {
            modalBackdrop = document.createElement('div');
            modalBackdrop.className = 'modal-backdrop fade in';
            document.body.appendChild(modalBackdrop);
        }

        setTimeout(function () {
            if (visitorEmail) {
                visitorEmail.focus();
            }
        }, 100);
    }

    function closeEmailPopup() {
        if (!emailModal) return;

        emailModal.classList.remove('in');
        emailModal.setAttribute('aria-hidden', 'true');
        emailModal.style.display = 'none';

        document.body.classList.remove('modal-open');

        if (modalBackdrop) {
            modalBackdrop.remove();
            modalBackdrop = null;
        }

        clearMessage();
    }

    function clearMessage() {
        if (!emailMessage) return;

        emailMessage.style.display = 'none';
        emailMessage.className = '';
        emailMessage.textContent = '';
    }

    function showMessage(message, type) {
        if (!emailMessage) return;

        emailMessage.textContent = message;
        emailMessage.style.display = 'block';

        if (type === 'success') {
            emailMessage.className = 'alert alert-success';
        } else if (type === 'error') {
            emailMessage.className = 'alert alert-danger';
        } else {
            emailMessage.className = 'alert alert-info';
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function getSavedLeads() {
        try {
            return JSON.parse(localStorage.getItem('email_leads') || '[]');
        } catch (error) {
            return [];
        }
    }

    function saveLead(lead) {
        const leads = getSavedLeads();
        leads.push(lead);
        localStorage.setItem('email_leads', JSON.stringify(leads));
    }

    function openMailApp(lead) {
        if (!OWNER_EMAIL) return;

        const subject = encodeURIComponent('New email signup');
        const body = encodeURIComponent(
            'New email signup:\n\n' +
            'Name: ' + lead.name + '\n' +
            'Email: ' + lead.email + '\n' +
            'Page: ' + lead.page + '\n' +
            'Submitted: ' + lead.submittedAt
        );

        window.location.href = 'mailto:' + OWNER_EMAIL + '?subject=' + subject + '&body=' + body;
    }

    function handleEmailSubmit(event) {
        event.preventDefault();
        clearMessage();

        const name = visitorName ? visitorName.value.trim() : '';
        const email = visitorEmail ? visitorEmail.value.trim() : '';
        const consentChecked = emailConsent ? emailConsent.checked : false;

        if (!email) {
            showMessage('Please enter your email address.', 'error');
            if (visitorEmail) visitorEmail.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            if (visitorEmail) visitorEmail.focus();
            return;
        }

        if (!consentChecked) {
            showMessage('Please tick the consent box before submitting.', 'error');
            if (emailConsent) emailConsent.focus();
            return;
        }

        const lead = {
            name: name,
            email: email,
            page: window.location.href,
            submittedAt: new Date().toISOString()
        };

        if (emailSubmitBtn) {
            emailSubmitBtn.disabled = true;
        }

        saveLead(lead);
        openMailApp(lead);

        showMessage('Thank you. Your email has been saved for this demo.', 'success');

        if (emailForm) {
            emailForm.reset();
        }

        if (emailSubmitBtn) {
            emailSubmitBtn.disabled = false;
        }
    }

    if (enterNowBtn) {
        enterNowBtn.addEventListener('click', openEmailPopup);
    }

    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }

    closeButtons.forEach(function (button) {
        button.addEventListener('click', closeEmailPopup);
    });

    if (emailModal) {
        emailModal.addEventListener('click', function (event) {
            if (event.target === emailModal) {
                closeEmailPopup();
            }
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && emailModal && emailModal.style.display === 'block') {
            closeEmailPopup();
        }
    });
}());
