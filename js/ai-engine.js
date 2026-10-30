/**
 * ai-engine.js
 * Generative AI Planning Engine for AuraEvent AI.
 * Supports direct Google Gemini API calls (if key provided) and
 * high-fidelity domain-expert heuristic reasoning simulation with streaming output.
 */

const GEMINI_STORAGE_KEY = 'aura_gemini_api_key';

class AIEngine {
  constructor() {
    this.apiKey = localStorage.getItem(GEMINI_STORAGE_KEY) || '';
    this.modelName = 'gemini-1.5-flash';
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    localStorage.setItem(GEMINI_STORAGE_KEY, this.apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  hasCustomKey() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  /**
   * Main conversational chat response with simulated thinking steps & streaming
   */
  async streamChatResponse(userPrompt, currentEvent, onChunk, onReasoning, onComplete) {
    // If user provided a real Gemini API key, call the Gemini REST API
    if (this.hasCustomKey()) {
      try {
        if (onReasoning) {
          onReasoning(`Synthesizing prompt context with Gemini 1.5 Flash for ${currentEvent.title}...`);
        }
        const text = await this.callGeminiAPI(userPrompt, currentEvent);
        // Stream text smoothly
        await this.simulateStream(text, onChunk);
        if (onComplete) onComplete({ text, actions: this.extractActions(text, currentEvent) });
        return;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to simulated intelligence engine:', err);
        if (onReasoning) {
          onReasoning('External API key error. Seamlessly switching to built-in event planning model...');
        }
      }
    }

    // High-fidelity domain simulation
    const reasoningSteps = [
      `Analyzing parameters for ${currentEvent.title} (${currentEvent.type}, ${currentEvent.guestCount} guests, budget: ${currentEvent.currency}${currentEvent.budgetTotal.toLocaleString()})...`,
      `Scanning vendor contracts, timeline dependencies, and ${currentEvent.vibe} aesthetics...`,
      `Formulating expert tactical recommendations and actionable items...`
    ];

    for (const step of reasoningSteps) {
      if (onReasoning) onReasoning(step);
      await new Promise(r => setTimeout(r, 450));
    }

    const response = this.generateSimulatedResponse(userPrompt, currentEvent);
    await this.simulateStream(response.text, onChunk);
    if (onComplete) onComplete(response);
  }

  async simulateStream(fullText, onChunk) {
    const words = fullText.split(' ');
    let buffer = '';
    for (let i = 0; i < words.length; i++) {
      buffer += (i === 0 ? '' : ' ') + words[i];
      if (onChunk) onChunk(buffer);
      // Small randomized delay to mimic natural LLM generation
      await new Promise(r => setTimeout(r, Math.min(30, Math.floor(Math.random() * 25) + 12)));
    }
  }

  /**
   * Generates intelligent, highly contextual event planning advice
   */
  generateSimulatedResponse(prompt, evt) {
    const lower = prompt.toLowerCase();
    const curr = evt.currency || '₹';

    // 1. Budget cutting / Optimization
    if (lower.includes('budget') || lower.includes('cut') || lower.includes('save') || lower.includes('cost')) {
      const suggestedSaving = Math.round(evt.budgetTotal * 0.12);
      return {
        text: `### 💡 AI Strategic Budget Optimization Plan for "${evt.title}"\n\n` +
          `Based on your total budget of **${curr}${evt.budgetTotal.toLocaleString('en-IN')}** and guest count of **${evt.guestCount}**, here is how to prudently free up **~${curr}${suggestedSaving.toLocaleString('en-IN')} (12–15%)** without dampening guest experience:\n\n` +
          `1. **Beverage & Bar Strategy:** Switch from a 5-hour full open liquor bar to a "Curated Wine, Craft Beer & Two Signature Cocktails" format. *Estimated Savings: ${curr}${Math.round(evt.budgetTotal * 0.05).toLocaleString('en-IN')}*.\n` +
          `2. **Florals Repurposing:** Have your coordinator transfer ceremony aisle arrangements & arches directly to frame the stage/sweetheart table during reception cocktail hour. *Estimated Savings: ${curr}${Math.round(evt.budgetTotal * 0.04).toLocaleString('en-IN')}*.\n` +
          `3. **Stationery & Signage Digital Shift:** Utilize digital RSVP tracking via QR codes on invitations rather than pre-stamped return envelopes, and replace paper dinner menus with two ornate acrylic menu easels per dining zone. *Estimated Savings: ${curr}25,000–35,000*.\n` +
          `4. **Smart Rental Scheduling:** Negotiate Monday return pickup rather than midnight same-day breakdown, which avoids vendor late-night premium overtime fees.\n\n` +
          `Would you like me to inject these budget adjustments into your active tracker?`,
        actions: [
          {
            type: 'add_expense',
            label: `Add "Bar Optimization Savings" (+${curr}${Math.round(evt.budgetTotal * 0.05).toLocaleString('en-IN')} buffer)`,
            data: { category: 'Food & Beverage', item: 'Optimized Bar Package Savings', allocated: -Math.round(evt.budgetTotal * 0.05), actual: 0, status: 'Estimated', notes: 'AI recommended 2-cocktail switch' }
          },
          {
            type: 'add_timeline',
            label: 'Add Timeline: Coordinate Floral Transfer Window',
            data: { phase: 'Run-of-Show', time: '04:45 PM', task: 'Strike ceremony arch florals and reset around sweetheart table', lead: 'Florist & Planner', category: 'Decor' }
          }
        ]
      };
    }

    // 2. Vendor questions & vetting
    if (lower.includes('vendor') || lower.includes('cater') || lower.includes('photograph') || lower.includes('dj') || lower.includes('contract') || lower.includes('question')) {
      return {
        text: `### 📋 Essential AI Vendor Vetting Guide\n\n` +
          `Before signing contracts or committing non-refundable deposits for **${evt.title}**, make sure you get written confirmation on these high-stakes points:\n\n` +
          `1. **Catering & Bar:**\n` +
          `   - *"Is gratuity, cake plating, and bar ice included in the service fee or billed separately?"*\n` +
          `   - *"How do you handle last-minute dietary allergies on the day-of?"*\n` +
          `2. **Photography / Media:**\n` +
          `   - *"What is your exact backup plan if lead shooter falls ill on event day?"*\n` +
          `   - *"What is the turnaround window for teaser photos (e.g. 48 hrs) and complete gallery?"*\n` +
          `3. **DJ & Entertainment:**\n` +
          `   - *"Do you have battery-powered wireless audio units for separate outdoor zones?"*\n` +
          `   - *"How do you read the room and transition between ambient dinner background and high-energy dance sets?"*\n` +
          `4. **Venue & Logistics:**\n` +
          `   - *"What is the hard decibel cutoff limit for music, and what are the strict breakdown hours?"*`,
        actions: [
          {
            type: 'add_vendor',
            label: 'Add "Audio/Visual Technician" to Vendor CRM',
            data: { category: 'AV & Sound', name: 'Pro AV Sound & Stage Solutions', quoted: 80000, final: 0, depositPaid: 0, status: 'Researching', notes: 'Check wireless microphones and backup power' }
          }
        ]
      };
    }

    // 3. Ideas, entertainment, themes, cocktails
    if (lower.includes('idea') || lower.includes('theme') || lower.includes('cocktail') || lower.includes('entertain') || lower.includes('game') || lower.includes('activity')) {
      return {
        text: `### ✨ Curated Personalized Concepts for "${evt.title}"\n\n` +
          `Tailored for **${evt.guestCount} guests** with a **${evt.vibe}** aesthetic:\n\n` +
          `1. **Interactive Signature Drink:** *"Golden Hour Glow"* — Blood orange reduction, botanical gin/seedlip, elderflower liqueur, topped with sparkling brut and a dehydrated citrus wheel dipped in edible gold dust.\n` +
          `2. **Live Immersive Keepsake:** Set up an **"Audio Guestbook Lounge"** with a vintage 1970s rotary phone and warm velvet armchairs where guests dial in their spontaneous stories, wishes, and jokes.\n` +
          `3. **Sensory Lighting Transition:** Program warm dimmable festoon lighting that shifts at sunset into amber uplights and candle-lit storm lanterns, creating an intimate, magical ambiance.\n` +
          `4. **Unexpected Late Night Surprise:** At 9:45 PM, have your catering team pass out fresh mini churros with dulce de leche dip or warm gourmet pretzel bites in bespoke branded bags.\n\n` +
          `Click below to instantly add these ideas into your Idea Studio!`,
        actions: [
          {
            type: 'add_idea',
            label: 'Add Idea: Golden Hour Glow Signature Drink',
            data: { category: 'Signature Bar', title: 'Golden Hour Glow Drink & Edible Gold Dust', description: 'Blood orange reduction, botanical gin, elderflower, topped with sparkling wine and edible gold rim.', tags: ['Cocktail', 'Luxury', 'Visual'], favorite: true }
          },
          {
            type: 'add_idea',
            label: 'Add Idea: Midnight Artisan Pretzel & Churro Cart',
            data: { category: 'Late Night Fuel', title: 'Midnight Artisan Pretzel & Churro Cart', description: 'Surprise sweet & savory late-night fuel passed directly on the dance floor.', tags: ['Food', 'Late Night', 'Crowd Pleaser'], favorite: true }
          }
        ]
      };
    }

    // 4. Timeline / Run of show / Schedule
    if (lower.includes('timeline') || lower.includes('schedule') || lower.includes('run of show') || lower.includes('hour') || lower.includes('time')) {
      return {
        text: `### ⏱️ Optimized Day-of "Run-of-Show" Blueprint\n\n` +
          `A smooth flow is all about buffer times so you never feel rushed:\n\n` +
          `• **T - 4 Hours:** Core vendor load-in begins (Catering staging, sound checks, floral arch construction).\n` +
          `• **T - 2 Hours:** Getting ready completion, detail photography (outfits, rings, stationery), and VIP arrival.\n` +
          `• **T - 45 Mins:** Ambient background music begins; doors open with welcome refreshments.\n` +
          `• **T - 0 (Kickoff):** Main ceremony / grand welcome program begins.\n` +
          `• **T + 1 Hour:** Transition to social hour, interactive food stations, and golden-hour group portraits.\n` +
          `• **T + 2.5 Hours:** Plated meal / buffet dinner service followed by heartfelt speeches (limit to 3-4 mins each!).\n` +
          `• **T + 3.5 Hours:** Cake cutting, ceremonial dances / celebratory toast, dance floor opening.\n` +
          `• **T + 5 Hours:** Grand finale send-off & guest farewells.`,
        actions: [
          {
            type: 'add_timeline',
            label: 'Add Timeline: Vendor Load-in & Tech Soundcheck',
            data: { phase: 'Run-of-Show', time: '11:00 AM', task: 'Core vendor load-in, generator check & microphone test', lead: 'Production Lead', category: 'Logistics' }
          },
          {
            type: 'add_timeline',
            label: 'Add Timeline: Timed Welcome Speech & Toasts',
            data: { phase: 'Run-of-Show', time: '07:30 PM', task: 'Welcome toasts by hosts (max 4 mins each)', lead: 'MC / Host', category: 'Speeches' }
          }
        ]
      };
    }

    // 5. Speech or Toast Outline
    if (lower.includes('speech') || lower.includes('toast') || lower.includes('vow')) {
      return {
        text: `### 🎤 Heartfelt & Engaging Speech Blueprint (3–4 Minutes)\n\n` +
          `1. **The Hook (30 secs):** A warm opening that welcomes everyone and breaks the ice with genuine gratitude.\n` +
          `2. **The Specific Story (90 secs):** Share one vivid, endearing story that captures the essence of the person or celebration (avoid generic clichés).\n` +
          `3. **The Transformation / Reflection (45 secs):** Highlight why this milestone or union is so meaningful to all present.\n` +
          `4. **The Toast (30 secs):** Ask all guests to raise their glasses high, speak a memorable blessing or wish, and end on a resonant positive note!`,
        actions: [
          {
            type: 'add_timeline',
            label: 'Schedule Speeches in Run-of-Show',
            data: { phase: 'Run-of-Show', time: '07:45 PM', task: 'Speeches & Tributes (3 speakers max, 4 mins each)', lead: 'Host / MC', category: 'Reception' }
          }
        ]
      };
    }

    // 6. Rain or Weather Contingency
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('outdoor') || lower.includes('wind') || lower.includes('tent')) {
      return {
        text: `### 🌧️ Weather Contingency & Climate Protection Protocol\n\n` +
          `For an event with **${evt.guestCount} guests** in **${evt.location}**:\n\n` +
          `1. **The 72-Hour Weather Decision Trigger:** Lock in a clear decision deadline with your tent rental and venue team at 72 hours before event start.\n` +
          `2. **Clear Top Marquee / Tent Reserve:** Clear tents protect against rain while preserving starry views and botanical surroundings.\n` +
          `3. **Guest Comfort Station:** Have 40 transparent umbrellas in wicker baskets at the entrance, along with warm fleece throws in rustic wooden crates.\n` +
          `4. **Flooring & Walkway Matting:** Prevent heel sinking or damp paths with coir matting or interlocking wood parquet runners.`,
        actions: [
          {
            type: 'add_expense',
            label: 'Add Expense: Weather Contingency Tent Deposit',
            data: { category: 'Venue & Rentals', item: 'Weather Backup Tent Reservation Deposit', allocated: 80000, actual: 40000, status: 'Estimated', notes: 'Refundable if weather forecast is clear at 72h window' }
          }
        ]
      };
    }

    // Default friendly assistant response
    return {
      text: `### 🌟 Planning Insights for "${evt.title}"\n\n` +
        `I am actively analyzing your plan for **${evt.guestCount} guests** with a budget of **${curr}${evt.budgetTotal.toLocaleString('en-IN')}**.\n\n` +
        `Current Status:\n` +
        `• **Budget Allocation:** ${evt.budget ? evt.budget.length : 0} items tracked.\n` +
        `• **Timeline Milestones:** ${evt.timeline ? evt.timeline.filter(t => t.completed).length : 0} of ${evt.timeline ? evt.timeline.length : 0} completed.\n` +
        `• **Vendors:** ${evt.vendors ? evt.vendors.filter(v => v.status === 'Booked' || v.status === 'Completed').length : 0} confirmed.\n\n` +
        `**How would you like to level up this plan?**\n` +
        `• Ask me to generate a complete minute-by-minute day-of schedule.\n` +
        `• Ask for 5 unique creative ideas to wow your guests.\n` +
        `• Request vendor vetting questions to avoid costly mistakes.\n` +
        `• Ask how to optimize your budget by 10–15% without sacrificing style.`,
      actions: [
        {
          type: 'add_idea',
          label: 'Add Idea: Signature Welcome Refreshment Station',
          data: { category: 'Guest Welcome', title: 'Infused Sparkling Herbal Welcome Bar', description: 'Chilled sparkling water infused with fresh cucumber, mint, berries, and elderflower syrup for guest arrivals.', tags: ['Welcome', 'Refreshment', 'Guest Care'], favorite: true }
        }
      ]
    };
  }

  /**
   * AI Event Plan Generator: Generates a complete comprehensive plan for a new event
   */
  async generateFullEventPlan(eventDetails, onStep) {
    if (onStep) onStep('Synthesizing event archetype & vision aesthetics...');
    await new Promise(r => setTimeout(r, 400));

    if (onStep) onStep('Computing category-by-category budget allocations...');
    await new Promise(r => setTimeout(r, 450));

    if (onStep) onStep('Constructing master countdown & day-of run-of-show schedule...');
    await new Promise(r => setTimeout(r, 400));

    if (onStep) onStep('Curating specialized vendor checklist with vetting questions...');
    await new Promise(r => setTimeout(r, 350));

    const total = Number(eventDetails.budgetTotal) || 1500000;
    const type = eventDetails.type || 'wedding';
    const guestCount = Number(eventDetails.guestCount) || 80;

    let budget = [];
    let timeline = [];
    let vendors = [];
    let ideas = [];
    let palette = [];

    if (type === 'wedding') {
      palette = [
        { name: 'Champagne Gold', hex: '#d4af37' },
        { name: 'Dusty Rose', hex: '#dcae96' },
        { name: 'Ivory Crème', hex: '#fdfbf7' },
        { name: 'Olive Green', hex: '#5b6e4e' },
        { name: 'Slate Onyx', hex: '#1e293b' }
      ];

      budget = [
        { id: 'b-' + Date.now() + '-1', category: 'Venue & Rentals', item: 'Reception & Ceremony Venue Rental', allocated: Math.round(total * 0.35), actual: 0, status: 'Estimated', notes: 'Includes tables and chairs' },
        { id: 'b-' + Date.now() + '-2', category: 'Food & Beverage', item: 'Plated Dinner & Cocktail Service', allocated: Math.round(total * 0.30), actual: 0, status: 'Estimated', notes: `Estimated for ${guestCount} guests` },
        { id: 'b-' + Date.now() + '-3', category: 'Photo & Video', item: 'Full-day Photography & Cinematic Film', allocated: Math.round(total * 0.12), actual: 0, status: 'Estimated', notes: 'Includes highlight reel' },
        { id: 'b-' + Date.now() + '-4', category: 'Florals & Decor', item: 'Ceremony Arch, Centerpieces & Candlelight', allocated: Math.round(total * 0.08), actual: 0, status: 'Estimated', notes: 'Repurposed for reception' },
        { id: 'b-' + Date.now() + '-5', category: 'Music & DJ', item: 'Ceremony Audio & Evening Reception DJ', allocated: Math.round(total * 0.06), actual: 0, status: 'Estimated', notes: 'Wireless mics and lighting' },
        { id: 'b-' + Date.now() + '-6', category: 'Attire & Beauty', item: 'Bridal Beauty & Attire Alterations', allocated: Math.round(total * 0.04), actual: 0, status: 'Estimated', notes: 'Hair and makeup' },
        { id: 'b-' + Date.now() + '-7', category: 'Contingency Fund', item: 'Emergency Buffer & Gratuities', allocated: Math.round(total * 0.05), actual: 0, status: 'Estimated', notes: 'Day-of cushion' }
      ];

      timeline = [
        { id: 't-1', phase: 'Milestones', time: '9 Months Out', task: 'Lock in primary venue and date reservation', completed: true, lead: 'Couple', category: 'Venue' },
        { id: 't-2', phase: 'Milestones', time: '6 Months Out', task: 'Book photographer, videographer, and caterer', completed: true, lead: 'Couple', category: 'Vendors' },
        { id: 't-3', phase: 'Milestones', time: '3 Months Out', task: 'Mail invitations and order wedding bands', completed: false, lead: 'Couple', category: 'Stationery' },
        { id: 't-4', phase: 'Milestones', time: '1 Month Out', task: 'Finalize seating chart and confirm final guest count', completed: false, lead: 'Planner', category: 'Guest Care' },
        { id: 't-5', phase: 'Run-of-Show', time: '09:00 AM', task: 'Hair & makeup prep in bridal suite', completed: false, lead: 'Bridal Party', category: 'Beauty' },
        { id: 't-6', phase: 'Run-of-Show', time: '01:00 PM', task: 'First look portraits and family photos', completed: false, lead: 'Photographer', category: 'Media' },
        { id: 't-7', phase: 'Run-of-Show', time: '04:00 PM', task: 'Ceremony begins with musical processional', completed: false, lead: 'Officiant', category: 'Ceremony' },
        { id: 't-8', phase: 'Run-of-Show', time: '05:00 PM', task: 'Cocktail hour with passed hors d’oeuvres', completed: false, lead: 'Catering Lead', category: 'Reception' },
        { id: 't-9', phase: 'Run-of-Show', time: '06:30 PM', task: 'Grand entrance, dinner service, and toasts', completed: false, lead: 'DJ / MC', category: 'Dinner' },
        { id: 't-10', phase: 'Run-of-Show', time: '08:30 PM', task: 'First dance and open party floor', completed: false, lead: 'DJ', category: 'Party' }
      ];

      vendors = [
        { id: 'v-1', category: 'Venue', name: 'Grand Estate & Gardens', quoted: Math.round(total * 0.35), final: 0, depositPaid: 0, status: 'In Talks', vettingQuestions: ['What are the noise curfew regulations?', 'Can outside caterers be brought in without fee?'] },
        { id: 'v-2', category: 'Catering', name: 'Artisan Culinary Group', quoted: Math.round(total * 0.30), final: 0, depositPaid: 0, status: 'In Talks', vettingQuestions: ['Is tasting session complimentary before booking?', 'What is the server-to-guest ratio?'] },
        { id: 'v-3', category: 'Photography', name: 'Moments & Light Studios', quoted: Math.round(total * 0.12), final: 0, depositPaid: 0, status: 'Researching', vettingQuestions: ['Do you shoot digital, 35mm film, or both?', 'Is an assistant photographer included?'] },
        { id: 'v-4', category: 'Florals', name: 'Botanical Couture', quoted: Math.round(total * 0.08), final: 0, depositPaid: 0, status: 'Researching', vettingQuestions: ['How can ceremony arrangements be repurposed for dinner?'] }
      ];

      ideas = [
        { id: 'i-1', category: 'Guest Experience', title: 'The Vintage Vinyl Listening Lounge', description: 'A cozy corner with record crates where guests can pick vintage 45 RPM records to play between sets.', tags: ['Interactive', 'Music', 'Retro'], favorite: true },
        { id: 'i-2', category: 'Signature Bar', title: 'His, Hers & Our Pup Signature Cocktails', description: 'Three customized specialty drinks named after the couple and their beloved pet, with custom illustrated bar signage.', tags: ['Cocktails', 'Personalized', 'Fun'], favorite: true },
        { id: 'i-3', category: 'Ceremony Highlight', title: 'Ring Warming Blessing Tradition', description: 'Wedding rings are passed gently among guests in a small velvet pouch for silent blessings before the vows.', tags: ['Sentimental', 'Tradition', 'Intimate'], favorite: false }
      ];

    } else if (type === 'birthday') {
      palette = [
        { name: 'Neon Amber', hex: '#f59e0b' },
        { name: 'Electric Violet', hex: '#8b5cf6' },
        { name: 'Midnight Jet', hex: '#090d16' },
        { name: 'Champagne Fizz', hex: '#fef08a' }
      ];

      budget = [
        { id: 'b-1', category: 'Venue & Space', item: 'Lounge / Rooftop Space Rental', allocated: Math.round(total * 0.40), actual: 0, status: 'Estimated', notes: 'Private area with sound setup' },
        { id: 'b-2', category: 'Food & Tapas', item: 'Artisan Grazing Table & Passed Bites', allocated: Math.round(total * 0.30), actual: 0, status: 'Estimated', notes: 'Small plates and sliders' },
        { id: 'b-3', category: 'Bar & Drinks', item: 'Signature Cocktail Package & Champagne', allocated: Math.round(total * 0.15), actual: 0, status: 'Estimated', notes: 'Bartender service' },
        { id: 'b-4', category: 'Music & DJ', item: 'Live DJ and Ambient Lighting', allocated: Math.round(total * 0.10), actual: 0, status: 'Estimated', notes: '3-hour set' },
        { id: 'b-5', category: 'Cake & Decor', item: 'Custom Tiered Cake & Neon Signage', allocated: Math.round(total * 0.05), actual: 0, status: 'Estimated', notes: 'Photo wall backdrop' }
      ];

      timeline = [
        { id: 't-1', phase: 'Milestones', time: '4 Weeks Out', task: 'Confirm venue contract and send digital invitations', completed: true, lead: 'Host', category: 'Venue' },
        { id: 't-2', phase: 'Milestones', time: '2 Weeks Out', task: 'Finalize DJ playlist preferences and specialty cocktail menu', completed: false, lead: 'Host', category: 'Music' },
        { id: 't-3', phase: 'Run-of-Show', time: '06:00 PM', task: 'Venue setup, balloon arch and lighting test', completed: false, lead: 'Host', category: 'Setup' },
        { id: 't-4', phase: 'Run-of-Show', time: '07:00 PM', task: 'Guests arrive, signature cocktail toast and ambient lounge beats', completed: false, lead: 'Bartender', category: 'Party' },
        { id: 't-5', phase: 'Run-of-Show', time: '09:00 PM', task: 'Birthday cake presentation with sparklers & tribute toast', completed: false, lead: 'Host & DJ', category: 'Highlight' }
      ];

      vendors = [
        { id: 'v-1', category: 'Venue', name: 'The Skyline Loft', quoted: Math.round(total * 0.40), final: 0, depositPaid: 0, status: 'In Talks', vettingQuestions: ['What is the sound curfew?'] },
        { id: 'v-2', category: 'Catering', name: 'Urban Bite Tapas', quoted: Math.round(total * 0.30), final: 0, depositPaid: 0, status: 'In Talks', vettingQuestions: ['Do you accommodate vegan / GF attendees?'] }
      ];

      ideas = [
        { id: 'i-1', category: 'Photo Op', title: 'Backlit Neon Typography Wall', description: 'Custom neon quote matching the milestone birthday with greenery and disco balls.', tags: ['Photo', 'Neon', 'Aesthetic'], favorite: true },
        { id: 'i-2', category: 'Entertainment', title: '60-Second Roast & Toast Mic Pass', description: 'Fast, hilarious speed-tributes from close friends with celebratory sound bites from DJ.', tags: ['Fun', 'Speeches'], favorite: true }
      ];

    } else {
      // Community Event
      palette = [
        { name: 'Civic Blue', hex: '#2563eb' },
        { name: 'Warm Amber', hex: '#d97706' },
        { name: 'Eco Emerald', hex: '#059669' },
        { name: 'Clean White', hex: '#f8fafc' }
      ];

      budget = [
        { id: 'b-1', category: 'Permits & Municipal', item: 'City Park Permit, Police & Safety Detail', allocated: Math.round(total * 0.18), actual: 0, status: 'Estimated', notes: 'City clearance' },
        { id: 'b-2', category: 'Stage & Sound', item: 'Sound Engineering, Stage & Generators', allocated: Math.round(total * 0.28), actual: 0, status: 'Estimated', notes: 'AV for bands and announcements' },
        { id: 'b-3', category: 'Activities & Materials', item: 'Eco Lanterns / Craft Kits / Materials', allocated: Math.round(total * 0.22), actual: 0, status: 'Estimated', notes: `For ${guestCount} attendees` },
        { id: 'b-4', category: 'Sanitation & Waste', item: 'Portable Restrooms & Recycling Stations', allocated: Math.round(total * 0.14), actual: 0, status: 'Estimated', notes: 'Eco-cleanup sweep' },
        { id: 'b-5', category: 'Marketing & Signage', item: 'Directional Banners & Public Notices', allocated: Math.round(total * 0.08), actual: 0, status: 'Estimated', notes: 'Bilingual materials' },
        { id: 'b-6', category: 'Contingency & Medical', item: 'First Aid Kit & Emergency Buffer', allocated: Math.round(total * 0.10), actual: 0, status: 'Estimated', notes: 'Safety compliance' }
      ];

      timeline = [
        { id: 't-1', phase: 'Milestones', time: '2 Months Out', task: 'Submit municipal permit applications and insurance certificate', completed: true, lead: 'Committee', category: 'Permits' },
        { id: 't-2', phase: 'Milestones', time: '1 Month Out', task: 'Recruit community volunteers and confirm artisan vendor booths', completed: false, lead: 'Volunteer Lead', category: 'Staff' },
        { id: 't-3', phase: 'Run-of-Show', time: '01:00 PM', task: 'Site setup, tent assembly and soundcheck', completed: false, lead: 'Ops Lead', category: 'Logistics' },
        { id: 't-4', phase: 'Run-of-Show', time: '03:00 PM', task: 'Gates open; community booths and live acoustic music', completed: false, lead: 'MC', category: 'Festival' },
        { id: 't-5', phase: 'Run-of-Show', time: '06:30 PM', task: 'Keynote community ceremony & grand evening release', completed: false, lead: 'Committee Chair', category: 'Highlight' }
      ];

      vendors = [
        { id: 'v-1', category: 'Production', name: 'Community Sound & Stage Co.', quoted: Math.round(total * 0.28), final: 0, depositPaid: 0, status: 'In Talks', vettingQuestions: ['Is generator fuel included?'] }
      ];

      ideas = [
        { id: 'i-1', category: 'Engagement', title: 'The Community Hope & Memory Mural', description: 'A 20-foot collaborative canvas where neighbors paint their community hopes and wishes.', tags: ['Art', 'Community', 'Inclusive'], favorite: true },
        { id: 'i-2', category: 'Gamification', title: 'Local Artisan Passport Challenge', description: 'Collect stamps from 4 different community booths to win a local business gift basket.', tags: ['Local', 'Interactive'], favorite: true }
      ];
    }

    return {
      type,
      title: eventDetails.title || `Bespoke ${type.toUpperCase()} Celebration`,
      date: eventDetails.date || '2026-11-20',
      location: eventDetails.location || 'Selected Venue',
      budgetTotal: total,
      currency: eventDetails.currency || '$',
      guestCount,
      vibe: eventDetails.vibe || 'Exquisite, Joyful & Flawless',
      palette,
      budget,
      timeline,
      vendors,
      ideas,
      guests: [
        { id: 'g-1', name: 'VIP Guest / Host', rsvp: 'Attending', count: 2, meal: 'Standard', table: 'Table 1', diet: 'None' }
      ]
    };
  }

  /**
   * Real Google Gemini API caller (REST)
   */
  async callGeminiAPI(prompt, currentEvent) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    const systemPrompt = `You are an elite, world-class event planner and GenAI architectural assistant named Celebrāte AI.
Current Event Context:
- Event: "${currentEvent.title}"
- Type: ${currentEvent.type}
- Guest Count: ${currentEvent.guestCount}
- Budget: ${currentEvent.currency}${currentEvent.budgetTotal}
- Vibe: ${currentEvent.vibe}
- Location: ${currentEvent.location}

Provide high-value, structured, and actionable advice. Use markdown with clear headings, bold text, and bullet points. Include realistic pricing and buffer considerations.`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nUser Question:\n${prompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated from Gemini API.';
  }

  extractActions(text, currentEvent) {
    // Basic automatic action extraction from Gemini response if applicable
    const actions = [];
    if (text.toLowerCase().includes('cocktail') || text.toLowerCase().includes('drink')) {
      actions.push({
        type: 'add_idea',
        label: 'Add Mentioned Signature Drink to Ideas',
        data: { category: 'Signature Bar', title: 'Gemini Suggested Cocktail', description: 'Curated drink recommendation from AI Co-pilot.', tags: ['AI Curated', 'Bar'], favorite: true }
      });
    }
    return actions;
  }
}

// Global singleton instance
window.aiEngine = new AIEngine();
