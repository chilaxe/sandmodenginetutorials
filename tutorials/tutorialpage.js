document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.image-title img, .sandmod-tutorial-image');
    const popup = document.getElementById('imagePopup');
    const popupImg = document.getElementById('popupImg');
    const closeBtn = document.querySelector('.close');

    if (popup && popupImg) {
        // Move popup directly under body so it renders on top of the sidebar, header, and all elements
        if (popup.parentElement !== document.body) {
            document.body.appendChild(popup);
        }

        function openLightbox(src) {
            if (!src) return;
            popup.classList.remove('closing');
            popup.classList.add('show');
            popupImg.src = src;
            document.body.style.overflow = 'hidden';
        }

        // Click anywhere on image-title container
        const imageContainers = document.querySelectorAll('.image-title');
        imageContainers.forEach(container => {
            container.style.cursor = 'pointer';
            container.addEventListener('click', () => {
                const img = container.querySelector('img');
                if (img && img.src) {
                    openLightbox(img.src);
                }
            });
        });

        // Click on any standalone tutorial image
        const standaloneImages = document.querySelectorAll('.sandmod-tutorial-image');
        standaloneImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                if (img.src) {
                    openLightbox(img.src);
                }
            });
        });

        function closePopup() {
            popup.classList.add('closing');
            setTimeout(() => {
                popup.classList.remove('show', 'closing');
                document.body.style.overflow = '';
            }, 250);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closePopup);
        }

        popup.addEventListener('click', (e) => {
            if (e.target === popup || e.target === closeBtn) {
                closePopup();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('show')) {
                closePopup();
            }
        });
    }
});
