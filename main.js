// Instagram Popup /
document.addEventListener('DOMContentLoaded', () => {
  const igPopup = document.getElementById('igPopup');
  const closePopup = document.querySelector('.close-popup');
  
  // Sprawdź czy użytkownik już nie zamknął popupa w TEJ SESJI
  if(!sessionStorage.getItem('igPopupClosed')) {
    setTimeout(() => {
      igPopup.classList.add('active');
    }, 10000); // 10 sekund
  }

  // Zamknij popup
  closePopup.addEventListener('click', () => {
    igPopup.classList.remove('active');
    sessionStorage.setItem('igPopupClosed', 'true');
  });

  // Zamknij po kliknięciu na tło
  igPopup.addEventListener('click', (e) => {
    if (e.target === igPopup) {
      igPopup.classList.remove('active');
      sessionStorage.setItem('igPopupClosed', 'true');
    }
  });
});

// Inicjalizacja AOS
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });

  emailjs.init("1DadQvoshUBA9gEBz"); // Twój klucz EmailJS

  // Smooth scroll dla przycisków i linków
  document.querySelectorAll('[data-scroll], a[href^="#"]').forEach(el => {
    el.addEventListener('click', e => {
      const targetId = el.getAttribute('data-scroll') || el.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Podświetlanie aktywnego linku
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 300)) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // FAQ toggle
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('active');
    });
  });

  // Newsletter
  const showMessage = (message, type) => {
    const messageEl = document.getElementById('newsletterMessage');
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    messageEl.style.display = 'block';
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  };

  document.getElementById('newsletterForm')?.addEventListener('submit', e => {
    e.preventDefault();
    emailjs.sendForm('service_i0u8qkg', 'template_nbdham8', e.target)
      .then(() => {
        showMessage("Dziękujemy za zapisanie się do newslettera!", "success");
        e.target.reset();
      })
      .catch(error => {
        showMessage("Wystąpił błąd: " + error.text, "error");
      });
  });

  // Karuzela opinii
  const slides = document.querySelectorAll('.testimonial-slide');
  if (slides.length) {
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentSlide = 0;
    let slideInterval;

    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    const goToSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
    const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

    const startInterval = () => { slideInterval = setInterval(nextSlide, 15000); };
    const resetInterval = () => { clearInterval(slideInterval); startInterval(); };

    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    startInterval();
  }
});

// Dodaj na początku pliku, po DOMContentLoaded
const downloadPopup = document.getElementById('downloadPopup');
const downloadForm = document.getElementById('downloadForm');
const downloadMessage = document.getElementById('downloadMessage');
const downloadBtns = document.querySelectorAll('.download-btn');

// Otwórz popup po kliknięciu przycisku "Pobierz plan"
downloadBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    downloadPopup.classList.add('active');
  });
});

// Zamknij popup
document.querySelector('.download-popup .close-popup').addEventListener('click', () => {
  downloadPopup.classList.remove('active');
});

// Zamknij po kliknięciu na tło
downloadPopup.addEventListener('click', (e) => {
  if (e.target === downloadPopup) {
    downloadPopup.classList.remove('active');
  }
});

// Obsługa formularza pobierania
downloadForm.addEventListener('submit', e => {
  e.preventDefault();
  
  const name = document.getElementById('downloadName').value;
  const email = document.getElementById('downloadEmail').value;
  
  // Wyślij dane do EmailJS
  emailjs.sendForm('service_i0u8qkg', 'template_nbdham8', e.target)
    .then(() => {
      showDownloadMessage("Dziękujemy! Rozpoczynam pobieranie planu...", "success");
      
      // Utwórz link do pobrania
      const link = document.createElement('a');
      link.href = 'file/Plan Treningowy pod HANDTSAND.pdf';
      link.download = 'Plan Treningowy - Stanie na rękach - Adrian Dras.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Wyczyść formularz i zamknij popup
      downloadForm.reset();
      setTimeout(() => {
        downloadPopup.classList.remove('active');
      }, 2000);
    })
    .catch(error => {
      showDownloadMessage("Wystąpił błąd: " + error.text, "error");
    });
});

function showDownloadMessage(message, type) {
  downloadMessage.textContent = message;
  downloadMessage.className = `form-message ${type}`;
  downloadMessage.style.display = 'block';
  setTimeout(() => {
    downloadMessage.style.display = 'none';
  }, 5000);
}