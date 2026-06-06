/**
 * 共通JavaScript - KKLab
 * Bootstrap / jQuery 非依存のバニラ実装
 */

document.addEventListener('DOMContentLoaded', function () {
    initBackToTop();
    initScrollReveal();
    initWorksFilter();
    initContactForm();
    registerServiceWorker();
});

/* ------------------------------------------------------------------
 * 作品フィルター（index.html）
 * ---------------------------------------------------------------- */
function initWorksFilter() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.work-card');
    if (!buttons.length || !cards.length) { return; }

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.getAttribute('data-filter');

            buttons.forEach(function (b) {
                var active = b === btn;
                b.classList.toggle('active', active);
                b.setAttribute('aria-pressed', String(active));
            });

            cards.forEach(function (card) {
                var show = filter === 'all' || card.getAttribute('data-category') === filter;
                card.style.display = show ? '' : 'none';
                if (show) { card.classList.add('in'); }
            });
        });
    });
}

/* ------------------------------------------------------------------
 * ナビゲーション開閉 / ダイアログ（navbar は後から注入されるため委譲）
 * ---------------------------------------------------------------- */
document.addEventListener('click', function (e) {
    // モバイルメニューのトグル
    var toggle = e.target.closest('.nav-toggle');
    if (toggle) {
        var menu = document.getElementById('nav-menu');
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        if (menu) { menu.classList.toggle('open', !open); }
        return;
    }

    // メニュー内リンクをクリックしたら閉じる
    if (e.target.closest('.nav-menu a')) {
        var navToggle = document.querySelector('.nav-toggle');
        var navMenu = document.getElementById('nav-menu');
        if (navToggle) { navToggle.setAttribute('aria-expanded', 'false'); }
        if (navMenu) { navMenu.classList.remove('open'); }
    }

    // <dialog> を開く（data-open-dialog="#id"）
    var opener = e.target.closest('[data-open-dialog]');
    if (opener) {
        e.preventDefault();
        var dlg = document.querySelector(opener.getAttribute('data-open-dialog'));
        if (dlg && typeof dlg.showModal === 'function') { dlg.showModal(); }
        return;
    }

    // <dialog> を閉じる
    if (e.target.closest('[data-close-dialog]')) {
        var openDialog = e.target.closest('dialog');
        if (openDialog) { openDialog.close(); }
    }
});

/* ------------------------------------------------------------------
 * トップへ戻るボタン
 * ---------------------------------------------------------------- */
function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'ページ上部へ戻る');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        btn.classList.toggle('show', window.pageYOffset > 300);
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ------------------------------------------------------------------
 * スクロール演出（.reveal 要素をフェードイン）
 * ---------------------------------------------------------------- */
function initScrollReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length || !('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('in'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
}

/* ------------------------------------------------------------------
 * お問い合わせフォームの検証（contact.html）
 * ---------------------------------------------------------------- */
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) { return; }

    form.addEventListener('submit', function (e) {
        var email = form.querySelector('#email');
        var message = form.querySelector('#message');

        if (email && !isValidEmail(email.value)) {
            e.preventDefault();
            alert('正しいメールアドレスを入力してください。');
            return;
        }
        if (message && message.value.trim().length < 10) {
            e.preventDefault();
            alert('お問い合わせ内容は10文字以上入力してください。');
            return;
        }
        if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
            e.preventDefault();
            alert('現在、お問い合わせフォームは準備中です。GitHub経由でお問い合わせください。');
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ------------------------------------------------------------------
 * Service Worker
 * ---------------------------------------------------------------- */
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) { return; }
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function (err) {
            console.warn('ServiceWorker registration failed:', err);
        });
    });
}
