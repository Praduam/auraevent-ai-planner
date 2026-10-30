/**
 * ui-components.js
 * Visual components: Canvas Donut Chart, Confetti Cannon, Toasts, Modals,
 * Countdown Timer, and Markdown Renderer.
 */

// --- Toast System ---
class ToastManager {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-up`;
    
    const icon = type === 'success' ? '✓' :
                 type === 'error' ? '✕' :
                 type === 'warning' ? '⚠' : '✦';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">${message}</div>
      <button class="toast-close" aria-label="Close Toast">×</button>
    `;

    toast.querySelector('.toast-close').onclick = () => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 250);
    };

    this.container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 250);
      }
    }, duration);
  }
}

// --- Confetti Micro-Cannon ---
class ConfettiCannon {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.className = 'confetti-canvas';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animating = false;

    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(originX, originY) {
    const x = originX || window.innerWidth / 2;
    const y = originY || window.innerHeight / 3;
    const colors = ['#f59e0b', '#ec4899', '#6366f1', '#10b981', '#38bdf8', '#fbbf24', '#ffffff'];

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 8 + 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: Math.random() * 12 - 6,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.render();
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.rotation += p.vr;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.render());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// --- Canvas Donut Chart for Budget ---
class BudgetChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.colors = [
      '#6366f1', '#ec4899', '#f59e0b', '#10b981',
      '#06b6d4', '#8b5cf6', '#f97316', '#14b8a6', '#64748b'
    ];
  }

  draw(budgetItems, currency = '₹') {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (!budgetItems || budgetItems.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No budget data recorded yet', width / 2, height / 2);
      return;
    }

    // Group by category
    const categories = {};
    let totalSpent = 0;
    budgetItems.forEach(item => {
      const val = item.actual > 0 ? item.actual : item.allocated;
      if (val > 0) {
        categories[item.category] = (categories[item.category] || 0) + val;
        totalSpent += val;
      }
    });

    const entries = Object.entries(categories);
    if (entries.length === 0 || totalSpent === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add expenses to view distribution', width / 2, height / 2);
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;
    const innerRadius = radius * 0.65;

    let startAngle = -Math.PI / 2;

    entries.forEach(([cat, val], idx) => {
      const sliceAngle = (val / totalSpent) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      const color = this.colors[idx % this.colors.length];

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Subtle slice separator
      ctx.strokeStyle = '#0b0f19';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Inner center text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('TOTAL COMMITTED', centerX, centerY - 2);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px Outfit, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(`${currency}${totalSpent.toLocaleString('en-IN')}`, centerX, centerY + 2);
  }
}

// --- Countdown Timer Helper ---
function startCountdownTimer(dateString, elementIds) {
  function update() {
    const target = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    const daysEl = document.getElementById(elementIds.days);
    const hoursEl = document.getElementById(elementIds.hours);
    const minsEl = document.getElementById(elementIds.mins);
    const secsEl = document.getElementById(elementIds.secs);

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(h).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(m).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(s).padStart(2, '0');
  }

  update();
  return setInterval(update, 1000);
}

// --- Lightweight Markdown to HTML Renderer ---
function parseMarkdown(md) {
  if (!md) return '';
  let html = md
    // Escape basic HTML to avoid XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headings
    .replace(/^### (.*$)/gim, '<h4 class="ai-heading">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="ai-heading">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 class="ai-heading">$1</h2>')
    // Bold & italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Unordered lists
    .replace(/^\s*•\s+(.*$)/gim, '<li class="ai-list-item">$1</li>')
    .replace(/^\s*-\s+(.*$)/gim, '<li class="ai-list-item">$1</li>')
    .replace(/^\s*\*\s+(.*$)/gim, '<li class="ai-list-item">$1</li>')
    // Ordered lists
    .replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li class="ai-list-num" value="$1">$2</li>')
    // Code blocks / inline code
    .replace(/`(.*?)`/g, '<code class="ai-code">$1</code>')
    // Paragraphs / double breaks
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  return `<p>${html}</p>`;
}

// --- Accessible Modal Helper ---
const ModalManager = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Focus on first input
    const firstInput = modal.querySelector('input, select, textarea, button');
    if (firstInput) firstInput.focus();

    // Close on backdrop click
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.onclick = () => ModalManager.close(modalId);
    }

    // Close on buttons
    const closeBtns = modal.querySelectorAll('[data-close-modal]');
    closeBtns.forEach(btn => {
      btn.onclick = () => ModalManager.close(modalId);
    });
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  },

  closeAll() {
    document.querySelectorAll('.modal.is-active').forEach(m => {
      m.classList.remove('is-active');
    });
    document.body.style.overflow = '';
  }
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ModalManager.closeAll();
  }
});

// Global UI instances
window.toast = new ToastManager();
window.confetti = new ConfettiCannon();
window.ModalManager = ModalManager;
window.startCountdownTimer = startCountdownTimer;
window.BudgetChart = BudgetChart;
window.parseMarkdown = parseMarkdown;
