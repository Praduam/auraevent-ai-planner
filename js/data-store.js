/**
 * data-store.js
 * State management and pre-configured realistic event plans
 * for Weddings, Birthdays, and Community Events with LocalStorage persistence.
 * All prices and budgets formatted in Indian Rupees (₹).
 */

const STORAGE_KEY = 'aura_celebrate_ai_events_v2';
const CURRENT_EVENT_KEY = 'aura_celebrate_current_event_id_v2';

const INITIAL_EVENTS = [
  {
    id: 'evt-wedding-01',
    type: 'wedding',
    title: 'Elena & Marcus • Enchanted Conservatory Romance',
    date: '2026-11-14',
    location: 'The Glasshouse Pavilion & Botanical Gardens, Portland',
    budgetTotal: 2500000,
    currency: '₹',
    guestCount: 140,
    vibe: 'Romantic Botanical, Champagne Gold, Sage Green & Candlelight',
    heroImage: 'assets/images/wedding-hero.jpg',
    healthScore: 92,
    notes: 'Ceremony in botanical terrace at 4:00 PM, cocktail hour at 5:00 PM, four-course dinner in the glasshouse at 6:30 PM.',
    palette: [
      { name: 'Sage Green', hex: '#60725c' },
      { name: 'Champagne Gold', hex: '#e3b341' },
      { name: 'Blush Rose', hex: '#d99b9b' },
      { name: 'Ivory Silk', hex: '#f9f6f0' },
      { name: 'Midnight Emerald', hex: '#1c3427' }
    ],
    budget: [
      { id: 'b-1', category: 'Venue & Rentals', item: 'Glasshouse Pavilion & Conservatory Rental (Full Day)', allocated: 650000, actual: 650000, status: 'Paid', dueDate: '2026-09-01', notes: 'Includes tables, Chiavari chairs, bridal suite and cleanup' },
      { id: 'b-2', category: 'Food & Beverage', item: 'Four-Course Plated Dinner & Canapés (140 Guests)', allocated: 750000, actual: 780000, status: 'Invoiced', dueDate: '2026-10-31', notes: '₹5,500/plate; includes gourmet buffet, live counters, vegan & Jain options' },
      { id: 'b-3', category: 'Food & Beverage', item: 'Open Craft Cocktail Bar & Champagne Toast', allocated: 250000, actual: 240000, status: 'Invoiced', dueDate: '2026-11-05', notes: '4 signature drinks + curated wine selection' },
      { id: 'b-4', category: 'Photo & Video', item: 'Lumina Wedding Photography (10 hrs + Drone)', allocated: 280000, actual: 280000, status: 'Paid', dueDate: '2026-10-15', notes: '2 candid photographers, drone cinematic film & teaser reel in 48h' },
      { id: 'b-5', category: 'Florals & Decor', item: 'Ceremony Arch, Centerpieces & Suspended Greenery', allocated: 240000, actual: 230000, status: 'Invoiced', dueDate: '2026-11-01', notes: 'Garden roses, eucalyptus, olive branch runners & pillar candles' },
      { id: 'b-6', category: 'Music & Entertainment', item: 'String Quartet for Ceremony & Live Sax + DJ for Reception', allocated: 160000, actual: 160000, status: 'Estimated', dueDate: '2026-11-07', notes: 'Quartet for 2 hrs, DJ with sound & lighting package for 5 hrs' },
      { id: 'b-7', category: 'Attire & Beauty', item: 'Bridal Couture Styling & Groom Tuxedo/Sherwani', allocated: 100000, actual: 95000, status: 'Paid', dueDate: '2026-10-20', notes: 'Fittings scheduled for final week' },
      { id: 'b-8', category: 'Cake & Desserts', item: '3-Tier Berry Mascarpone Cake + Artisan Favors', allocated: 50000, actual: 48000, status: 'Paid', dueDate: '2026-10-25', notes: 'Tasting approved, gluten-free top tier' },
      { id: 'b-9', category: 'Stationery & Signage', item: 'Calligraphy Place Cards & Acrylic Welcome Mirror', allocated: 40000, actual: 36000, status: 'Paid', dueDate: '2026-10-10', notes: 'Printed on handmade deckled-edge paper with gold seals' },
      { id: 'b-10', category: 'Contingency Fund', item: 'Emergency Buffer & Vendor Gratuities', allocated: 40000, actual: 0, status: 'Estimated', dueDate: '2026-11-14', notes: 'Cash envelopes prepared for day-of distribution' }
    ],
    timeline: [
      { id: 't-1', phase: 'Milestones', time: '12 Months Out', task: 'Book dream venue & secure primary date', completed: true, lead: 'Couple', category: 'Venue' },
      { id: 't-2', phase: 'Milestones', time: '9 Months Out', task: 'Select & book Photographer + Videographer team', completed: true, lead: 'Elena', category: 'Media' },
      { id: 't-3', phase: 'Milestones', time: '6 Months Out', task: 'Menu tasting & finalize bar package with caterer', completed: true, lead: 'Marcus', category: 'Catering' },
      { id: 't-4', phase: 'Milestones', time: '3 Months Out', task: 'Mail out formal invitations with RSVP deadline', completed: true, lead: 'Elena', category: 'Stationery' },
      { id: 't-5', phase: 'Milestones', time: '1 Month Out', task: 'Finalize seating chart & send dietary counts to caterer', completed: false, lead: 'Planner', category: 'Coordination' },
      { id: 't-6', phase: 'Milestones', time: '1 Week Out', task: 'Confirm arrival windows with all 8 vendors & pack emergency kit', completed: false, lead: 'Planner', category: 'Coordination' },
      { id: 't-7', phase: 'Run-of-Show', time: '09:00 AM', task: 'Bridal Suite hair & makeup team arrives with refreshments', completed: false, lead: 'Elena & MOH', category: 'Beauty' },
      { id: 't-8', phase: 'Run-of-Show', time: '11:30 AM', task: 'Photographer arrives for flat lays, gown, ring & getting-ready shots', completed: false, lead: 'Lumina Photo', category: 'Media' },
      { id: 't-9', phase: 'Run-of-Show', time: '01:30 PM', task: 'First Look in Secret Rose Garden followed by Couple Portraits', completed: false, lead: 'Planner & Photo', category: 'Ceremony' },
      { id: 't-10', phase: 'Run-of-Show', time: '03:30 PM', task: 'Guest arrival & welcome sparkling elderflower spritz; String Quartet prelude', completed: false, lead: 'Venue Lead', category: 'Guest Care' },
      { id: 't-11', phase: 'Run-of-Show', time: '04:00 PM', task: 'Ceremony begins, processional, exchange of personal vows & ring blessing', completed: false, lead: 'Officiant Julian', category: 'Ceremony' },
      { id: 't-12', phase: 'Run-of-Show', time: '05:00 PM', task: 'Sunset Cocktail Hour with passed hors d’oeuvres and acoustic jazz', completed: false, lead: 'Catering Team', category: 'Catering' },
      { id: 't-13', phase: 'Run-of-Show', time: '06:30 PM', task: 'Grand Entrance into Glasshouse Pavilion, Welcome Toast & Dinner service', completed: false, lead: 'DJ / MC', category: 'Reception' },
      { id: 't-14', phase: 'Run-of-Show', time: '08:15 PM', task: 'First Dance ("Beyond" by Leon Bridges), Parent dances & Cake cutting', completed: false, lead: 'DJ & Photo', category: 'Reception' },
      { id: 't-15', phase: 'Run-of-Show', time: '10:45 PM', task: 'Grand sparkler send-off path on garden walkway & vintage getaway car', completed: false, lead: 'Coordinator', category: 'Finale' }
    ],
    vendors: [
      { id: 'v-1', category: 'Venue', name: 'The Glasshouse Pavilion', contactName: 'Sarah Jenkins', phone: '(503) 555-0192', email: 'events@glasshousepdx.com', quoted: 650000, final: 650000, depositPaid: 650000, status: 'Booked', vettingQuestions: ['Confirm load-in time begins at 8:00 AM sharp', 'Verify candle flame permit specifications (must be enclosed in hurricanes)'], notes: 'Key contact Sarah Jenkins. Sound curfew 11:30 PM.' },
      { id: 'v-2', category: 'Catering', name: 'Heirloom Botanical Kitchen', contactName: 'Chef Antoine', phone: '(503) 555-0842', email: 'catering@heirloomkitchen.com', quoted: 1000000, final: 1020000, depositPaid: 500000, status: 'Booked', vettingQuestions: ['Do you provide cake cutting and plating without extra service fee?', 'How are dietary restrictions labeled for table service?'], notes: 'Passed appetizers: Truffle arancini, smoked salmon blinis, figs with goat cheese.' },
      { id: 'v-3', category: 'Photo & Video', name: 'Lumina Cinematic Media', contactName: 'David & Rachel Vance', phone: '(503) 555-0211', email: 'hello@luminaweddings.com', quoted: 280000, final: 280000, depositPaid: 140000, status: 'Booked', vettingQuestions: ['Are RAW footage and high-res print rights included?', 'What is your backup equipment protocol if a camera body fails?'], notes: 'Package includes drone flyover, 40-page linen album, 8-minute highlight film.' },
      { id: 'v-4', category: 'Florals & Decor', name: 'Petal & Bloom Architectural Botanicals', contactName: 'Chloe Bennett', phone: '(503) 555-0374', email: 'chloe@petalandbloom.com', quoted: 240000, final: 230000, depositPaid: 100000, status: 'Booked', vettingQuestions: ['Will florals be repurposed from ceremony arch to head table?', 'What time does floral strike begin post-reception?'], notes: 'Arch will be moved behind sweetheart table during cocktail hour.' },
      { id: 'v-5', category: 'Music & DJ', name: 'Soundwave Collective & Live Sax', contactName: 'DJ Marcus Lee', phone: '(503) 555-0789', email: 'bookings@soundwavecollective.com', quoted: 160000, final: 160000, depositPaid: 70000, status: 'Booked', vettingQuestions: ['Can wireless lapel mics be provided for the officiant and groom?', 'Do you have a dedicated audio feed for the videographer?'], notes: 'Live saxophonist joins DJ during peak dance hour (9:30 - 10:30 PM).' },
      { id: 'v-6', category: 'Bakery', name: 'Sweet Velvet Artisan Cakes', contactName: 'Mia Thorne', phone: '(503) 555-0955', email: 'mia@sweetvelvetcakes.com', quoted: 50000, final: 48000, depositPaid: 48000, status: 'Booked', vettingQuestions: ['Does the bakery supply a cake stand and antique knife?', 'What temperature must the display area be maintained at?'], notes: 'Flavors: Lemon blackberry with elderflower buttercream.' },
      { id: 'v-7', category: 'Stationery', name: 'Letter & Quill Calligraphy', contactName: 'Sora Chen', phone: '(503) 555-0441', email: 'sora@letterandquill.com', quoted: 40000, final: 36000, depositPaid: 36000, status: 'Completed', vettingQuestions: ['Turnaround time for last-minute guest name swaps?'], notes: 'Printed on cotton rag paper with gold wax seals.' }
    ],
    ideas: [
      { id: 'i-1', category: 'Interactive Guest Care', title: 'Vintage Audio Guestbook Telephone', description: 'Place a restored 1960s rotary phone on a bistro table with a velvet sign: "Leave a voicemail for Elena & Marcus after the tone." Guests leave hilarious and heartfelt voice messages that get mastered into an audio vinyl.', tags: ['Audio', 'Sentimental', 'Interactive'], favorite: true },
      { id: 'i-2', category: 'Signature Bar', title: 'The Botanical Gin & Elderflower Spritz', description: 'Empress 1908 indigo gin that shifts from royal blue to blush lavender as artisanal elderflower tonic is poured over rosemary sprigs and edible viola flowers.', tags: ['Cocktails', 'Aesthetic', 'Botanical'], favorite: true },
      { id: 'i-3', category: 'Decor & Ambience', title: 'Suspended Fairy Light & Ivy Canopy', description: 'Transform the glasshouse ceiling into a starry twilight sky with 1,200 warm micro-fairy lights interwoven with trailing English ivy and Italian ruscus.', tags: ['Lighting', 'Glasshouse', 'Fairytale'], favorite: true },
      { id: 'i-4', category: 'Ceremony Highlight', title: 'Live Watercolor Guest Portraiture', description: 'Hire a live watercolor artist who sketches 5-minute whimsical mini-portraits of guests during cocktail hour as their take-home keepsake gift.', tags: ['Keepsake', 'Artisan', 'Luxury'], favorite: false },
      { id: 'i-5', category: 'Late Night Fuel', title: 'Midnight Truffle Fries & Gourmet Slider Station', description: 'Surprise guests at 10:00 PM on the dance floor with silver trays of parmesan truffle fries in custom wax paper cones and mini wagyu brioche sliders.', tags: ['Food', 'Late Night', 'Crowd Pleaser'], favorite: true }
    ],
    guests: [
      { id: 'g-1', name: 'Julian & Sophia Rossi', rsvp: 'Attending', count: 2, meal: 'Halibut / Ribeye', table: 'Table 1 (Family)', diet: 'None' },
      { id: 'g-2', name: 'Dr. Aris Thorne', rsvp: 'Attending', count: 1, meal: 'Vegan Wild Mushroom Risotto', table: 'Table 2', diet: 'Vegan / Nut Allergy' },
      { id: 'g-3', name: 'Clara & Liam O’Connor', rsvp: 'Attending', count: 2, meal: 'Ribeye Steak', table: 'Table 3', diet: 'Gluten-Free' },
      { id: 'g-4', name: 'Hiroshi Tanaka', rsvp: 'Attending', count: 1, meal: 'Halibut', table: 'Table 2', diet: 'None' },
      { id: 'g-5', name: 'Samantha Vance & Guest', rsvp: 'Pending', count: 2, meal: 'Undecided', table: 'Table 4', diet: 'Pending' },
      { id: 'g-6', name: 'Uncle Donald & Aunt Marie', rsvp: 'Declined', count: 2, meal: 'N/A', table: 'N/A', diet: 'Sending gift' }
    ]
  },

  {
    id: 'evt-birthday-02',
    type: 'birthday',
    title: 'Leo’s 30th • Electric Horizon Rooftop Soirée',
    date: '2026-12-05',
    location: 'Skyline Penthouse & Horizon Terrace, Downtown',
    budgetTotal: 550000,
    currency: '₹',
    guestCount: 65,
    vibe: 'Modern Cyber-Chic, Amber Glow, Neon Accents & Deep Slate',
    heroImage: 'assets/images/birthday-hero.jpg',
    healthScore: 88,
    notes: 'Sunset start at 6:30 PM. Live house/chill-lounge DJ, bespoke cocktail bar, customized geometric cake, and skyline city views.',
    palette: [
      { name: 'Neon Amber', hex: '#f59e0b' },
      { name: 'Midnight Charcoal', hex: '#111827' },
      { name: 'Electric Violet', hex: '#8b5cf6' },
      { name: 'Champagne Glow', hex: '#fde68a' },
      { name: 'Slate Gray', hex: '#475569' }
    ],
    budget: [
      { id: 'b-201', category: 'Venue & Space', item: 'Skyline Terrace Private Lounge (6 hrs)', allocated: 180000, actual: 180000, status: 'Paid', dueDate: '2026-11-01', notes: 'Includes heated outdoor pergolas and AV sound system' },
      { id: 'b-202', category: 'Food & Tapas', item: 'Bespoke Tapas Grazing Table & Gourmet Flatbreads', allocated: 150000, actual: 155000, status: 'Invoiced', dueDate: '2026-11-25', notes: 'Charcuterie, sliders, truffle croquettes, bao buns' },
      { id: 'b-203', category: 'Bar & Mixology', item: 'Craft Bartender & 3 Custom Signature Cocktails', allocated: 90000, actual: 85000, status: 'Invoiced', dueDate: '2026-12-01', notes: 'Includes premium cocktails & zero-proof mocktails' },
      { id: 'b-204', category: 'DJ & Sound', item: 'Deep House / R&B Resident DJ + Uplighting', allocated: 60000, actual: 60000, status: 'Paid', dueDate: '2026-11-15', notes: '4 hour set with wireless mic for toasts' },
      { id: 'b-205', category: 'Cake & Treats', item: 'Geometric Black Marble & Gold Tiered Birthday Cake', allocated: 30000, actual: 28000, status: 'Paid', dueDate: '2026-11-20', notes: 'Dark chocolate espresso with hazelnut praline' },
      { id: 'b-206', category: 'Decor & Signage', item: 'Custom "Cheers to 30" Neon Sign & Photo Backdrop', allocated: 30000, actual: 28000, status: 'Paid', dueDate: '2026-11-18', notes: 'Neon sign is keeper souvenir for Leo’s apartment!' }
    ],
    timeline: [
      { id: 't-201', phase: 'Milestones', time: '6 Weeks Out', task: 'Lock rooftop date and deposit with Skyline Penthouse', completed: true, lead: 'Leo', category: 'Venue' },
      { id: 't-202', phase: 'Milestones', time: '4 Weeks Out', task: 'Send sleek digital animated invitations via Partiful', completed: true, lead: 'Leo', category: 'Invites' },
      { id: 't-203', phase: 'Milestones', time: '2 Weeks Out', task: 'Finalize drink menu with craft mixologist & order custom neon', completed: true, lead: 'Host', category: 'Bar' },
      { id: 't-204', phase: 'Milestones', time: '3 Days Out', task: 'Confirm final headcount with caterer (62 confirmed)', completed: false, lead: 'Leo', category: 'Catering' },
      { id: 't-205', phase: 'Run-of-Show', time: '05:30 PM', task: 'Rooftop access begins; DJ soundcheck & Neon photo wall setup', completed: false, lead: 'DJ / Planner', category: 'Setup' },
      { id: 't-206', phase: 'Run-of-Show', time: '06:30 PM', task: 'Doors open, sunset welcome cocktails & tapas grazing table opens', completed: false, lead: 'Bartender', category: 'Reception' },
      { id: 't-207', phase: 'Run-of-Show', time: '08:30 PM', task: 'Surprise video montage of friends from abroad on terrace projector', completed: false, lead: 'Best Friend', category: 'Milestone' },
      { id: 't-208', phase: 'Run-of-Show', time: '09:00 PM', task: 'Champagne toast, birthday cake presentation with sparklers', completed: false, lead: 'Host & DJ', category: 'Toast' },
      { id: 't-209', phase: 'Run-of-Show', time: '09:30 PM', task: 'High-energy DJ set kicks off under city lights & skyline backdrop', completed: false, lead: 'DJ', category: 'Party' }
    ],
    vendors: [
      { id: 'v-201', category: 'Venue', name: 'Skyline Terrace & Penthouse', contactName: 'Alex Mercer', phone: '(503) 555-4819', email: 'events@skylineterrace.com', quoted: 180000, final: 180000, depositPaid: 180000, status: 'Booked', vettingQuestions: ['Is rooftop sound volume permitted until midnight?', 'Can the venue supply patio heaters if weather turns chilly?'], notes: 'Includes glass elevator access and security guard.' },
      { id: 'v-202', category: 'Mixology', name: 'Velvet Shaker Mobile Bar', contactName: 'Dante Cruz', phone: '(503) 555-8392', email: 'dante@velvetshaker.com', quoted: 90000, final: 85000, depositPaid: 45000, status: 'Booked', vettingQuestions: ['Do you bring your own ice, glassware, and garnishes?'], notes: 'Cocktails: Smoked Mezcal Paloma, Yuzu Tokyo Mule, Spiced Pear Mocktail.' },
      { id: 'v-203', category: 'DJ', name: 'DJ K-Vibe (Lounge & Beats)', contactName: 'Kevin Vu', phone: '(503) 555-9102', email: 'kevin@kvibesound.com', quoted: 60000, final: 60000, depositPaid: 30000, status: 'Booked', vettingQuestions: ['Can guests request tracks through an online playlist queue?'], notes: 'Deep house, indie disco, 2000s R&B throwbacks.' }
    ],
    ideas: [
      { id: 'i-201', category: 'Signature Cocktail', title: 'The "Chapter 30" Smoked Mezcal Paloma', description: 'Single-estate mezcal, ruby red grapefruit, fresh lime, rosemary simple syrup, poured in smoked chili-salt rimmed tumblers under a dome of aromatic smoke.', tags: ['Cocktail', 'Smoked', 'Interactive'], favorite: true },
      { id: 'i-202', category: 'Keepsake', title: 'Illuminated Polaroid Memory Wall', description: 'Dual Polaroid instant cameras with gold metallic Sharpies where guests snap retro candid photos and peg them onto a backlit copper wire grid.', tags: ['Photo', 'Retro', 'Guestbook'], favorite: true },
      { id: 'i-203', category: 'Interactive Game', title: 'The Roast & Toast 60-Second Speed Speeches', description: 'Instead of long awkward speeches, pass around an illuminated retro microphone for 60-second speed compliments, funny memories, or predictions for Leo’s 30s.', tags: ['Fun', 'Speeches', 'Crowd'], favorite: false }
    ],
    guests: [
      { id: 'g-201', name: 'Leo Martinez (Birthday Star)', rsvp: 'Attending', count: 1, meal: 'VIP Tapas', table: 'VIP Lounge', diet: 'None' },
      { id: 'g-202', name: 'Maya Lin & Partner', rsvp: 'Attending', count: 2, meal: 'Tapas', table: 'Lounge A', diet: 'Vegetarian' },
      { id: 'g-203', name: 'Devon Patel', rsvp: 'Attending', count: 1, meal: 'Tapas', table: 'Lounge B', diet: 'Gluten-Free' },
      { id: 'g-204', name: 'Chloe King', rsvp: 'Attending', count: 1, meal: 'Tapas', table: 'Lounge A', diet: 'None' }
    ]
  },

  {
    id: 'evt-community-03',
    type: 'community',
    title: 'Oakridge Harvest & Lantern Community Jubilee',
    date: '2026-11-21',
    location: 'Heritage Memorial Park & Open Amphitheater',
    budgetTotal: 1250000,
    currency: '₹',
    guestCount: 500,
    vibe: 'Warm Autumnal, Floating Eco-Lanterns, Live Acoustic & Artisan Food',
    heroImage: 'assets/images/community-hero.jpg',
    healthScore: 85,
    notes: 'Free public community event with registered lantern passes. 14 local food trucks, 2 stages, kids eco-craft pavilion, and sunset floating lantern ceremony.',
    palette: [
      { name: 'Warm Terracotta', hex: '#c85a32' },
      { name: 'Lantern Gold', hex: '#f59e0b' },
      { name: 'Evergreen Pine', hex: '#164e63' },
      { name: 'Cozy Oatmeal', hex: '#f5efe6' },
      { name: 'Cider Amber', hex: '#b45309' }
    ],
    budget: [
      { id: 'b-301', category: 'Permits & Municipal', item: 'City Park Permit, Fire Marshall & Police Detail', allocated: 180000, actual: 175000, status: 'Paid', dueDate: '2026-10-01', notes: 'Approved by City Council and Fire Dept' },
      { id: 'b-302', category: 'Eco Lanterns & Safety', item: '600 100% Biodegradable Rice-Paper Water Lanterns with LED Candles', allocated: 220000, actual: 215000, status: 'Paid', dueDate: '2026-10-15', notes: 'Zero open flame hazard; lake retrieval booms included' },
      { id: 'b-303', category: 'Stage & Production', item: 'Amphitheater Sound, Stage Rigging & Lighting Techs', allocated: 320000, actual: 320000, status: 'Invoiced', dueDate: '2026-11-10', notes: 'Stage generator, microphones, sound engineer for 8 hrs' },
      { id: 'b-304', category: 'Waste & Sanitation', item: 'Eco-Cycle Trash, Recycling & Portable Restroom Units', allocated: 140000, actual: 135000, status: 'Paid', dueDate: '2026-10-25', notes: 'Includes ADA accessible units and handwashing stations' },
      { id: 'b-305', category: 'Community Performers', item: 'Honorariums for 3 Local Folk Bands & Youth Choir', allocated: 180000, actual: 180000, status: 'Invoiced', dueDate: '2026-11-20', notes: 'Paid directly via civic grant account' },
      { id: 'b-306', category: 'Kids Pavilion & Crafts', item: 'Autumn Leaf Printing, Pottery & Face Paint', allocated: 80000, actual: 72000, status: 'Paid', dueDate: '2026-11-05', notes: 'Supervised by volunteer college art students' },
      { id: 'b-307', category: 'Signage & Marketing', item: 'Printed Directional Banners, Maps & Social Ad Campaign', allocated: 70000, actual: 65000, status: 'Paid', dueDate: '2026-10-20', notes: 'Bilingual signage in English and Hindi' },
      { id: 'b-308', category: 'Volunteer Hospitality', item: 'Snacks, Refreshments & High-Vis Vests for 35 Volunteers', allocated: 50000, actual: 45000, status: 'Paid', dueDate: '2026-11-12', notes: 'Basecamp in park clubhouse' },
      { id: 'b-309', category: 'Contingency Reserve', item: 'Rain Weather Buffer / Emergency Fund', allocated: 35000, actual: 0, status: 'Estimated', dueDate: '2026-11-21', notes: 'Covers sudden canopy rentals if drizzle occurs' }
    ],
    timeline: [
      { id: 't-301', phase: 'Milestones', time: '3 Months Out', task: 'File municipal park permits & secure community council co-sponsorship', completed: true, lead: 'Council Rep', category: 'Permits' },
      { id: 't-302', phase: 'Milestones', time: '2 Months Out', task: 'Curate 14 artisan food trucks & confirm health dept vendor permits', completed: true, lead: 'Food Lead', category: 'Vendors' },
      { id: 't-303', phase: 'Milestones', time: '1 Month Out', task: 'Open free registration for Lantern kits (500 tickets reserved in 48 hrs!)', completed: true, lead: 'Marketing', category: 'Registration' },
      { id: 't-304', phase: 'Milestones', time: '2 Weeks Out', task: 'Hold volunteer orientation session & assign safety teams', completed: false, lead: 'Volunteer Coord', category: 'Staff' },
      { id: 't-305', phase: 'Run-of-Show', time: '12:00 PM', task: 'Park load-in begins for sound engineering team & restroom delivery', completed: false, lead: 'Ops Director', category: 'Logistics' },
      { id: 't-306', phase: 'Run-of-Show', time: '02:00 PM', task: 'Food truck alley arrives & health inspector checks food temperatures', completed: false, lead: 'Food Lead', category: 'Vendors' },
      { id: 't-307', phase: 'Run-of-Show', time: '03:30 PM', task: 'Gates open; Kids Harvest Craft Pavilion & Live Acoustic Stage 1 kick off', completed: false, lead: 'MC & Welcome Team', category: 'Festival' },
      { id: 't-308', phase: 'Run-of-Show', time: '05:00 PM', task: 'Lantern Distribution Booth opens: attendees pen their community wishes on lanterns', completed: false, lead: 'Volunteer Team A', category: 'Ceremony' },
      { id: 't-309', phase: 'Run-of-Show', time: '06:15 PM', task: 'Sunset Address & Youth Choir performance', completed: false, lead: 'Civic Team', category: 'Main Stage' },
      { id: 't-310', phase: 'Run-of-Show', time: '06:45 PM', task: 'Community Floating Lantern Launch on the Reflecting Pond', completed: false, lead: 'Safety & Lake Crew', category: 'Highlight' },
      { id: 't-311', phase: 'Run-of-Show', time: '07:30 PM', task: 'Headline Folk Band concert under festoon lights', completed: false, lead: 'Stage Manager', category: 'Concert' },
      { id: 't-312', phase: 'Run-of-Show', time: '09:30 PM', task: 'Festival concludes; Eco-clean-up volunteer sweep & boom lantern retrieval', completed: false, lead: 'Green Team', category: 'Teardown' }
    ],
    vendors: [
      { id: 'v-301', category: 'Production', name: 'Apex Sound & Concert Rigging', contactName: 'Rob Alvarez', phone: '(503) 555-7721', email: 'rob@apexproaudio.com', quoted: 320000, final: 320000, depositPaid: 160000, status: 'Booked', vettingQuestions: ['Do you have weatherized covers for sound consoles if rain starts?', 'Is an independent quiet generator supplied for amphitheater power?'], notes: 'Includes 2 stage engineers on site throughout the festival.' },
      { id: 'v-302', category: 'Eco Lanterns', name: 'PureWaters Eco-Lanterns Co.', contactName: 'Lillian Scott', phone: '(503) 555-3310', email: 'sales@purewaterslanterns.org', quoted: 220000, final: 215000, depositPaid: 215000, status: 'Booked', vettingQuestions: ['Are materials 100% biodegradable within 7 days in freshwater?'], notes: 'LED water-activated lights; non-toxic rice paper.' },
      { id: 'v-303', category: 'Sanitation', name: 'Eco-Cycle Event Services', contactName: 'Marcus Gray', phone: '(503) 555-9014', email: 'service@ecocycleevent.com', quoted: 140000, final: 135000, depositPaid: 70000, status: 'Booked', vettingQuestions: ['Will service staff restock toilet paper and hand sanitizer mid-event?'], notes: 'Includes portable units (ADA compliant) + recycling sorting stations.' }
    ],
    ideas: [
      { id: 'i-301', category: 'Community Experience', title: 'The "Wishes on Water" Floating Ceremony', description: 'Before releasing their biodegradable water lanterns into the reflecting pool, participants write a hope, remembrance, or community wish in calligraphy on each lantern face. As hundreds gently float together in the dusk, it creates an unforgettable collective moment.', tags: ['Sentimental', 'Lanterns', 'Community'], favorite: true },
      { id: 'i-302', category: 'Local Flavor', title: 'Artisan Food Truck Tasting Passport', description: 'A printable passport card where attendees get stamped at 4 different local cultural food trucks to be entered into a community artisan gift basket raffle.', tags: ['Food', 'Gamification', 'Local'], favorite: true },
      { id: 'i-303', category: 'Eco Sustainability', title: 'Leave-No-Trace Youth Green Ambassadors', description: 'Empower local high school environmental club members with fluorescent vests as "Green Ambassadors" who help attendees sort compost and recyclables, turning waste reduction into a fun community challenge.', tags: ['Eco', 'Youth', 'Civic'], favorite: true }
    ],
    guests: [
      { id: 'g-301', name: 'Oakridge Community Registered (Wave 1: 3:30 PM)', rsvp: 'Attending', count: 250, meal: 'Food Trucks', table: 'Lawn Area A', diet: 'Varied' },
      { id: 'g-302', name: 'Oakridge Community Registered (Wave 2: 5:00 PM)', rsvp: 'Attending', count: 220, meal: 'Food Trucks', table: 'Lawn Area B', diet: 'Varied' },
      { id: 'g-303', name: 'Civic Dignitaries & Delegation', rsvp: 'Attending', count: 12, meal: 'VIP Hospitality', table: 'VIP Pavilion', diet: 'Catered' }
    ]
  }
];

class DataStore {
  constructor() {
    this.events = this.loadFromStorage();
    this.currentEventId = localStorage.getItem(CURRENT_EVENT_KEY) || this.events[0].id;
    // Validate current event exists
    if (!this.getEventById(this.currentEventId)) {
      this.currentEventId = this.events[0].id;
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Automatic migration: Ensure currency is ₹ across all events
          parsed.forEach(evt => {
            if (evt.currency === '$' || !evt.currency) {
              evt.currency = '₹';
              if (evt.budgetTotal < 100000) {
                evt.budgetTotal *= 80;
                (evt.budget || []).forEach(b => {
                  b.allocated = (b.allocated || 0) * 80;
                  b.actual = (b.actual || 0) * 80;
                });
                (evt.vendors || []).forEach(v => {
                  v.quoted = (v.quoted || 0) * 80;
                  v.final = (v.final || 0) * 80;
                  v.depositPaid = (v.depositPaid || 0) * 80;
                });
              }
            }
          });
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved events from LocalStorage, loading defaults.', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_EVENTS));
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
      localStorage.setItem(CURRENT_EVENT_KEY, this.currentEventId);
    } catch (e) {
      console.error('Error saving to LocalStorage', e);
    }
  }

  getEvents() {
    return this.events;
  }

  getCurrentEvent() {
    return this.getEventById(this.currentEventId) || this.events[0];
  }

  setCurrentEvent(id) {
    if (this.getEventById(id)) {
      this.currentEventId = id;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getEventById(id) {
    return this.events.find(e => e.id === id);
  }

  createEvent(eventData) {
    const newId = 'evt-' + Date.now();
    const newEvent = {
      id: newId,
      type: eventData.type || 'custom',
      title: eventData.title || 'Untitled Celebration',
      date: eventData.date || new Date().toISOString().split('T')[0],
      location: eventData.location || 'Bespoke Location',
      budgetTotal: Number(eventData.budgetTotal) || 1000000,
      currency: eventData.currency || '₹',
      guestCount: Number(eventData.guestCount) || 50,
      vibe: eventData.vibe || 'Chic, Joyful & Memorable',
      heroImage: eventData.heroImage || (
        eventData.type === 'wedding' ? 'assets/images/wedding-hero.jpg' :
        eventData.type === 'birthday' ? 'assets/images/birthday-hero.jpg' :
        'assets/images/community-hero.jpg'
      ),
      healthScore: 80,
      notes: eventData.notes || 'Created with AI Planning Assistant.',
      palette: eventData.palette || [
        { name: 'Primary Accent', hex: '#6366f1' },
        { name: 'Warm Gold', hex: '#f59e0b' },
        { name: 'Rose', hex: '#ec4899' },
        { name: 'Clean Ivory', hex: '#f8fafc' },
        { name: 'Slate Dark', hex: '#0f172a' }
      ],
      budget: eventData.budget || [],
      timeline: eventData.timeline || [],
      vendors: eventData.vendors || [],
      ideas: eventData.ideas || [],
      guests: eventData.guests || []
    };

    this.events.unshift(newEvent);
    this.currentEventId = newId;
    this.saveToStorage();
    return newEvent;
  }

  updateEvent(id, updates) {
    const event = this.getEventById(id);
    if (!event) return null;
    Object.assign(event, updates);
    this.saveToStorage();
    return event;
  }

  deleteEvent(id) {
    if (this.events.length <= 1) {
      alert("At least one event must remain active.");
      return false;
    }
    this.events = this.events.filter(e => e.id !== id);
    if (this.currentEventId === id) {
      this.currentEventId = this.events[0].id;
    }
    this.saveToStorage();
    return true;
  }

  resetToDefaults() {
    this.events = JSON.parse(JSON.stringify(INITIAL_EVENTS));
    this.currentEventId = this.events[0].id;
    this.saveToStorage();
  }

  // --- Budget Operations ---
  addExpense(eventId, expense) {
    const evt = this.getEventById(eventId);
    if (!evt) return null;
    if (!evt.budget) evt.budget = [];
    const newExpense = {
      id: 'b-' + Date.now(),
      category: expense.category || 'General',
      item: expense.item || 'New Expense',
      allocated: Number(expense.allocated) || 0,
      actual: Number(expense.actual) || 0,
      status: expense.status || 'Estimated',
      dueDate: expense.dueDate || '',
      notes: expense.notes || ''
    };
    evt.budget.push(newExpense);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return newExpense;
  }

  updateExpense(eventId, expenseId, updates) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.budget) return null;
    const item = evt.budget.find(b => b.id === expenseId);
    if (!item) return null;
    if (updates.allocated !== undefined) updates.allocated = Number(updates.allocated);
    if (updates.actual !== undefined) updates.actual = Number(updates.actual);
    Object.assign(item, updates);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return item;
  }

  deleteExpense(eventId, expenseId) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.budget) return false;
    evt.budget = evt.budget.filter(b => b.id !== expenseId);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return true;
  }

  // --- Timeline Operations ---
  addTimelineItem(eventId, item) {
    const evt = this.getEventById(eventId);
    if (!evt) return null;
    if (!evt.timeline) evt.timeline = [];
    const newItem = {
      id: 't-' + Date.now(),
      phase: item.phase || 'Milestones',
      time: item.time || 'Upcoming',
      task: item.task || 'New Timeline Milestone',
      completed: !!item.completed,
      lead: item.lead || 'Organizer',
      category: item.category || 'Coordination'
    };
    evt.timeline.push(newItem);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return newItem;
  }

  updateTimelineItem(eventId, itemId, updates) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.timeline) return null;
    const item = evt.timeline.find(t => t.id === itemId);
    if (!item) return null;
    Object.assign(item, updates);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return item;
  }

  deleteTimelineItem(eventId, itemId) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.timeline) return false;
    evt.timeline = evt.timeline.filter(t => t.id !== itemId);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return true;
  }

  // --- Vendor Operations ---
  addVendor(eventId, vendor) {
    const evt = this.getEventById(eventId);
    if (!evt) return null;
    if (!evt.vendors) evt.vendors = [];
    const newVendor = {
      id: 'v-' + Date.now(),
      category: vendor.category || 'General',
      name: vendor.name || 'New Vendor',
      contactName: vendor.contactName || '',
      phone: vendor.phone || '',
      email: vendor.email || '',
      quoted: Number(vendor.quoted) || 0,
      final: Number(vendor.final) || 0,
      depositPaid: Number(vendor.depositPaid) || 0,
      status: vendor.status || 'Researching',
      vettingQuestions: vendor.vettingQuestions || [
        'What is your cancellation or rescheduling policy?',
        'Do you provide insurance coverage and backup staff?'
      ],
      notes: vendor.notes || ''
    };
    evt.vendors.push(newVendor);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return newVendor;
  }

  updateVendor(eventId, vendorId, updates) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.vendors) return null;
    const vendor = evt.vendors.find(v => v.id === vendorId);
    if (!vendor) return null;
    if (updates.quoted !== undefined) updates.quoted = Number(updates.quoted);
    if (updates.final !== undefined) updates.final = Number(updates.final);
    if (updates.depositPaid !== undefined) updates.depositPaid = Number(updates.depositPaid);
    Object.assign(vendor, updates);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return vendor;
  }

  deleteVendor(eventId, vendorId) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.vendors) return false;
    evt.vendors = evt.vendors.filter(v => v.id !== vendorId);
    this.recalculateHealth(evt);
    this.saveToStorage();
    return true;
  }

  // --- Ideas Operations ---
  addIdea(eventId, idea) {
    const evt = this.getEventById(eventId);
    if (!evt) return null;
    if (!evt.ideas) evt.ideas = [];
    const newIdea = {
      id: 'i-' + Date.now(),
      category: idea.category || 'Inspiration',
      title: idea.title || 'Creative Idea',
      description: idea.description || '',
      tags: Array.isArray(idea.tags) ? idea.tags : (idea.tags ? idea.tags.split(',').map(s => s.trim()) : ['GenAI']),
      favorite: !!idea.favorite
    };
    evt.ideas.unshift(newIdea);
    this.saveToStorage();
    return newIdea;
  }

  toggleIdeaFavorite(eventId, ideaId) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.ideas) return null;
    const idea = evt.ideas.find(i => i.id === ideaId);
    if (!idea) return null;
    idea.favorite = !idea.favorite;
    this.saveToStorage();
    return idea;
  }

  deleteIdea(eventId, ideaId) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.ideas) return false;
    evt.ideas = evt.ideas.filter(i => i.id !== ideaId);
    this.saveToStorage();
    return true;
  }

  // --- Guests Operations ---
  addGuest(eventId, guest) {
    const evt = this.getEventById(eventId);
    if (!evt) return null;
    if (!evt.guests) evt.guests = [];
    const newGuest = {
      id: 'g-' + Date.now(),
      name: guest.name || 'Guest Name',
      rsvp: guest.rsvp || 'Pending',
      count: Number(guest.count) || 1,
      meal: guest.meal || 'Standard',
      table: guest.table || 'Unassigned',
      diet: guest.diet || 'None'
    };
    evt.guests.push(newGuest);
    this.saveToStorage();
    return newGuest;
  }

  updateGuest(eventId, guestId, updates) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.guests) return null;
    const guest = evt.guests.find(g => g.id === guestId);
    if (!guest) return null;
    if (updates.count !== undefined) updates.count = Number(updates.count);
    Object.assign(guest, updates);
    this.saveToStorage();
    return guest;
  }

  deleteGuest(eventId, guestId) {
    const evt = this.getEventById(eventId);
    if (!evt || !evt.guests) return false;
    evt.guests = evt.guests.filter(g => g.id !== guestId);
    this.saveToStorage();
    return true;
  }

  // --- Health Score Calculation ---
  recalculateHealth(evt) {
    if (!evt) return 80;
    let score = 50;

    // Timeline progress (up to 20 pts)
    if (evt.timeline && evt.timeline.length > 0) {
      const completed = evt.timeline.filter(t => t.completed).length;
      score += Math.round((completed / evt.timeline.length) * 20);
    }

    // Vendor booking status (up to 20 pts)
    if (evt.vendors && evt.vendors.length > 0) {
      const booked = evt.vendors.filter(v => v.status === 'Booked' || v.status === 'Completed').length;
      score += Math.round((booked / evt.vendors.length) * 20);
    }

    // Budget prudence (up to 10 pts)
    if (evt.budget && evt.budget.length > 0) {
      const totalActual = evt.budget.reduce((acc, b) => acc + (b.actual || 0), 0);
      if (totalActual <= evt.budgetTotal) {
        score += 10;
      } else if (totalActual <= evt.budgetTotal * 1.05) {
        score += 5;
      }
    }

    evt.healthScore = Math.min(100, Math.max(20, score));
    return evt.healthScore;
  }

  // Export / Import
  exportToJson() {
    return JSON.stringify(this.events, null, 2);
  }

  importFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        this.events = parsed;
        this.currentEventId = this.events[0].id;
        this.saveToStorage();
        return true;
      }
    } catch (e) {
      console.error('Failed to parse imported JSON', e);
    }
    return false;
  }
}

// Global singleton instance
window.dataStore = new DataStore();
