/**
 * Shared Components Loader - KKLab
 * Loads common navbar and footer components to avoid code duplication
 */

(function() {
    'use strict';

    /**
     * Load HTML content from a file and insert it into a placeholder element
     * @param {string} url - The URL of the HTML file to load
     * @param {string} placeholderId - The ID of the placeholder element
     * @param {Function} callback - Optional callback function to run after loading
     */
    function loadComponent(url, placeholderId, callback) {
        var placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    placeholder.outerHTML = xhr.responseText;
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                } else {
                    console.warn('Failed to load component: ' + url);
                }
            }
        };
        xhr.send();
    }

    /**
     * Set the active nav item based on the current page
     */
    function setActiveNavItem() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(function(link) {
            var href = link.getAttribute('href');
            var parentLi = link.parentElement;
            
            // Remove existing active class and sr-only span
            parentLi.classList.remove('active');
            var srOnly = link.querySelector('.sr-only');
            if (srOnly) {
                srOnly.remove();
            }
            
            // Add active class to current page
            if (href === currentPage) {
                parentLi.classList.add('active');
                var srSpan = document.createElement('span');
                srSpan.className = 'sr-only';
                srSpan.textContent = '(current)';
                link.appendChild(srSpan);
            }
        });
    }

    /**
     * Initialize the component loader
     */
    function init() {
        // Determine base path for includes
        var basePath = '';
        var currentPath = window.location.pathname;
        
        // Handle subdirectory pages if any
        if (currentPath.split('/').length > 2) {
            basePath = '../';
        }

        // Load navbar
        loadComponent(basePath + 'includes/navbar.html', 'navbar-placeholder', function() {
            setActiveNavItem();
        });

        // Load footer
        loadComponent(basePath + 'includes/footer.html', 'footer-placeholder');
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
