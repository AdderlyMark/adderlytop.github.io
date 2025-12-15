const overlay = document.createElement('div');
overlay.id = 'image-overlay';
overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: pointer;
  transition: background 0.2s ease, backdrop-filter 0.2s ease;
`;

const img = document.createElement('img');
img.style.cssText = `
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  transform: scale(0.8);
  opacity: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
`;

overlay.appendChild(img);
document.body.appendChild(overlay);

function openImage(src) {
  img.src = src;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    overlay.style.background = 'rgba(0, 0, 0, 0.9)';
    overlay.style.backdropFilter = 'blur(10px)';
    img.style.transform = 'scale(1)';
    img.style.opacity = '1';
  }, 10);
}

function closeImage() {
  overlay.style.background = 'rgba(0, 0, 0, 0)';
  overlay.style.backdropFilter = 'blur(0px)';
  img.style.transform = 'scale(0.8)';
  img.style.opacity = '0';
  
  setTimeout(() => {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    closeImage();
  }
});

img.addEventListener('click', (e) => {
  e.stopPropagation();
});

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[src$=".png"], img[src$=".PNG"], img[src$=".jpg"], img[src$=".JPG"], img[src$=".jpeg"], img[src$=".JPEG"]');
  
  images.forEach(image => {
    if (image.classList.contains('site-icon') || 
        image.classList.contains('social-icon') || 
        image.id === 'button-img') {
      return;
    }
    
    image.style.cursor = 'pointer';
    image.addEventListener('click', (e) => {
      e.stopPropagation();
      openImage(image.src);
    });
  });
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.tagName === 'IMG') {
        const src = node.src.toLowerCase();
        if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg')) {
          if (node.classList.contains('site-icon') || 
              node.classList.contains('social-icon') || 
              node.id === 'button-img') {
            return;
          }
          
          node.style.cursor = 'pointer';
          node.addEventListener('click', (e) => {
            e.stopPropagation();
            openImage(node.src);
          });
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });