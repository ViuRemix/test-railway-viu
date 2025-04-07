document.addEventListener('alpine:init', () => {
  Alpine.data('slider', () => ({
      currentSlide: 0,
      slides: [],
      init() {
          this.slides = document.querySelectorAll('[id^="slide-"]');
          this.showSlide(this.currentSlide);
          setInterval(() => this.nextSlide(), 5000);
      },
      nextSlide() {
          this.currentSlide = (this.currentSlide + 1) % this.slides.length;
          this.showSlide(this.currentSlide);
      },
      prevSlide() {
          this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
          this.showSlide(this.currentSlide);
      },
      goToSlide(index) {
          this.currentSlide = index;
          this.showSlide(this.currentSlide);
      },
      showSlide(index) {
          this.slides.forEach((slide, i) => {
              slide.style.opacity = i === index ? '1' : '0';
          });
      }
  }));
});

