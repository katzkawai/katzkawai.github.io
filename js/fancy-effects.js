/**
 * 派手なエフェクト用JavaScript - sample.html
 */

// 星を生成する関数
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = window.innerWidth < 768 ? 50 : 100; // モバイルでは星を減らす
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

// ページ読み込み時に星を生成
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    
    // パフォーマンス最適化: ウィンドウリサイズ時の処理
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // 星を再生成
            const starsContainer = document.getElementById('stars');
            starsContainer.innerHTML = '';
            createStars();
        }, 250);
    });
    
    // タイトルのランダムカラー効果
    const fancyTitle = document.querySelector('.fancy-title');
    if (fancyTitle) {
        setInterval(function() {
            const hue = Math.random() * 360;
            fancyTitle.style.filter = `hue-rotate(${hue}deg)`;
        }, 3000);
    }
    
    // 絵文字のランダム変更
    const emojis = ['✨', '🎉', '🌈', '🚀', '💫', '🔥', '⭐', '💖', '🎨', '🌟'];
    const emojiElements = document.querySelectorAll('.emoji');
    
    emojiElements.forEach(function(emoji) {
        setInterval(function() {
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }, 2000);
    });
});

// コンテナのインタラクティブ効果
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container-fancy');
    
    if (container) {
        container.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 50px rgba(255, 255, 255, 0.8)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.5)';
        });
        
        // タッチデバイス対応
        container.addEventListener('touchstart', function() {
            this.style.transform = 'rotate(0deg) scale(1.1)';
        });
        
        container.addEventListener('touchend', function() {
            this.style.transform = 'rotate(-3deg) scale(1)';
        });
    }
});