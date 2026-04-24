/**
 * BakeEase Contact Page — form submission + FAQ accordion
 */
document.addEventListener('DOMContentLoaded', initContactPage);

function initContactPage() {
    setupContactForm();
    setupFAQ();
    setupStarRating();
}

let selectedRating = 4;

function setupStarRating() {
    const container = document.getElementById('star-rating');
    if (!container) return;
    const stars = container.querySelectorAll('.material-symbols-outlined');
    stars.forEach((star, idx) => {
        star.style.cursor = 'pointer';
        star.addEventListener('click', () => {
            selectedRating = idx + 1;
            stars.forEach((s, i) => {
                s.style.fontVariationSettings = i < selectedRating ? "'FILL' 1" : "'FILL' 0";
            });
        });
    });
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    const successState = document.getElementById('contact-success');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const origText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const formData = new FormData(form);
            const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || null,
                subject: formData.get('subject') || null,
                message: formData.get('message'),
                rating: selectedRating,
            };

            await apiFetch('/contact.php', { method: 'POST', body: payload });

            form.style.display = 'none';
            if (successState) successState.style.display = 'flex';
            showToast('Feedback submitted successfully!', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to submit', 'error');
        } finally {
            btn.textContent = origText;
            btn.disabled = false;
        }
    });
}

function setupFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-toggle');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        if (!btn || !content) return;

        btn.addEventListener('click', () => {
            const isOpen = !content.classList.contains('hidden');
            // Close all
            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = '');
            // Toggle current
            if (!isOpen) {
                content.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}
