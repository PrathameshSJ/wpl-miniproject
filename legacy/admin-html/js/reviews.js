/**
 * BakeEase Admin Reviews — review moderation with JWT auth
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminComponents();
    setActiveSidebarLink('reviews.html');
    loadReviews();
});

async function loadReviews() {
    const container = document.getElementById('reviews-list');
    if (!container) return;
    try {
        const reviews = await adminFetch('/reviews.php');
        if (!reviews.length) {
            container.innerHTML = '<p class="text-center text-on-surface-variant py-12">No reviews yet</p>';
            return;
        }
        container.innerHTML = reviews.map(r => {
            const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            return `<div class="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="font-bold text-on-surface">${r.reviewer_name}</h4>
                        <p class="text-xs text-on-surface-variant">on <strong>${r.product_name}</strong> · ${new Date(r.created_at).toLocaleDateString()}</p>
                        <span class="text-amber-500 text-sm">${stars}</span>
                    </div>
                    <span class="${r.is_approved ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'} px-3 py-1 rounded-full text-[11px] font-bold">${r.is_approved ? 'Approved' : 'Pending'}</span>
                </div>
                <p class="text-on-surface-variant text-sm mb-4">${r.comment || '<em>No comment</em>'}</p>
                <div class="flex gap-2">
                    ${!r.is_approved ? `<button onclick="moderateReview(${r.review_id}, 1)" class="text-xs font-bold bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700">Approve</button>` : ''}
                    ${r.is_approved ? `<button onclick="moderateReview(${r.review_id}, 0)" class="text-xs font-bold bg-orange-600 text-white px-4 py-1.5 rounded-lg hover:bg-orange-700">Unapprove</button>` : ''}
                    <button onclick="deleteReview(${r.review_id})" class="text-xs font-bold text-red-600 border border-red-300 px-4 py-1.5 rounded-lg hover:bg-red-50">Delete</button>
                </div>
            </div>`;
        }).join('');
    } catch (err) { console.error('Reviews load failed:', err); }
}

async function moderateReview(id, approved) {
    try {
        await adminFetch(`/reviews.php?id=${id}`, {
            method: 'PATCH',
            body: { is_approved: approved },
        });
        adminToast(approved ? 'Review approved' : 'Review unapproved', 'success');
        loadReviews();
    } catch (err) { adminToast('Failed: ' + err.message, 'error'); }
}

async function deleteReview(id) {
    if (!confirm('Delete this review?')) return;
    try {
        await adminFetch(`/reviews.php?id=${id}`, {
            method: 'PATCH',
            body: { delete: true },
        });
        adminToast('Review deleted', 'success');
        loadReviews();
    } catch (err) { adminToast('Failed: ' + err.message, 'error'); }
}