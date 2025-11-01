document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelector(".slides");
  const slideList = document.querySelectorAll(".slide");
  const totalSlides = slideList.length;
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const currentSlideText = document.getElementById("current-slide");
  const totalSlideText = document.getElementById("total-slides");

  totalSlideText.textContent = totalSlides;

  let currentSlide = 0;

  function updateSlider() {
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    currentSlideText.textContent = currentSlide + 1;
  }

  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  let startX = 0;
  slides.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  slides.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextBtn.click();
    else if (endX - startX > 50) prevBtn.click();
  });

  let autoSlide = setInterval(() => nextBtn.click(), 5000);
  document.querySelector(".slider-container").addEventListener("mouseenter", () => clearInterval(autoSlide));
  document.querySelector(".slider-container").addEventListener("mouseleave", () => autoSlide = setInterval(() => nextBtn.click(), 5000));
});

