const images = document.querySelectorAll('.image-title img');
const popup = document.getElementById('imagePopup');
const popupImg = document.getElementById('popupImg');
const closeBtn = document.querySelector('.close');

images.forEach(img => {
  img.addEventListener('click', () => {
    popup.classList.add('show');
    popupImg.src = img.src;
  });
});

function closePopup() {
  popup.classList.add('closing');
  setTimeout(() => {
    popup.classList.remove('show', 'closing');
  }, 250);
}

closeBtn.addEventListener('click', closePopup);

popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    closePopup();
  }
});
