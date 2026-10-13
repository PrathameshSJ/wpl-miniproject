/**
 * BakeEase Admin Settings — dynamic settings form
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminComponents();
    setActiveSidebarLink('settings.html');
    loadSettings();

    const saveBtn = document.querySelector('button.bg-gradient-to-br');
    if (saveBtn) saveBtn.addEventListener('click', saveSettings);
    
    const discardBtn = document.querySelector('button.text-on-surface-variant.hover\\:bg-surface-container');
    if (discardBtn) discardBtn.addEventListener('click', loadSettings);
});

async function loadSettings() {
    try {
        const data = await adminFetch('/settings.php');
        
        const inputs = document.querySelectorAll('input:not([type="time"]), textarea, select');
        if (inputs[0]) inputs[0].value = data.bakery_name || '';
        if (inputs[1]) inputs[1].value = data.contact_email || '';
        if (inputs[2]) inputs[2].value = data.phone_number || '';
        if (inputs[3]) inputs[3].value = data.address || '';
        
    } catch (err) { console.error('Settings load failed:', err); }
}

async function saveSettings() {
    const saveBtn = document.querySelector('button.bg-gradient-to-br');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
        const inputs = document.querySelectorAll('input:not([type="time"]), textarea, select');
        
        const payload = {
            bakery_name: inputs[0] ? inputs[0].value : '',
            contact_email: inputs[1] ? inputs[1].value : '',
            phone_number: inputs[2] ? inputs[2].value : '',
            address: inputs[3] ? inputs[3].value : ''
        };

        await adminFetch('/settings.php', {
            method: 'POST',
            body: payload
        });
        
        adminToast('Settings saved successfully!', 'success');
    } catch (err) {
        adminToast('Failed to save: ' + err.message, 'error');
    } finally {
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}
