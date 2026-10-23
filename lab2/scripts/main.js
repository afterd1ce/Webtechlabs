document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. БУРГЕР-МЕНЮ
  // ==========================================
  const burgerBtn = document.querySelector('.burger-btn');
  const mainNav = document.getElementById('main-nav');

  burgerBtn.addEventListener('click', () => {
    const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
    burgerBtn.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('is-open');
  });

  mainNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth < 600) {
      burgerBtn.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    }
  });

  // ==========================================
  // 2. ТАБЫ
  // ==========================================
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  function switchTab(newTab) {
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => p.hidden = true);

    newTab.setAttribute('aria-selected', 'true');
    newTab.setAttribute('tabindex', '0');
    newTab.focus();
    
    const panelId = newTab.getAttribute('aria-controls');
    document.getElementById(panelId).hidden = false;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab));
    
    tab.addEventListener('keydown', (e) => {
      const currentIndex = Array.from(tabs).indexOf(tab);
      let newIndex;
      if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = tabs.length - 1;
      else return;
      
      e.preventDefault();
      switchTab(tabs[newIndex]);
    });
  });

  // ==========================================
  // 3. АККОРДЕОН
  // ==========================================
  const accButtons = document.querySelectorAll('.accordion-header');

  accButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      
      const contentId = btn.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      content.hidden = isExpanded;
    });
  });

  // ==========================================
  // 4. ДЕЛЕГИРОВАНИЕ СОБЫТИЙ
  // ==========================================
  const starsContainer = document.getElementById('stars-container');
  
  starsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.like-btn');
    if (!btn) return;

    const isPressed = btn.getAttribute('aria-pressed') === 'true';
    const countSpan = btn.querySelector('.like-count');
    const heartSpan = btn.querySelector('.heart');
    
    let count = parseInt(countSpan.textContent, 10);
    
    if (isPressed) {
      btn.setAttribute('aria-pressed', 'false');
      countSpan.textContent = count - 1;
      heartSpan.textContent = '♡';
    } else {
      btn.setAttribute('aria-pressed', 'true');
      countSpan.textContent = count + 1;
      heartSpan.textContent = '♥';
    }
  });

  // ==========================================
  // 5. МОДАЛЬНОЕ ОКНО И ВАЛИДАЦИЯ
  // ==========================================
  const modalOverlay = document.getElementById('modal-overlay');
  const openBtn = document.getElementById('open-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('feedback-form');
  
  openBtn.addEventListener('click', () => {
    modalOverlay.hidden = false;
    setTimeout(() => document.getElementById('name').focus(), 50);
  });

  const closeModal = () => {
    modalOverlay.hidden = true;
    openBtn.focus();
  };

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  const errorFields = {
    name: document.getElementById('error-name'),
    email: document.getElementById('error-email'),
    message: document.getElementById('error-message')
  };

  function validateForm() {
    let isValid = true;

    if (nameInput.value.trim() === '') {
      errorFields.name.textContent = 'Пожалуйста, введите имя.';
      isValid = false;
    } else {
      errorFields.name.textContent = '';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      errorFields.email.textContent = 'Введите корректный e-mail.';
      isValid = false;
    } else {
      errorFields.email.textContent = '';
    }

    if (messageInput.value.trim().length < 20) {
      errorFields.message.textContent = 'Сообщение должно содержать минимум 20 символов.';
      isValid = false;
    } else {
      errorFields.message.textContent = '';
    }

    submitBtn.disabled = !isValid;
    return isValid;
  }

  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', validateForm);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    successMsg.hidden = false;
    form.reset();
    submitBtn.disabled = true;
    
    setTimeout(() => {
      successMsg.hidden = true;
      closeModal();
    }, 3000);
  });
});