/**
 * Service Worker - KKLab
 * オフライン対応とキャッシュ管理
 */

const CACHE_NAME = 'kklab-cache-v1';
const urlsToCache = [
  '/',
  '/style.css',
  '/js/main.js',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/offline.html'
];

// インストールイベント
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチイベント
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあればそれを返す
        if (response) {
          return response;
        }

        // なければネットワークから取得
        return fetch(event.request).then(
          response => {
            // 正しいレスポンスでない場合は返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // レスポンスをクローンしてキャッシュに保存
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // オフライン時の処理
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});

// アクティベートイベント
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});