/**
 * 共通JavaScript - KKLab
 */

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
    // スムーススクロール機能
    initSmoothScroll();

    // トップへ戻るボタンの表示制御
    initBackToTop();

    // アニメーション効果
    initScrollAnimations();

    // プロジェクトフィルター機能
    initProjectFilter();

    // Service Workerの登録
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});

/**
 * スムーススクロール機能
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * トップへ戻るボタン
 */
function initBackToTop() {
    // ボタンを作成
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(to right, #2c3e50, #4ca1af);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // スクロール時の表示制御
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
        }
    });
    
    // クリック時の動作
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * スクロールアニメーション
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll('.content-section, .project-card, .profile-section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// アニメーション用CSS
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .back-to-top:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
    }
`;
document.head.appendChild(style);

/**
 * フォームバリデーション（contact.html用）
 */
if (document.getElementById('contactForm')) {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        // カスタムバリデーション
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;
        
        if (!validateEmail(email)) {
            e.preventDefault();
            alert('正しいメールアドレスを入力してください。');
            return false;
        }
        
        if (message.length < 10) {
            e.preventDefault();
            alert('お問い合わせ内容は10文字以上入力してください。');
            return false;
        }
        
        // Formspreeを使用する場合はここで送信
        // 実際の実装では、YOUR_FORM_IDを実際のIDに置き換える必要があります
        if (form.action.includes('YOUR_FORM_ID')) {
            e.preventDefault();
            alert('現在、お問い合わせフォームは準備中です。GitHub経由でお問い合わせください。');
            return false;
        }
    });
}

/**
 * メールアドレスバリデーション
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * プロジェクトフィルター機能
 */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length === 0 || projectItems.length === 0) {
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // すべてのボタンからactiveクラスを削除
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // クリックされたボタンにactiveクラスを追加
            this.classList.add('active');

            // プロジェクトアイテムのフィルタリング
            projectItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    const category = item.getAttribute('data-category');
                    if (category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });

    // 初期スタイル設定
    projectItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
    });
}