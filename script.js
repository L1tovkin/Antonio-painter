clearPaintAfterAnimation();
setupScrollAnimations();
setupImages();
setupContactform();

function clearPaintAfterAnimation() {
  const lastPaint = document.querySelector('.green');
  lastPaint.addEventListener('animationend', () => {
    const content = document.querySelector('.content');
    const loader = document.querySelector('.paint-loader');
    content.style.display = 'block';
    loader.style.zIndex = '-1';

    document.querySelectorAll('.paint').forEach((element) => {
      element.style.display = 'none';
    });
  });
}

function setupScrollAnimations() {
  const artEntry = document.querySelector('.art-container img');
  artEntry.addEventListener('animationend', () => {
    const observer = new IntersectionObserver(intersections => {
      intersections.forEach(({
        target,
        isIntersecting
      }) => {
        if (!isIntersecting) {
          return;
        }
        target.getAttribute('data-animate-classes').split(' ').forEach(className => {
          document.querySelectorAll(`.${className}`).forEach(element => {
            element.classList.add('animate', isIntersecting);
          });
        });
      });
    }, {
      threshold: 0.25
    });
  
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });
  });
}

function setupImages() {
  const images = document.querySelectorAll('.art-container img');

  images.forEach((image, i) => {
    image.addEventListener('click', () => {
      const imageBoundingRect = image.getBoundingClientRect();
      const newImage = document.createElement('img');
      newImage.src = image.src;
      newImage.alt = image.alt;
      newImage.style.width = imageBoundingRect.width + 'px';
      newImage.style.position = 'fixed';
      newImage.style.top = imageBoundingRect.top + 'px';
      newImage.style.left = imageBoundingRect.left + 'px';
      newImage.style.zIndex = '10001';
      newImage.className = 'fullscreen';
      document.body.appendChild(newImage);

      setTimeout(() => {
        const parentHeight = window.innerHeight;
        const height = image.offsetHeight;
        const targetHeight = parentHeight * 0.7;

        const parentWidth = window.innerWidth;
        const width = image.offsetWidth;
        const targetWidth = parentWidth * 0.8;

        const scale =
          parentHeight > parentWidth
            ? targetWidth / width
            : targetHeight / height;
        newImage.style.transform = `translate(-50%, -50%) scale(${scale})`;
        newImage.style.top = '50%';
        newImage.style.left = '50%';
      }, 0);

      showBlur(image, newImage);
    });
  });
}

function showBlur(originalImage, newImage) {
  const blur = document.querySelector('.blur');
  blur.style.zIndex = 10000;
  blur.style.backdropFilter = 'blur(10px) brightness(50%) opacity(1)';

  const scrollY = window.scrollY;
  document.body.style.top = -scrollY + 'px';
  document.body.classList.add('prevent-scroll');

  blur.addEventListener('click', () => {
    blur.style.zIndex = -1;
    blur.style.backdropFilter = 'blur(10px) brightness(50%) opacity(0)';
    newImage.style.transform = `none`;
    newImage.style.width = originalImage.clientWidth + 'px';
    const imageBoundingRect = originalImage.getBoundingClientRect();

    newImage.style.top = imageBoundingRect.top + 'px';
    newImage.style.left = imageBoundingRect.left + 'px';

    setTimeout(() => {
      newImage.remove();
      document.body.classList.remove('prevent-scroll');
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }, 1000);
  });
}

function setupContactform() {
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    window.location.href = `mailto:contact@abracadabra.com/?subject=${subject}&body=${message}`;
  });
}
