/**
 * app.js
 * Main Controller & Event Dispatcher for AuraEvent AI.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global components & references
  let countdownInterval = null;
  const budgetChart = new window.BudgetChart('budgetDonutCanvas');

  // DOM Elements
  const eventSelectDropdown = document.getElementById('event-select-dropdown');
  const heroBannerCard = document.getElementById('hero-banner-card');
  const heroBannerImg = document.getElementById('hero-banner-img');
  const heroEventTitle = document.getElementById('hero-event-title');
  const heroBadgeType = document.getElementById('hero-badge-type');
  const heroBadgeHealth = document.getElementById('hero-badge-health');
  const heroMetaDate = document.getElementById('hero-meta-date');
  const heroMetaLocation = document.getElementById('hero-meta-location');
  const heroMetaGuests = document.getElementById('hero-meta-guests');
  const heroMetaBudget = document.getElementById('hero-meta-budget');

  // AI Drawer Elements
  const aiDrawerBackdrop = document.getElementById('ai-drawer-backdrop');
  const openAiDrawerBtn = document.getElementById('open-ai-drawer-btn');
  const closeAiDrawerBtn = document.getElementById('close-ai-drawer-btn');
  const aiChatMessages = document.getElementById('ai-chat-messages-container');
  const aiChatInput = document.getElementById('ai-chat-input');
  const aiChatSendBtn = document.getElementById('ai-chat-send-btn');

  // --- Initialize App ---
  function init() {
    setupEventListeners();
    populateEventDropdown();
    renderCurrentEvent();
  }

  // --- Populate Event Switcher ---
  function populateEventDropdown() {
    const events = window.dataStore.getEvents();
    const current = window.dataStore.getCurrentEvent();
    eventSelectDropdown.innerHTML = '';

    events.forEach(evt => {
      const opt = document.createElement('option');
      opt.value = evt.id;
      const icon = evt.type === 'wedding' ? '💍' : evt.type === 'birthday' ? '🎂' : '🎪';
      opt.textContent = `${icon} ${evt.title}`;
      if (evt.id === current.id) {
        opt.selected = true;
      }
      eventSelectDropdown.appendChild(opt);
    });
  }

  // --- Render Full Current Event ---
  function renderCurrentEvent() {
    const evt = window.dataStore.getCurrentEvent();
    if (!evt) return;

    // 1. Hero Banner
    heroEventTitle.textContent = evt.title;
    heroBannerImg.src = evt.heroImage || 'assets/images/wedding-hero.jpg';
    heroBannerImg.alt = `${evt.title} Banner`;

    const icon = evt.type === 'wedding' ? '💍 Wedding' :
                 evt.type === 'birthday' ? '🎂 Milestone Birthday' :
                 evt.type === 'community' ? '🎪 Community Festival' : '✨ Bespoke Celebration';
    heroBadgeType.textContent = icon;
    heroBadgeHealth.textContent = `Health Score: ${evt.healthScore || 85}%`;

    const formattedDate = new Date(evt.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    heroMetaDate.innerHTML = `📅 ${formattedDate}`;
    heroMetaLocation.innerHTML = `📍 ${evt.location}`;
    heroMetaGuests.innerHTML = `👥 ${evt.guestCount} Guests`;
    heroMetaBudget.innerHTML = `💰 ${evt.currency}${evt.budgetTotal.toLocaleString('en-IN')} Total Budget`;

    // 2. Countdown Timer
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = window.startCountdownTimer(evt.date + 'T16:00:00', {
      days: 'countdown-days',
      hours: 'countdown-hours',
      mins: 'countdown-mins',
      secs: 'countdown-secs'
    });

    // 3. Render Tabs & Sub-views
    renderOverviewTab(evt);
    renderBudgetTab(evt);
    renderTimelineTab(evt);
    renderVendorsTab(evt);
    renderIdeasTab(evt);
    renderGuestsTab(evt);
  }

  // --- Render Overview Tab ---
  function renderOverviewTab(evt) {
    const curr = evt.currency || '₹';
    const totalAllocated = (evt.budget || []).reduce((acc, b) => acc + (b.allocated || 0), 0);
    const totalActual = (evt.budget || []).reduce((acc, b) => acc + (b.actual || 0), 0);
    const committed = totalActual > 0 ? totalActual : totalAllocated;
    const budgetPct = Math.min(100, Math.round((committed / evt.budgetTotal) * 100));

    // KPI Values
    document.getElementById('kpi-budget-value').textContent = `${curr}${committed.toLocaleString('en-IN')}`;
    document.getElementById('kpi-budget-subtext').textContent = `of ${curr}${evt.budgetTotal.toLocaleString('en-IN')} allocated (${budgetPct}%)`;
    document.getElementById('kpi-budget-bar').style.width = `${budgetPct}%`;

    // Timeline KPI
    const totalTimeline = evt.timeline ? evt.timeline.length : 0;
    const completedTimeline = evt.timeline ? evt.timeline.filter(t => t.completed).length : 0;
    const timelinePct = totalTimeline > 0 ? Math.round((completedTimeline / totalTimeline) * 100) : 0;
    document.getElementById('kpi-timeline-value').textContent = `${completedTimeline} / ${totalTimeline}`;
    document.getElementById('kpi-timeline-bar').style.width = `${timelinePct}%`;

    // Vendor KPI
    const totalVendors = evt.vendors ? evt.vendors.length : 0;
    const bookedVendors = evt.vendors ? evt.vendors.filter(v => v.status === 'Booked' || v.status === 'Completed').length : 0;
    const vendorPct = totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0;
    document.getElementById('kpi-vendor-value').textContent = `${bookedVendors} / ${totalVendors} Booked`;
    document.getElementById('kpi-vendor-subtext').textContent = `${vendorPct}% locked in`;
    document.getElementById('kpi-vendor-bar').style.width = `${vendorPct}%`;

    // Guest KPI
    const attendingGuests = (evt.guests || []).filter(g => g.rsvp === 'Attending').reduce((acc, g) => acc + g.count, 0);
    const declinedGuests = (evt.guests || []).filter(g => g.rsvp === 'Declined').reduce((acc, g) => acc + g.count, 0);
    const pendingGuests = (evt.guests || []).filter(g => g.rsvp === 'Pending').reduce((acc, g) => acc + g.count, 0);
    document.getElementById('kpi-guest-value').textContent = `${attendingGuests} Attending`;
    document.getElementById('kpi-guest-subtext').textContent = `${declinedGuests} declined • ${pendingGuests} pending`;

    // Badges in Tabs
    const badgeBudget = evt.budgetTotal >= 100000 ? `${(evt.budgetTotal / 100000).toFixed(1)}L` : `${(evt.budgetTotal / 1000).toFixed(1)}k`;
    document.getElementById('budget-tab-badge').textContent = `${curr}${badgeBudget}`;
    document.getElementById('timeline-tab-badge').textContent = `${totalTimeline} Tasks`;
    document.getElementById('vendor-tab-badge').textContent = `${totalVendors} Partners`;
    document.getElementById('ideas-tab-badge').textContent = `${evt.ideas ? evt.ideas.length : 0} Concepts`;
    document.getElementById('guests-tab-badge').textContent = `${evt.guestCount}`;

    // AI Strategic Brief
    const briefBox = document.getElementById('ai-brief-content-box');
    briefBox.innerHTML = `
      <p style="margin-bottom: 0.75rem;">
        <strong>Strategic Overview:</strong> Planning for <em>${evt.title}</em> is progressing with an optimal health rating of <strong>${evt.healthScore || 85}%</strong>. You currently have <strong>${bookedVendors} of ${totalVendors}</strong> core vendor categories confirmed.
      </p>
      <div style="background: rgba(243, 186, 47, 0.08); border-left: 3px solid var(--gold-primary); padding: 0.65rem 0.85rem; border-radius: 4px; font-size: 0.85rem; margin-bottom: 0.75rem;">
        <strong>💡 Key AI Insight:</strong> Your committed budget stands at <strong>${budgetPct}%</strong>. We recommend locking your final catering numbers 7 days prior to prevent per-plate overage penalties.
      </div>
      <p style="font-size: 0.82rem; color: var(--text-muted);">
        Aesthetic Vibe: <em>${evt.vibe}</em>
      </p>
    `;

    // Overview Upcoming Milestones (Next 3 uncompleted)
    const upcomingList = document.getElementById('overview-upcoming-timeline-list');
    upcomingList.innerHTML = '';
    const uncompleted = (evt.timeline || []).filter(t => !t.completed).slice(0, 4);
    if (uncompleted.length === 0) {
      upcomingList.innerHTML = `<div style="color: var(--emerald-primary); padding: 1rem 0;">🎉 All scheduled milestones and cues completed!</div>`;
    } else {
      uncompleted.forEach(item => {
        const row = createTimelineRowElement(item, evt);
        upcomingList.appendChild(row);
      });
    }

    // Palette Preview
    renderPaletteStrip(document.getElementById('overview-palette-strip'), evt.palette);
  }

  // --- Render Palette Swatches ---
  function renderPaletteStrip(container, palette) {
    if (!container) return;
    container.innerHTML = '';
    if (!palette || palette.length === 0) {
      container.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8rem;">No color palette set</span>';
      return;
    }

    palette.forEach(color => {
      const box = document.createElement('div');
      box.className = 'palette-swatch-box';
      box.title = `Click to copy ${color.hex}`;
      box.innerHTML = `
        <div class="swatch-circle" style="background-color: ${color.hex};"></div>
        <span class="swatch-text">${color.name} <small style="color: var(--text-muted); font-weight: 400;">(${color.hex})</small></span>
      `;
      box.onclick = () => {
        navigator.clipboard.writeText(color.hex);
        window.toast.show(`Copied ${color.hex} (${color.name}) to clipboard!`, 'success');
        window.confetti.fire();
      };
      container.appendChild(box);
    });
  }

  // --- Render Budget Tab ---
  function renderBudgetTab(evt) {
    const curr = evt.currency || '$';
    const items = evt.budget || [];

    let totalAllocated = 0;
    let totalActual = 0;
    let totalPaid = 0;

    items.forEach(b => {
      totalAllocated += (b.allocated || 0);
      const act = (b.actual || 0);
      totalActual += act;
      if (b.status === 'Paid') {
        totalPaid += act > 0 ? act : b.allocated;
      }
    });

    const remaining = evt.budgetTotal - (totalActual > 0 ? totalActual : totalAllocated);

    document.getElementById('budget-stat-allocated').textContent = `${curr}${totalAllocated.toLocaleString('en-IN')}`;
    document.getElementById('budget-stat-actual').textContent = `${curr}${totalActual.toLocaleString('en-IN')}`;
    document.getElementById('budget-stat-paid').textContent = `${curr}${totalPaid.toLocaleString('en-IN')}`;
    document.getElementById('budget-stat-remaining').textContent = `${curr}${remaining.toLocaleString('en-IN')}`;

    // Draw Donut Chart
    budgetChart.draw(items, curr);

    // Populate Expense Table
    const tbody = document.getElementById('budget-table-body');
    tbody.innerHTML = '';

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No expenses added yet. Click "+ Add Expense" or ask AI to populate!</td></tr>`;
      return;
    }

    items.forEach(item => {
      const tr = document.createElement('tr');
      const statusClass = item.status === 'Paid' ? 'status-paid' :
                          item.status === 'Invoiced' ? 'status-invoiced' : 'status-estimated';

      tr.innerHTML = `
        <td><span class="badge badge-glass">${item.category}</span></td>
        <td><strong>${item.item}</strong></td>
        <td>${curr}${item.allocated.toLocaleString('en-IN')}</td>
        <td>${curr}${item.actual.toLocaleString('en-IN')}</td>
        <td><span class="status-badge ${statusClass}">${item.status}</span></td>
        <td>${item.dueDate || '—'}</td>
        <td style="font-size: 0.8rem; color: var(--text-secondary); max-width: 180px;">${item.notes || '—'}</td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn-icon-only edit-expense-btn" data-id="${item.id}" title="Edit Expense" style="width: 28px; height: 28px; font-size: 0.75rem;">✎</button>
            <button class="btn-icon-only delete-expense-btn" data-id="${item.id}" title="Delete Expense" style="width: 28px; height: 28px; font-size: 0.75rem; color: #ef4444;">✕</button>
          </div>
        </td>
      `;

      // Event handlers
      tr.querySelector('.edit-expense-btn').onclick = () => openEditExpenseModal(item);
      tr.querySelector('.delete-expense-btn').onclick = () => {
        if (confirm(`Remove expense "${item.item}"?`)) {
          window.dataStore.deleteExpense(evt.id, item.id);
          window.toast.show(`Removed expense "${item.item}"`, 'info');
          renderCurrentEvent();
        }
      };

      tbody.appendChild(tr);
    });
  }

  // --- Render Timeline Tab ---
  function renderTimelineTab(evt) {
    const activeFilterBtn = document.querySelector('.timeline-toggle-btn.is-active');
    const filterPhase = activeFilterBtn ? activeFilterBtn.dataset.phase : 'all';

    const fullList = document.getElementById('timeline-full-list');
    fullList.innerHTML = '';

    let items = evt.timeline || [];
    if (filterPhase !== 'all') {
      items = items.filter(t => t.phase === filterPhase);
    }

    if (items.length === 0) {
      fullList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No tasks found in this section. Click "+ Add Milestone / Cue" above!</div>`;
      return;
    }

    items.forEach(item => {
      const row = createTimelineRowElement(item, evt);
      fullList.appendChild(row);
    });
  }

  function createTimelineRowElement(item, evt) {
    const div = document.createElement('div');
    div.className = `timeline-item-card ${item.completed ? 'is-completed' : ''}`;
    div.innerHTML = `
      <div class="custom-checkbox ${item.completed ? 'is-checked' : ''}" data-id="${item.id}" title="Toggle Completion">
        ✓
      </div>
      <div class="timeline-time-pill">${item.time}</div>
      <div class="timeline-task-info">
        <div class="timeline-task-title">${item.task}</div>
        <div class="timeline-task-meta">
          <span>👤 Lead: <strong>${item.lead || 'Organizer'}</strong></span>
          <span>🏷️ ${item.category || 'Coordination'}</span>
          <span style="color: var(--text-muted);">${item.phase}</span>
        </div>
      </div>
      <div class="table-actions">
        <button class="btn-icon-only edit-timeline-btn" data-id="${item.id}" title="Edit Milestone" style="width: 28px; height: 28px; font-size: 0.75rem;">✎</button>
        <button class="btn-icon-only delete-timeline-btn" data-id="${item.id}" title="Delete Milestone" style="width: 28px; height: 28px; font-size: 0.75rem; color: #ef4444;">✕</button>
      </div>
    `;

    // Checkbox toggle
    div.querySelector('.custom-checkbox').onclick = () => {
      const updated = !item.completed;
      window.dataStore.updateTimelineItem(evt.id, item.id, { completed: updated });
      if (updated) {
        window.confetti.fire();
        window.toast.show(`Completed: "${item.task}"!`, 'success');
      }
      renderCurrentEvent();
    };

    // Edit button
    div.querySelector('.edit-timeline-btn').onclick = () => openEditTimelineModal(item);

    // Delete button
    div.querySelector('.delete-timeline-btn').onclick = () => {
      if (confirm(`Remove timeline task "${item.task}"?`)) {
        window.dataStore.deleteTimelineItem(evt.id, item.id);
        window.toast.show(`Removed milestone task`, 'info');
        renderCurrentEvent();
      }
    };

    return div;
  }

  // --- Render Vendors Tab ---
  function renderVendorsTab(evt) {
    const grid = document.getElementById('vendor-cards-grid');
    grid.innerHTML = '';

    const curr = evt.currency || '₹';
    const searchTerm = (document.getElementById('vendor-search-input').value || '').toLowerCase();
    const statusFilter = document.getElementById('vendor-status-filter').value;

    let vendors = evt.vendors || [];

    if (statusFilter !== 'all') {
      vendors = vendors.filter(v => v.status === statusFilter);
    }

    if (searchTerm) {
      vendors = vendors.filter(v => 
        (v.name || '').toLowerCase().includes(searchTerm) ||
        (v.category || '').toLowerCase().includes(searchTerm) ||
        (v.notes || '').toLowerCase().includes(searchTerm)
      );
    }

    if (vendors.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">No vendor partners matching your filters. Click "+ Add Vendor" to add one!</div>`;
      return;
    }

    vendors.forEach(v => {
      const card = document.createElement('div');
      card.className = 'vendor-card';

      const statusClass = v.status === 'Booked' ? 'status-booked' :
                          v.status === 'In Talks' ? 'status-intalks' :
                          v.status === 'Completed' ? 'status-paid' : 'status-researching';

      let questionsHtml = '';
      if (v.vettingQuestions && v.vettingQuestions.length > 0) {
        questionsHtml = `
          <div class="vetting-accordion">
            <button class="vetting-toggle-btn">
              <span>🧠 AI Vetting Guide (${v.vettingQuestions.length} questions)</span> <span>▾</span>
            </button>
            <div class="vetting-content">
              <ul class="vetting-list">
                ${v.vettingQuestions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <div class="vendor-card-header">
            <div>
              <div class="vendor-category-pill">${v.category}</div>
              <h3 class="vendor-name">${v.name}</h3>
            </div>
            <span class="status-badge ${statusClass}">${v.status}</span>
          </div>

          <div class="vendor-pricing-row">
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Quoted / Contracted</div>
              <strong>${curr}${v.quoted ? v.quoted.toLocaleString('en-IN') : '0'}</strong>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Deposit Paid</div>
              <strong style="color: var(--emerald-primary);">${curr}${v.depositPaid ? v.depositPaid.toLocaleString('en-IN') : '0'}</strong>
            </div>
          </div>

          <div class="vendor-contact-pills">
            ${v.contactName ? `<span class="contact-pill">👤 ${v.contactName}</span>` : ''}
            ${v.phone ? `<a href="tel:${v.phone}" class="contact-pill">📞 ${v.phone}</a>` : ''}
            ${v.email ? `<a href="mailto:${v.email}" class="contact-pill">✉️ ${v.email}</a>` : ''}
          </div>

          ${v.notes ? `<p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem;">📝 ${v.notes}</p>` : ''}
          ${questionsHtml}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
          <button class="btn btn-secondary edit-vendor-btn" data-id="${v.id}" style="padding: 0.3rem 0.7rem; font-size: 0.75rem;">Edit Partner</button>
          <button class="btn btn-secondary delete-vendor-btn" data-id="${v.id}" style="padding: 0.3rem 0.7rem; font-size: 0.75rem; color: #ef4444;">Remove</button>
        </div>
      `;

      // Accordion toggle
      const vettingBtn = card.querySelector('.vetting-toggle-btn');
      if (vettingBtn) {
        vettingBtn.onclick = () => {
          const content = card.querySelector('.vetting-content');
          content.classList.toggle('is-open');
        };
      }

      // Edit / Delete
      card.querySelector('.edit-vendor-btn').onclick = () => openEditVendorModal(v);
      card.querySelector('.delete-vendor-btn').onclick = () => {
        if (confirm(`Remove vendor "${v.name}"?`)) {
          window.dataStore.deleteVendor(evt.id, v.id);
          window.toast.show(`Removed vendor "${v.name}"`, 'info');
          renderCurrentEvent();
        }
      };

      grid.appendChild(card);
    });
  }

  // --- Render Ideas Tab ---
  function renderIdeasTab(evt) {
    renderPaletteStrip(document.getElementById('ideas-palette-strip'), evt.palette);

    const grid = document.getElementById('ideas-cards-grid');
    grid.innerHTML = '';

    const ideas = evt.ideas || [];
    if (ideas.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">No ideas yet. Click "Generate with AI" or "+ Add Custom Idea"!</div>`;
      return;
    }

    ideas.forEach(idea => {
      const card = document.createElement('div');
      card.className = 'idea-card';
      card.innerHTML = `
        <div>
          <div class="idea-card-header">
            <span class="idea-category-tag">${idea.category}</span>
            <button class="idea-favorite-btn ${idea.favorite ? 'is-fav' : ''}" title="Favorite Idea">
              ${idea.favorite ? '♥' : '♡'}
            </button>
          </div>
          <h3 class="idea-title">${idea.title}</h3>
          <p class="idea-desc">${idea.description}</p>
        </div>
        <div>
          <div class="idea-tag-list">
            ${(idea.tags || []).map(t => `<span class="idea-tag-pill">#${t}</span>`).join('')}
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 0.75rem;">
            <button class="btn-icon-only delete-idea-btn" title="Delete Idea" style="width: 26px; height: 26px; font-size: 0.7rem; color: #ef4444;">✕</button>
          </div>
        </div>
      `;

      card.querySelector('.idea-favorite-btn').onclick = () => {
        window.dataStore.toggleIdeaFavorite(evt.id, idea.id);
        renderCurrentEvent();
      };

      card.querySelector('.delete-idea-btn').onclick = () => {
        window.dataStore.deleteIdea(evt.id, idea.id);
        window.toast.show(`Idea removed`, 'info');
        renderCurrentEvent();
      };

      grid.appendChild(card);
    });
  }

  // --- Render Guests Tab ---
  function renderGuestsTab(evt) {
    const tbody = document.getElementById('guests-table-body');
    tbody.innerHTML = '';

    const guests = evt.guests || [];
    if (guests.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No guests recorded yet. Click "+ Add Guest" to start tracking RSVPs!</td></tr>`;
      return;
    }

    guests.forEach(g => {
      const tr = document.createElement('tr');
      const rsvpBadge = g.rsvp === 'Attending' ? 'status-paid' :
                        g.rsvp === 'Pending' ? 'status-invoiced' : 'status-researching';

      tr.innerHTML = `
        <td><strong>${g.name}</strong></td>
        <td><span class="status-badge ${rsvpBadge}">${g.rsvp}</span></td>
        <td>${g.count} person(s)</td>
        <td>${g.meal || '—'}</td>
        <td><span class="badge badge-glass">${g.table || 'Unassigned'}</span></td>
        <td><span style="font-size: 0.8rem; color: ${g.diet && g.diet !== 'None' ? '#f472b6' : 'var(--text-muted)'};">${g.diet || 'None'}</span></td>
        <td style="text-align: right;">
          <button class="btn-icon-only delete-guest-btn" data-id="${g.id}" title="Remove Guest" style="width: 28px; height: 28px; font-size: 0.75rem; color: #ef4444;">✕</button>
        </td>
      `;

      tr.querySelector('.delete-guest-btn').onclick = () => {
        if (confirm(`Remove "${g.name}" from guest list?`)) {
          window.dataStore.deleteGuest(evt.id, g.id);
          window.toast.show(`Guest removed`, 'info');
          renderCurrentEvent();
        }
      };

      tbody.appendChild(tr);
    });
  }

  // --- AI Co-pilot Chat Logic ---
  async function sendAiMessage(promptText) {
    const text = (promptText || aiChatInput.value || '').trim();
    if (!text) return;

    aiChatInput.value = '';

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message chat-user';
    userMsg.innerHTML = `<div class="chat-bubble">${text}</div>`;
    aiChatMessages.appendChild(userMsg);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    // AI Response Container
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-message chat-ai';
    aiMsg.innerHTML = `
      <div class="chat-reasoning-block" style="display: none;"></div>
      <div class="chat-bubble">Generating response...</div>
      <div class="chat-action-btn-strip" style="display: none;"></div>
    `;
    aiChatMessages.appendChild(aiMsg);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    const reasoningEl = aiMsg.querySelector('.chat-reasoning-block');
    const bubbleEl = aiMsg.querySelector('.chat-bubble');
    const actionsEl = aiMsg.querySelector('.chat-action-btn-strip');

    const currentEvent = window.dataStore.getCurrentEvent();

    await window.aiEngine.streamChatResponse(
      text,
      currentEvent,
      (chunk) => {
        bubbleEl.innerHTML = window.parseMarkdown(chunk);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
      },
      (reasoningStep) => {
        reasoningEl.style.display = 'flex';
        reasoningEl.innerHTML = `<span>🧠</span> <em>${reasoningStep}</em>`;
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
      },
      (completeResult) => {
        if (completeResult.actions && completeResult.actions.length > 0) {
          actionsEl.style.display = 'flex';
          actionsEl.innerHTML = '';

          completeResult.actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'ai-action-inject-btn';
            btn.innerHTML = `<span>✦</span> ${action.label}`;
            btn.onclick = () => {
              applyAiAction(action, currentEvent);
              btn.disabled = true;
              btn.style.opacity = '0.5';
              btn.innerHTML = `<span>✓</span> Applied to Event Plan`;
            };
            actionsEl.appendChild(btn);
          });
        }
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
      }
    );
  }

  function applyAiAction(action, evt) {
    if (action.type === 'add_expense') {
      window.dataStore.addExpense(evt.id, action.data);
      window.toast.show(`Added "${action.data.item}" to Budget!`, 'success');
      window.confetti.fire();
      renderCurrentEvent();
    } else if (action.type === 'add_timeline') {
      window.dataStore.addTimelineItem(evt.id, action.data);
      window.toast.show(`Added "${action.data.task}" to Timeline!`, 'success');
      window.confetti.fire();
      renderCurrentEvent();
    } else if (action.type === 'add_vendor') {
      window.dataStore.addVendor(evt.id, action.data);
      window.toast.show(`Added "${action.data.name}" to Vendor CRM!`, 'success');
      window.confetti.fire();
      renderCurrentEvent();
    } else if (action.type === 'add_idea') {
      window.dataStore.addIdea(evt.id, action.data);
      window.toast.show(`Added "${action.data.title}" to Idea Studio!`, 'success');
      window.confetti.fire();
      renderCurrentEvent();
    }
  }

  // --- Modal Openers / Closers ---
  function openEditExpenseModal(expense) {
    document.getElementById('expense-modal-title').textContent = expense ? '✎ Edit Expense Item' : '+ Add Expense Item';
    document.getElementById('expense-edit-id').value = expense ? expense.id : '';
    document.getElementById('expense-category').value = expense ? expense.category : 'Venue & Rentals';
    document.getElementById('expense-item-name').value = expense ? expense.item : '';
    document.getElementById('expense-allocated').value = expense ? expense.allocated : 50000;
    document.getElementById('expense-actual').value = expense ? expense.actual : 0;
    document.getElementById('expense-status').value = expense ? expense.status : 'Estimated';
    document.getElementById('expense-duedate').value = expense ? expense.dueDate : '';
    document.getElementById('expense-notes').value = expense ? expense.notes : '';
    window.ModalManager.open('modal-expense');
  }

  function openEditTimelineModal(item) {
    document.getElementById('timeline-modal-title').textContent = item ? '✎ Edit Timeline Task' : '+ Add Timeline Task';
    document.getElementById('timeline-edit-id').value = item ? item.id : '';
    document.getElementById('timeline-phase').value = item ? item.phase : 'Run-of-Show';
    document.getElementById('timeline-time').value = item ? item.time : '';
    document.getElementById('timeline-task').value = item ? item.task : '';
    document.getElementById('timeline-lead').value = item ? item.lead : 'Planner';
    document.getElementById('timeline-category').value = item ? item.category : 'Coordination';
    window.ModalManager.open('modal-timeline');
  }

  function openEditVendorModal(vendor) {
    document.getElementById('vendor-modal-title').textContent = vendor ? '✎ Edit Vendor Partner' : '+ Add Vendor Partner';
    document.getElementById('vendor-edit-id').value = vendor ? vendor.id : '';
    document.getElementById('vendor-category').value = vendor ? vendor.category : '';
    document.getElementById('vendor-name').value = vendor ? vendor.name : '';
    document.getElementById('vendor-contact').value = vendor ? vendor.contactName : '';
    document.getElementById('vendor-phone').value = vendor ? vendor.phone : '';
    document.getElementById('vendor-email').value = vendor ? vendor.email : '';
    document.getElementById('vendor-quoted').value = vendor ? vendor.quoted : 0;
    document.getElementById('vendor-deposit').value = vendor ? vendor.depositPaid : 0;
    document.getElementById('vendor-status').value = vendor ? vendor.status : 'Researching';
    document.getElementById('vendor-notes').value = vendor ? vendor.notes : '';
    window.ModalManager.open('modal-vendor');
  }

  // --- Setup Global Listeners ---
  function setupEventListeners() {
    // Event Switcher dropdown
    eventSelectDropdown.addEventListener('change', (e) => {
      window.dataStore.setCurrentEvent(e.target.value);
      renderCurrentEvent();
      window.toast.show(`Loaded plan: ${window.dataStore.getCurrentEvent().title}`, 'info');
    });

    // Navigation Tabs Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        const targetPanel = document.getElementById(btn.dataset.tab);
        if (targetPanel) {
          targetPanel.classList.add('is-active');
        }

        // Redraw canvas if switching to budget
        if (btn.dataset.tab === 'tab-panel-budget') {
          setTimeout(() => {
            budgetChart.draw(window.dataStore.getCurrentEvent().budget, window.dataStore.getCurrentEvent().currency);
          }, 50);
        }
      });
    });

    // Timeline Mode Toggles (All, Milestones, Run of Show)
    document.querySelectorAll('.timeline-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timeline-toggle-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderTimelineTab(window.dataStore.getCurrentEvent());
      });
    });

    // Vendor Search & Status Filters
    document.getElementById('vendor-search-input').addEventListener('input', () => {
      renderVendorsTab(window.dataStore.getCurrentEvent());
    });
    document.getElementById('vendor-status-filter').addEventListener('change', () => {
      renderVendorsTab(window.dataStore.getCurrentEvent());
    });

    // AI Drawer Opening & Closing
    openAiDrawerBtn.onclick = () => aiDrawerBackdrop.classList.add('is-open');
    closeAiDrawerBtn.onclick = () => aiDrawerBackdrop.classList.remove('is-open');
    aiDrawerBackdrop.onclick = (e) => {
      if (e.target === aiDrawerBackdrop) aiDrawerBackdrop.classList.remove('is-open');
    };

    // AI Chat Send Button & Enter Key
    aiChatSendBtn.onclick = () => sendAiMessage();
    aiChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendAiMessage();
    });

    // Prompt Chips in Drawer
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => sendAiMessage(chip.dataset.prompt));
    });

    // Prompt Chips inside Overview Card
    document.querySelectorAll('.prompt-chip-launcher').forEach(btn => {
      btn.addEventListener('click', () => {
        aiDrawerBackdrop.classList.add('is-open');
        sendAiMessage(btn.dataset.prompt);
      });
    });

    // Header Quick Buttons
    document.getElementById('quick-ai-suggest-btn').onclick = () => {
      aiDrawerBackdrop.classList.add('is-open');
      sendAiMessage('Give me 3 high-impact tactical suggestions to elevate my current event plan.');
    };

    document.getElementById('refresh-ai-brief-btn').onclick = () => {
      window.toast.show('Synthesizing updated event brief...', 'info');
      renderOverviewTab(window.dataStore.getCurrentEvent());
    };

    document.getElementById('view-full-timeline-btn').onclick = () => {
      document.getElementById('tab-btn-timeline').click();
    };

    // AI Optimize Budget Button
    document.getElementById('ai-optimize-budget-btn').onclick = () => {
      aiDrawerBackdrop.classList.add('is-open');
      sendAiMessage('How can I optimize and safely cut 10-15% of my budget without sacrificing guest experience?');
    };

    // AI Generate Run of Show Button
    document.getElementById('ai-generate-runofshow-btn').onclick = () => {
      aiDrawerBackdrop.classList.add('is-open');
      sendAiMessage('Generate an optimized minute-by-minute Day-of Run-of-Show schedule with vendor cue times.');
    };

    // Trigger AI Ideas in Ideas Tab
    document.getElementById('trigger-ai-idea-btn').onclick = () => {
      const customPrompt = document.getElementById('quick-idea-prompt-input').value;
      aiDrawerBackdrop.classList.add('is-open');
      sendAiMessage(customPrompt || 'Generate 4 unique and memorable ideas for this celebration.');
      document.getElementById('quick-idea-prompt-input').value = '';
    };

    // Modal Triggers: Add Expense
    document.getElementById('open-add-expense-modal-btn').onclick = () => openEditExpenseModal(null);
    document.getElementById('submit-expense-btn').onclick = (e) => {
      e.preventDefault();
      const current = window.dataStore.getCurrentEvent();
      const editId = document.getElementById('expense-edit-id').value;
      const expenseData = {
        category: document.getElementById('expense-category').value,
        item: document.getElementById('expense-item-name').value,
        allocated: document.getElementById('expense-allocated').value,
        actual: document.getElementById('expense-actual').value,
        status: document.getElementById('expense-status').value,
        dueDate: document.getElementById('expense-duedate').value,
        notes: document.getElementById('expense-notes').value
      };

      if (!expenseData.item) {
        alert('Please enter an expense item name');
        return;
      }

      if (editId) {
        window.dataStore.updateExpense(current.id, editId, expenseData);
        window.toast.show('Expense updated!', 'success');
      } else {
        window.dataStore.addExpense(current.id, expenseData);
        window.toast.show('New expense added!', 'success');
        window.confetti.fire();
      }

      window.ModalManager.close('modal-expense');
      renderCurrentEvent();
    };

    // Modal Triggers: Add Timeline
    document.getElementById('open-add-timeline-modal-btn').onclick = () => openEditTimelineModal(null);
    document.getElementById('submit-timeline-btn').onclick = (e) => {
      e.preventDefault();
      const current = window.dataStore.getCurrentEvent();
      const editId = document.getElementById('timeline-edit-id').value;
      const timelineData = {
        phase: document.getElementById('timeline-phase').value,
        time: document.getElementById('timeline-time').value,
        task: document.getElementById('timeline-task').value,
        lead: document.getElementById('timeline-lead').value,
        category: document.getElementById('timeline-category').value,
        completed: false
      };

      if (!timelineData.task || !timelineData.time) {
        alert('Please fill in task description and time');
        return;
      }

      if (editId) {
        window.dataStore.updateTimelineItem(current.id, editId, timelineData);
        window.toast.show('Timeline milestone updated!', 'success');
      } else {
        window.dataStore.addTimelineItem(current.id, timelineData);
        window.toast.show('Milestone added!', 'success');
        window.confetti.fire();
      }

      window.ModalManager.close('modal-timeline');
      renderCurrentEvent();
    };

    // Modal Triggers: Add Vendor
    document.getElementById('open-add-vendor-modal-btn').onclick = () => openEditVendorModal(null);
    document.getElementById('submit-vendor-btn').onclick = (e) => {
      e.preventDefault();
      const current = window.dataStore.getCurrentEvent();
      const editId = document.getElementById('vendor-edit-id').value;
      const vendorData = {
        category: document.getElementById('vendor-category').value,
        name: document.getElementById('vendor-name').value,
        contactName: document.getElementById('vendor-contact').value,
        phone: document.getElementById('vendor-phone').value,
        email: document.getElementById('vendor-email').value,
        quoted: document.getElementById('vendor-quoted').value,
        depositPaid: document.getElementById('vendor-deposit').value,
        status: document.getElementById('vendor-status').value,
        notes: document.getElementById('vendor-notes').value
      };

      if (!vendorData.name) {
        alert('Please enter a vendor company name');
        return;
      }

      if (editId) {
        window.dataStore.updateVendor(current.id, editId, vendorData);
        window.toast.show('Vendor details saved!', 'success');
      } else {
        window.dataStore.addVendor(current.id, vendorData);
        window.toast.show('New vendor partner added!', 'success');
        window.confetti.fire();
      }

      window.ModalManager.close('modal-vendor');
      renderCurrentEvent();
    };

    // Modal Triggers: Add Custom Idea
    document.getElementById('open-add-custom-idea-modal-btn').onclick = () => window.ModalManager.open('modal-idea');
    document.getElementById('submit-idea-btn').onclick = (e) => {
      e.preventDefault();
      const current = window.dataStore.getCurrentEvent();
      const title = document.getElementById('idea-title').value;
      const desc = document.getElementById('idea-desc').value;
      const cat = document.getElementById('idea-category').value;
      const tags = document.getElementById('idea-tags').value;

      if (!title || !desc) {
        alert('Please enter a title and description');
        return;
      }

      window.dataStore.addIdea(current.id, {
        title,
        description: desc,
        category: cat,
        tags: tags ? tags.split(',').map(s => s.trim()) : ['Custom'],
        favorite: true
      });

      window.toast.show('Idea saved to Vision Board!', 'success');
      window.confetti.fire();
      window.ModalManager.close('modal-idea');
      renderCurrentEvent();
    };

    // Modal Triggers: Add Guest
    document.getElementById('open-add-guest-modal-btn').onclick = () => window.ModalManager.open('modal-guest');
    document.getElementById('submit-guest-btn').onclick = (e) => {
      e.preventDefault();
      const current = window.dataStore.getCurrentEvent();
      const name = document.getElementById('guest-name').value;
      const count = document.getElementById('guest-count').value;
      const rsvp = document.getElementById('guest-rsvp').value;
      const table = document.getElementById('guest-table').value;
      const meal = document.getElementById('guest-meal').value;
      const diet = document.getElementById('guest-diet').value;

      if (!name) {
        alert('Please enter guest name');
        return;
      }

      window.dataStore.addGuest(current.id, {
        name,
        count,
        rsvp,
        table,
        meal,
        diet
      });

      window.toast.show('Guest added!', 'success');
      window.ModalManager.close('modal-guest');
      renderCurrentEvent();
    };

    // Modal Triggers: Create Event with GenAI
    document.getElementById('open-new-event-modal-btn').onclick = () => window.ModalManager.open('modal-create-event');
    document.getElementById('submit-create-event-btn').onclick = async (e) => {
      e.preventDefault();
      const title = document.getElementById('new-event-title').value;
      const type = document.getElementById('new-event-type').value;
      const date = document.getElementById('new-event-date').value;
      const budget = document.getElementById('new-event-budget').value;
      const guests = document.getElementById('new-event-guests').value;
      const location = document.getElementById('new-event-location').value;
      const vibe = document.getElementById('new-event-vibe').value;

      if (!title || !date) {
        alert('Please provide an event title and target date');
        return;
      }

      const loadMsg = document.getElementById('create-event-loading-msg');
      loadMsg.style.display = 'block';

      const fullPlan = await window.aiEngine.generateFullEventPlan({
        title,
        type,
        date,
        budgetTotal: budget,
        guestCount: guests,
        location,
        vibe
      }, (step) => {
        loadMsg.innerHTML = `🧠 <em>${step}</em>`;
      });

      window.dataStore.createEvent(fullPlan);
      loadMsg.style.display = 'none';
      window.ModalManager.close('modal-create-event');
      populateEventDropdown();
      renderCurrentEvent();
      window.confetti.fire();
      window.toast.show(`✨ AI Plan successfully generated for "${title}"!`, 'success');
    };

    // Export & Print Modal
    document.getElementById('open-export-modal-btn').onclick = () => window.ModalManager.open('modal-export');
    document.getElementById('trigger-browser-print-btn').onclick = () => {
      window.ModalManager.close('modal-export');
      setTimeout(() => window.print(), 300);
    };

    // Download JSON
    document.getElementById('download-json-backup-btn').onclick = () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(window.dataStore.exportToJson());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `AuraEvent_AI_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      window.toast.show('JSON backup exported successfully!', 'success');
    };

    // Import JSON
    document.getElementById('import-json-file-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const success = window.dataStore.importFromJson(event.target.result);
        if (success) {
          window.toast.show('Event database imported successfully!', 'success');
          populateEventDropdown();
          renderCurrentEvent();
          window.ModalManager.close('modal-export');
        } else {
          alert('Failed to parse valid event JSON backup.');
        }
      };
      reader.readAsText(file);
    });

    // Settings Modal
    document.getElementById('open-settings-modal-btn').onclick = () => {
      document.getElementById('gemini-api-key-input').value = window.aiEngine.getApiKey();
      window.ModalManager.open('modal-settings');
    };
    document.getElementById('save-settings-btn').onclick = () => {
      const key = document.getElementById('gemini-api-key-input').value;
      window.aiEngine.setApiKey(key);
      window.toast.show('AI settings updated!', 'success');
      window.ModalManager.close('modal-settings');
    };
    document.getElementById('reset-defaults-btn').onclick = () => {
      if (confirm('Are you sure you want to reset all events to factory defaults? Any custom events will be restored to initial showcase.')) {
        window.dataStore.resetToDefaults();
        populateEventDropdown();
        renderCurrentEvent();
        window.ModalManager.close('modal-settings');
        window.toast.show('Reset to defaults', 'info');
      }
    };
  }

  // Fire up
  init();
});
