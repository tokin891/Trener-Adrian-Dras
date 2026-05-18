/* =============================================
   ADRIAN CALISTHENICS — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── AOS Init ──
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 60 });
  }

  // ── EmailJS Init ──
  if (typeof emailjs !== 'undefined') {
    emailjs.init('YOUR_PUBLIC_KEY'); // zastąp swoim kluczem EmailJS
  }

  // ── Smooth scroll ──
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Hamburger Menu ──
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks?.classList.toggle('open');
  });
  // Zamknij menu po kliknięciu linka
  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  // ── Floating CTA ──
  const floatingCta = document.getElementById('floatingCta');
  if (floatingCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        floatingCta.classList.add('show');
      } else {
        floatingCta.classList.remove('show');
      }
    });
  }

  // ── Instagram Popup (po 5 sek, raz na sesję) ──
  const igPopup = document.getElementById('igPopup');
  if (igPopup && !sessionStorage.getItem('igPopupShown')) {
    setTimeout(() => {
      igPopup.classList.add('active');
      sessionStorage.setItem('igPopupShown', '1');
    }, 5000);
  }

  // ── Zamknij Popupy ──
  document.querySelectorAll('.close-popup').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.ig-popup, .download-popup')?.classList.remove('active');
    });
  });
  document.querySelectorAll('.ig-popup, .download-popup').forEach(popup => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) popup.classList.remove('active');
    });
  });

  // ── Download Plan Button ──
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('downloadPopup')?.classList.add('active');
    });
  });

  // ── Download Form Submit ──
  const downloadForm = document.getElementById('downloadForm');
  const downloadMsg = document.getElementById('downloadMessage');
  downloadForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof emailjs !== 'undefined') {
      const params = {
        name: document.getElementById('downloadName').value,
        email: document.getElementById('downloadEmail').value,
        message: 'Prośba o darmowy plan: Nauka stania na rękach'
      };
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params)
        .then(() => {
          downloadMsg.textContent = '✅ Plan wysłany! Sprawdź swoją skrzynkę email.';
          downloadMsg.className = 'form-message success';
          downloadForm.reset();
          setTimeout(() => document.getElementById('downloadPopup')?.classList.remove('active'), 3000);
        })
        .catch(() => {
          downloadMsg.textContent = '❌ Coś poszło nie tak. Spróbuj ponownie.';
          downloadMsg.className = 'form-message error';
        });
    } else {
      downloadMsg.textContent = '✅ Dziękujemy! Plan zostanie wysłany na podany email.';
      downloadMsg.className = 'form-message success';
      downloadForm.reset();
    }
  });

  // ── Newsletter Form ──
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMessage');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof emailjs !== 'undefined') {
      const params = {
        name: document.getElementById('newsletterName').value,
        email: document.getElementById('newsletterEmail').value,
        message: 'Zapis do newslettera'
      };
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params)
        .then(() => {
          newsletterMsg.textContent = '✅ Zapisano! Witaj w społeczności!';
          newsletterMsg.className = 'form-message success';
          newsletterForm.reset();
        })
        .catch(() => {
          newsletterMsg.textContent = '❌ Coś poszło nie tak. Napisz bezpośrednio na email.';
          newsletterMsg.className = 'form-message error';
        });
    } else {
      newsletterMsg.textContent = '✅ Dziękujemy za zapis!';
      newsletterMsg.className = 'form-message success';
      newsletterForm.reset();
    }
  });

  // ── Contact Form ──
  window.submitForm = function(e) {
    e.preventDefault();
    const formMsg = document.getElementById('formMessage');
    if (typeof emailjs !== 'undefined') {
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      }).then(() => {
        formMsg.textContent = '✅ Wiadomość wysłana! Odpiszę w ciągu 24 godzin.';
        formMsg.className = 'form-message success';
        e.target.reset();
      }).catch(() => {
        formMsg.textContent = '❌ Błąd wysyłki. Napisz bezpośrednio na adriancalisthenics1@gmail.com';
        formMsg.className = 'form-message error';
      });
    } else {
      formMsg.textContent = '✅ Dziękujemy za wiadomość! Odpiszę wkrótce.';
      formMsg.className = 'form-message success';
    }
    return false;
  };

  // ── FAQ Toggle ──
  window.toggleFaq = function(btn) {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = btn.classList.contains('open');

    // Zamknij wszystkie
    document.querySelectorAll('.faq-question.open').forEach(q => {
      q.classList.remove('open');
      q.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
    });

    // Otwórz kliknięty (jeśli był zamknięty)
    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  };

  // ── Testimonial Carousel ──
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('tDots');
  let currentSlide = 0;
  let autoplayTimer;

  if (cards.length > 0 && dotsContainer) {
    // Utwórz kropki
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(idx) {
      cards[currentSlide].classList.remove('active');
      dotsContainer.querySelectorAll('.t-dot')[currentSlide].classList.remove('active');
      currentSlide = (idx + cards.length) % cards.length;
      cards[currentSlide].classList.add('active');
      dotsContainer.querySelectorAll('.t-dot')[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    document.querySelector('.t-next')?.addEventListener('click', () => { clearInterval(autoplayTimer); nextSlide(); startAutoplay(); });
    document.querySelector('.t-prev')?.addEventListener('click', () => { clearInterval(autoplayTimer); prevSlide(); startAutoplay(); });

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 5000);
    }
    startAutoplay();
  }

  // ── Cookie Banner ──
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  if (cookieBanner && !localStorage.getItem('cookieChoice')) {
    setTimeout(() => cookieBanner.classList.add('show'), 2000);
  }
  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('cookieChoice', 'accepted');
    cookieBanner.classList.remove('show');
  });
  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('cookieChoice', 'declined');
    cookieBanner.classList.remove('show');
  });

  // ── Aktywny link nawigacji przy scrollu ──
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinkEls.forEach(link => {
      link.style.color = link.href.includes(current) && current ? 'var(--primary)' : '';
    });
  }, { passive: true });

});
