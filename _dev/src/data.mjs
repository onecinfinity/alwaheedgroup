// Site content and settings. Everything marked PLACEHOLDER must be replaced
// with the client's real details before launch.

export const site = {
  // Keep false while placeholder content (testimonials, some stats, jobs) is live.
  // false = every page gets noindex and robots.txt blocks crawling.
  launchReady: false,

  name: 'Al Waheed Group of Companies',
  shortName: 'Al Waheed Group',
  brand: 'Al Waheed',
  // Main domain. alwaheedgroupofcompanies.com and both www versions redirect here (src/static/.htaccess).
  url: 'https://alwaheedgroup.com',
  tagline: 'Building Better Lives',
  foundingYear: 2016,
  phone: '+92 306 0005559',
  phoneHref: '+923060005559',
  whatsapp: '923060005559',
  whatsappText: 'Hi Al Waheed Group, I would like to know more about your projects.',
  email: 'info@alwaheedgroup.com', // PLACEHOLDER: create this mailbox or replace it
  careersEmail: 'careers@alwaheedgroup.com', // PLACEHOLDER: create this mailbox or replace it
  address: {
    street: 'SB No. 2, United Palm Greens, Main 400 ft Wide Road, Scheme 43',
    detail: 'Survey No. 416, Deh Jam Chakro, beside Silk Garden',
    mapQuery: 'United Palm Greens, Scheme 43, Karachi',
    city: 'Karachi',
    region: 'Sindh',
    country: 'PK',
    countryName: 'Pakistan',
  },
  geo: { lat: 25.0369, lng: 67.0626 }, // PLACEHOLDER coordinates
  hours: [
    { days: 'Saturday to Thursday', open: '11:00', close: '19:00', label: '11:00 AM to 7:00 PM', dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
    { days: 'Friday', label: 'Closed' },
  ],
  social: {
    facebook: 'https://www.facebook.com/share/1C6BQvyL7a/',
    instagram: 'https://www.instagram.com/alwaheedgroup/',
  },
  socialIsReal: true,
  storyVideoId: '', // YouTube video id for "Watch Our Story". Empty hides the button.
  web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY', // from https://web3forms.com
};

export const stats = [
  { value: new Date().getFullYear() - 2016, suffix: '+', label: 'Years of Experience' },
  { value: 5, suffix: '', label: 'Projects & Ventures' },
  { value: 3500, suffix: '+', label: 'Families Served' }, // PLACEHOLDER
  { value: 8, suffix: '', label: 'Affiliated Groups' },
];

// Affiliated groups shown on the site. `sub: true` marks companies that are part of Al Waheed Group itself.
export const companies = [
  {
    id: 'al-waheed-developers',
    name: 'Al Waheed Builders and Developers',
    sector: 'Real Estate Development',
    mark: 'emblem',
    sub: true,
    summary: 'The development arm of the group. Al Waheed Builders and Developers plans, builds and delivers gated communities, starting with United Palm Greens in Scheme 43, Karachi.',
    services: ['Master planning and land development', 'Gated residential communities', 'Infrastructure and civil works'],
    link: ['/projects/united-palm-greens/', 'View United Palm Greens'],
  },
  {
    id: 'hk-builders',
    name: 'HK Builders and Developers',
    sector: 'Construction & Development',
    mark: 'hk',
    url: 'https://www.hkbuildersanddevelopers.com/',
    summary: 'A Karachi construction and project marketing company that guides buyers through new residential and commercial projects with transparent, end to end support.',
    services: ['Construction services', 'Project marketing and sales', 'Buyer advisory'],
  },
  {
    id: 'al-ghaffar-group',
    name: 'Al Ghaffar Group',
    sector: 'Real Estate Development',
    mark: 'alghaffar',
    summary: 'The developer of Khairunnisa Heights, a high rise apartment project on Main Scheme 33 Road, Karachi, proudly sponsored by Al Waheed Group.',
    services: ['High rise residential projects', 'Apartment development', 'Project planning and delivery'],
    link: ['/projects/khairunnisa-heights/', 'View Khairunnisa Heights'],
  },
  {
    id: 'jinnah-real-estate',
    name: 'Jinnah Real Estate and Builders',
    sector: 'Real Estate & Construction',
    mark: 'jinnah',
    // PLACEHOLDER description and services: confirm with the client
    summary: 'A real estate and building company affiliated with Al Waheed Group, helping buyers, sellers and investors across Karachi.',
    services: ['Property sales and purchase', 'Building and construction', 'Investment advisory'],
  },
  {
    id: 'umg',
    name: 'United Marketing Group',
    sector: 'Sales & Marketing',
    mark: 'umg',
    sub: true,
    summary: 'The sales and marketing company of the group and the official marketing partner of United Palm Greens. UMG runs launches, dealer networks and digital campaigns.',
    services: ['Project launches', 'Dealer network management', 'Digital and field marketing'],
  },
  // PLACEHOLDER descriptions and services for the three groups below: confirm with the client
  {
    id: 'al-ghafoor-group',
    name: 'Al Ghafoor Group',
    sector: 'Real Estate Development',
    mark: 'alghafoor',
    summary: 'An established Karachi real estate group and a long standing partner of Al Waheed, which served as its authorized dealer from 2022 to 2023.',
    services: ['Residential and commercial projects', 'Construction and development', 'Dealer partnerships'],
    link: ['/affiliated-groups/#dealerships', 'Our dealership history'],
  },
  {
    id: 'mera-ghar-rehaish',
    name: 'Mera Ghar Rehaish',
    sector: 'Building & Marketing',
    mark: 'meragharrehaish',
    summary: 'A building and marketing company that turns a client\'s vision into a finished home, from construction through to sale.',
    services: ['Building and construction', 'Property marketing', 'Client advisory'],
  },
  {
    id: 'rehaish',
    name: 'Rehaish',
    sector: 'Real Estate & Marketing',
    mark: 'rehaish',
    summary: 'A real estate and marketing company helping buyers, sellers and investors find the right property in Karachi.',
    services: ['Property sales and purchase', 'Real estate marketing', 'Investment guidance'],
  },
];

// Developers that Al Waheed Group represents as an authorized dealer
export const dealerships = [
  {
    id: 'falaknaz-group',
    name: 'Falaknaz Group',
    period: 'Since 2023',
    logo: ['/assets/img/brand/falaknaz-logo.webp', 350, 244],
    text: 'Al Waheed Group has been an authorized dealer of Falaknaz Group since 2023, helping families and investors book Falaknaz projects with guided site visits and after sales support.',
  },
  {
    id: 'al-ghafoor',
    name: 'Al Ghafoor Builders & Developers',
    period: '2022 to 2023',
    logo: ['/assets/img/brand/al-ghafoor-logo.webp', 422, 106],
    text: 'Al Waheed Group worked as an authorized dealer for Al Ghafoor Builders & Developers, guiding buyers through bookings, documentation and installment plans.',
  },
];

// Payment schedule for United Palm Greens. Feeds both the page table and the PDF.
export const paymentPlan = {
  project: 'United Palm Greens',
  plot: '120 Sq. Yds',
  category: 'Residential Plot',
  rows: [
    { label: 'On Booking', count: '1', amount: 1000000 },
    { label: 'On Confirmation', count: '1', amount: 300000 },
    { label: 'On Allocation', count: '1', amount: 300000 },
    { label: 'Monthly Installments', count: '36 × 45,000', amount: 1620000 },
    { label: 'Half Yearly Installments', count: '6 × 296,667', amount: 1780000, mark: true },
    { label: 'On Possession', count: '1', amount: 1000000 },
  ],
  totalLabel: 'Cash Price',
  total: 6000000,
  footnote: 'Half yearly installments are rounded. Their total is Rs. 1,780,000.',
  extras: [['Corner', 500000], ['Park Facing', 250000], ['Road Facing', 250000], ['West Open', 500000], ['Single Belt', 500000]],
  notes: [
    'All installments must be paid by the allottee strictly as per the agreed schedule, between the 1st and 10th of each month, and the allottee shall abide by the terms and conditions of the booking application form.',
    'All extra charges are payable within 180 days from the date of booking.',
    'The allocation of the plot shall remain provisional until the company receives full payment.',
    'Documentation and development charges, lease, and connection charges for gas, electricity, water and sewerage will be charged extra as and when demanded by the company, as these charges are not included in the above cost.',
  ],
  signatures: ['Date', 'Plot No.', 'Sector / Phase', 'Booked By', 'Project Incharge', 'Sales Manager', 'Read, Understood & Accepted', 'Approved by Management'],
};

export const downloads = {
  paymentSchedule: {
    title: 'Payment Schedule',
    detail: '120 Sq. Yds residential plot: booking, installments, extra charges and terms',
    file: '/downloads/united-palm-greens-payment-schedule-120-sq-yds.pdf',
    preview: '/assets/img/docs/payment-schedule.webp',
  },
  layoutPlan: {
    title: 'Layout Plan',
    detail: 'Blocks, plot numbers, road widths, amenities and commercial plots',
    file: '/downloads/united-palm-greens-layout-plan.pdf',
    image: '/downloads/united-palm-greens-layout-plan.jpg',
    preview: '/assets/img/docs/layout-plan.webp',
  },
  khairunnisa: {
    title: 'Payment Schedules & Floor Plans',
    detail: 'Ruby, Opal and Diamond apartments: payment plans, floor plans and terms',
    file: '/downloads/khairunnisa-heights-payment-schedules-floor-plans.pdf',
    preview: '/assets/img/docs/khairunnisa-heights.webp',
  },
};

// Khairunnisa Heights terms, cleaned up from the developer's payment schedule
const khNotes = [
  'A special discount is available against full cash payment at the time of booking.',
  'All extra charges are payable within 180 days from the date of booking.',
  'All installments must be deposited before the 10th of every month.',
  'The booking token is valid for 3 days only.',
  'All installment payments shall be made by cheque, pay order or demand draft in favour of the company, crossed "Payee\'s Account Only". Cash will not be accepted.',
  'Lease documentation expenses and charges for electricity (transformer, meter etc.), gas, water and sewerage connections are not included in the above cost and shall be payable by the allottee on demand.',
  'The allocation of a unit shall remain provisional until full and final payment is received by the company.',
  'The terms and conditions in the Application Form are the essence of this payment schedule, and the buyer undertakes to abide by them.',
];

export const projects = [
  {
    slug: 'united-palm-greens',
    name: 'United Palm Greens',
    tagline: 'Live Green, Live United',
    status: 'Booking Open',
    role: 'Developed by Al Waheed Group',
    developer: 'Al Waheed Builders & Developers',
    marketedBy: 'United Marketing Group',
    type: 'Gated Community',
    schemaType: 'GatedResidenceCommunity',
    area: 'Scheme 43',
    place: 'Scheme 43, Karachi',
    location: 'Main 400 ft Wide Road, Scheme 43, Survey No. 416, Deh Jam Chakro, Karachi',
    mapQuery: 'United Palm Greens, Scheme 43, Karachi',
    bookingFrom: 600000,
    plots: '120, 400 and 2,000 Sq. Yds',
    plotsShort: '120 to 2,000 Sq. Yds',
    payment: '36 monthly and 6 half yearly installments',
    possession: 'On completion',
    launched: 2026,
    card: 'united-palm-greens/r6',
    hero: 'united-palm-greens/r6',
    og: 'united-palm-greens',
    logo: '/assets/img/brand/upg-logo.webp',
    intro: 'United Palm Greens is the first development of Al Waheed Group: a gated community on the Main 400 ft Wide Road in Scheme 43, Karachi, planned so that worship, schooling, parks and daily shopping are all a short walk from home.',
    body: [
      'Set on the Main 400 ft Wide Road in Scheme 43 (Survey No. 416, Deh Jam Chakro), beside Silk Garden by Naya Nazimabad and with frontage on Surjani Town Link Road, United Palm Greens is laid out in four residential blocks (A, A-1, B and B-1) with dedicated commercial plots at the entrance. A 60 foot main boulevard runs through the community, supported by 40, 30 and 20 foot internal roads.',
      'At its heart are the Jamia Masjid Abdul Majeed, an education center, a public building, a central park with a children\'s playground and landscaped green belts. Residential towers with a commercial podium and modern townhouses give families a choice of lifestyle, all behind a grand entrance gate with 24/7 security.',
      'Plots are available in 120, 400 and 2,000 square yard sizes. Booking starts from Rs. 600,000, with the balance paid in easy monthly and half yearly installments. Download the payment schedule and layout plan below, or book a site visit with our team.',
    ],
    amenities: [
      ['mosque', 'Jamia Masjid Abdul Majeed', 'A community mosque within walking distance'],
      ['school', 'Education Center', 'Quality schooling inside the community'],
      ['tree', 'Central Park & Playground', 'Landscaped lawns, walking tracks and a play area'],
      ['road', '60 ft Main Boulevard', 'Plus 40, 30 and 20 ft internal roads'],
      ['shop', 'Commercial Plots', 'Shops and daily conveniences at the entrance'],
      ['shield', '24/7 Gated Security', 'Controlled entry with round the clock guards'],
      ['building', 'Public Building', 'Community services and management office'],
      ['sport', 'Indoor Cricket & Gym', 'Sports and fitness for every age'],
    ],
    gallery: [
      ['united-palm-greens/r6', 'Grand entrance gate of United Palm Greens with the Al Waheed emblem'],
      ['united-palm-greens/main', 'United Palm Greens entrance and residential tower at night'],
      ['united-palm-greens/r1', 'Aerial view of United Palm Greens, Scheme 43, Karachi'],
      ['united-palm-greens/r5', 'Residential towers with a commercial podium at United Palm Greens'],
      ['united-palm-greens/r4', 'Modern townhouses at United Palm Greens'],
      ['united-palm-greens/r10', 'Palm lined main boulevard between townhouse rows'],
      ['united-palm-greens/r7', 'Central park with walking tracks and seating'],
      ['united-palm-greens/r11', 'Children\'s playground and park'],
      ['united-palm-greens/r2', 'Jamia Masjid Abdul Majeed at United Palm Greens'],
      ['united-palm-greens/r3', 'Education center inside United Palm Greens'],
      ['united-palm-greens/r9', 'Public building at United Palm Greens'],
      ['united-palm-greens/r8', 'Residential towers along the main road'],
      ['united-palm-greens/sports', 'Indoor cricket and gym facility'],
      ['united-palm-greens/model', 'Scale model of the United Palm Greens entrance and tower'],
    ],
    nearby: ['Silk Garden by Naya Nazimabad', 'Surjani Town Link Road', 'Northern Bypass', 'Schools, hospitals and markets nearby'],
    faqs: [
      ['Where is United Palm Greens located?', 'United Palm Greens is on the Main 400 ft Wide Road in Scheme 43, Survey No. 416, Deh Jam Chakro, Karachi, beside Silk Garden by Naya Nazimabad.'],
      ['What plot sizes are available in United Palm Greens?', 'Plots are offered in 120, 400 and 2,000 square yard sizes across Blocks A, A-1, B and B-1, with separate commercial plots at the entrance.'],
      ['How much do I need to book a plot at United Palm Greens?', 'Booking starts from Rs. 600,000. The balance is paid in monthly and half yearly installments, and the full payment schedule can be downloaded on this page.'],
      ['What is the payment plan for a 120 square yard plot?', 'Rs. 1,000,000 on booking, Rs. 300,000 on confirmation, Rs. 300,000 on allocation, 36 monthly installments of Rs. 45,000, 6 half yearly installments and Rs. 1,000,000 on possession. The total cash price is Rs. 6,000,000.'],
      ['Are there extra charges for corner or park facing plots?', 'Yes. Corner, West Open and Single Belt plots carry Rs. 500,000 extra, and Park Facing or Road Facing plots carry Rs. 250,000 extra, payable within 180 days of booking.'],
      ['Who is the developer of United Palm Greens?', 'United Palm Greens is developed by Al Waheed Builders & Developers and marketed by United Marketing Group, both part of Al Waheed Group.'],
    ],
  },
  {
    slug: 'khairunnisa-heights',
    name: 'Khairunnisa Heights',
    tagline: 'Elevated Living, Thoughtfully Designed',
    status: 'Booking Open',
    role: 'Sponsored by Al Waheed Group',
    developer: 'Al Ghaffar Group',
    sponsor: 'Al Waheed Group',
    type: 'Residential Apartments',
    schemaType: 'ApartmentComplex',
    area: 'Scheme 33',
    place: 'Scheme 33, Karachi',
    location: 'Main Scheme 33 Road, Punjabi Sodagran, Karachi',
    mapQuery: 'Punjabi Saudagaran Society, Scheme 33, Karachi',
    plotsShort: '4 & 5 Room Apartments',
    payment: '24 monthly and 4 half yearly installments',
    card: 'khairunnisa-heights/tower-day',
    hero: 'khairunnisa-heights/aerial-day',
    og: 'khairunnisa-heights',
    logo: '/assets/img/brand/kh-logo.webp',
    intro: 'Khairunnisa Heights is a modern high rise apartment project by Al Ghaffar Group on Main Scheme 33 Road, Punjabi Sodagran, Karachi. Proudly sponsored by Al Waheed Group, it offers spacious 4 and 5 room homes on an easy 24 month installment plan.',
    body: [
      'Three thoughtfully planned layouts, Ruby, Opal and Diamond, give families a choice of space and budget. Every apartment has a separate drawing room and lounge, a fitted kitchen, attached bathrooms and its own balcony, with the Diamond layout adding a third bedroom, a second balcony and a store room.',
      'Booking starts with a first down payment of Rs. 2,400,000 for a Ruby apartment. The balance is paid through a second down payment, 24 monthly installments, 4 half yearly installments and a final payment on possession, with a special discount for buyers who pay in full at the time of booking.',
      'As sponsor, Al Waheed Group supports buyers with guided visits, clear documentation and a single advisor from booking to possession. Download the payment schedules and floor plans below or book a consultation with our team.',
    ],
    amenities: [
      ['building', 'High Rise Living', 'A modern residential tower with open city views'],
      ['home', 'Three Layouts', 'Ruby, Opal and Diamond apartments'],
      ['sun', 'Private Balconies', 'Every layout includes its own balcony'],
      ['layers', 'Rooftop Terraces', 'Landscaped terraces on the upper levels'],
      ['shop', 'Commercial Frontage', 'Glass fronted shops at street level'],
      ['car', 'Dedicated Parking', 'Parking alongside the building'],
      ['tree', 'Landscaped Streets', 'Palm lined roads around the project'],
      ['wallet', '24 Month Plan', 'Monthly and half yearly installments'],
    ],
    units: [
      {
        id: 'ruby', name: 'Ruby', rooms: '4 Rooms', beds: 2, baths: 2, image: 'khairunnisa-heights/floor-plan-ruby',
        spaces: [['Drawing Room', '10′6″ × 14′0″'], ['Lounge', '10′6″ × 16′6″'], ['Master Bedroom', '10′6″ × 15′6″'], ['Bedroom', '10′6″ × 11′6″'], ['Kitchen', 'Open to the lounge'], ['Bathrooms (2)', '7′5″ × 4′0″ each'], ['Balcony', '6′10″ × 6′0″']],
        rows: [
          { label: '1st Down Payment', count: '1', amount: 2400000 },
          { label: '2nd Down Payment', count: '1', amount: 2000000 },
          { label: 'Monthly Installments', count: '24 × 325,000', amount: 7800000 },
          { label: 'Half Yearly Installments', count: '4 × 400,000', amount: 1600000 },
          { label: 'On Possession', count: '1', amount: 500000 },
        ],
        total: 14300000,
      },
      {
        id: 'opal', name: 'Opal', rooms: '4 Rooms', beds: 2, baths: 2, image: 'khairunnisa-heights/floor-plan-opal',
        spaces: [['Drawing Room', '11′0″ × 10′6″'], ['Lounge', '11′6″ × 15′0″'], ['Master Bedroom', '11′0″ × 14′4″'], ['Bedroom', '11′0″ × 11′2″'], ['Kitchen', 'Within the lounge'], ['Bathrooms (2)', '5′6″ × 8′0″ and 5′6″ × 7′6″'], ['Balcony', '6′0″ × 10′4″']],
        rows: [
          { label: '1st Down Payment', count: '1', amount: 2600000 },
          { label: '2nd Down Payment', count: '1', amount: 2000000 },
          { label: 'Monthly Installments', count: '24 × 325,000', amount: 7800000 },
          { label: 'Half Yearly Installments', count: '4 × 400,000', amount: 1600000 },
          { label: 'On Possession', count: '1', amount: 500000 },
        ],
        total: 14500000,
      },
      {
        id: 'diamond', name: 'Diamond', rooms: '5 Rooms', beds: 3, baths: 3, image: 'khairunnisa-heights/floor-plan-diamond',
        spaces: [['Drawing Room', '12′0″ × 11′0″'], ['Lounge', '10′6″ × 18′8″'], ['Master Bedroom', '12′0″ × 14′0″'], ['Bedroom', '12′0″ × 11′6″'], ['Bedroom', '11′8″ × 12′0″'], ['Kitchen', '6′6″ × 9′0″'], ['Bathrooms (3)', '5′6″ × 8′0″ and 8′0″ × 5′6″ (2)'], ['Balconies (2)', '4′0″ × 10′0″ and 10′6″ × 6′0″'], ['Store', '4′5″ × 6′0″'], ['Passage', '5′0″ wide']],
        rows: [
          { label: '1st Down Payment', count: '1', amount: 4000000 },
          { label: '2nd Down Payment', count: '1', amount: 2500000 },
          { label: 'Monthly Installments', count: '24 × 475,000', amount: 11400000 },
          { label: 'Half Yearly Installments', count: '4 × 600,000', amount: 2400000 },
          { label: 'On Possession', count: '1', amount: 700000 },
        ],
        total: 21000000,
      },
    ],
    notes: khNotes,
    gallery: [
      ['khairunnisa-heights/aerial-day', 'Aerial view of Khairunnisa Heights and its surroundings'],
      ['khairunnisa-heights/tower-day', 'Khairunnisa Heights residential tower in daylight'],
      ['khairunnisa-heights/aerial-sunset', 'Khairunnisa Heights at sunset'],
      ['khairunnisa-heights/sunset-tower', 'Khairunnisa Heights tower at dusk'],
      ['khairunnisa-heights/dusk-tower', 'Front elevation of Khairunnisa Heights at night'],
      ['khairunnisa-heights/tower-angle', 'Balconies of Khairunnisa Heights'],
    ],
    nearby: ['Main Scheme 33 Road', 'Punjabi Sodagran', 'Schools, hospitals and markets in Scheme 33'],
    faqs: [
      ['Where is Khairunnisa Heights located?', 'Khairunnisa Heights is on Main Scheme 33 Road, Punjabi Sodagran, Karachi.'],
      ['Who is developing Khairunnisa Heights?', 'Khairunnisa Heights is a project by Al Ghaffar Group and is sponsored by Al Waheed Group, which supports buyers with bookings, documentation and after sales service.'],
      ['What apartment types are available?', 'There are three layouts: Ruby and Opal with 4 rooms (2 bedrooms, drawing room and lounge) and Diamond with 5 rooms (3 bedrooms, drawing room, lounge, 2 balconies and a store).'],
      ['What is the payment plan for a Ruby apartment?', 'Rs. 2,400,000 first down payment, Rs. 2,000,000 second down payment, 24 monthly installments of Rs. 325,000, 4 half yearly installments of Rs. 400,000 and Rs. 500,000 on possession. The total is Rs. 14,300,000.'],
      ['How much are the Opal and Diamond apartments?', 'The Opal apartment totals Rs. 14,500,000 and the Diamond apartment totals Rs. 21,000,000, both on the same 24 month plan. Full schedules are on this page and in the downloadable PDF.'],
      ['Is there a discount for full payment?', 'Yes. A special discount is offered against full cash payment at the time of booking. Ask our advisors for the current discount.'],
      ['How are installments paid?', 'By cheque, pay order or demand draft in favour of the company, before the 10th of every month. Cash payments are not accepted.'],
    ],
  },
];

// Cards for projects that are not public yet. Real images get blurred until launch.
export const upcoming = [
  {
    id: 'united-sky-view',
    name: 'United Sky View',
    role: 'Al Waheed Group',
    status: 'Coming Soon',
    image: 'soon/united-sky-view',
    text: 'Details are being finalised. Register your interest for launch updates and early prices.',
  },
  {
    id: 'united-greens',
    name: 'United Greens',
    role: 'Al Waheed Group',
    status: 'Coming Soon',
    image: 'soon/united-greens',
    text: 'From the team behind United Palm Greens. Register to be the first to hear about the launch.',
  },
  {
    id: 'united-lodges',
    name: 'United Lodges',
    role: 'Al Waheed Group',
    status: 'Coming Soon',
    image: 'soon/united-lodges',
    text: 'Planning is under way. Register your interest for launch details and prices.',
  },
];

export const reasons = [
  ['document', 'Clear Documentation', 'Every booking comes with transparent paperwork and a verified ownership trail, so you always know exactly what you own.'],
  ['wallet', 'Flexible Installments', 'Low booking amounts with monthly and half yearly installments, designed around real family budgets.'],
  ['pin', 'Prime Karachi Locations', 'Projects on main roads, from the 400 ft wide road in Scheme 43 to Main Scheme 33 Road, with quick access to the rest of the city.'],
  ['layers', 'Quality Construction', 'Engineered infrastructure, planned road widths and landscaped green belts, inspected at every stage.'],
  ['award', 'Proven Dealership Record', 'Years as an authorized dealer for Al Ghafoor Builders & Developers and Falaknaz Group before building our own.'],
  ['headset', 'After Sales Support', 'One advisor stays with you from booking to possession and answers when you call.'],
];

export const chairman = {
  name: 'Abdul Waheed Meo',
  title: 'Chairman & Founder',
  initials: 'AW',
  photo: 'team/abdul-waheed-meo',
  quote: 'I started Al Waheed with a simple promise: every family that trusts us with its savings deserves honesty, clear paperwork and a home it can be proud of.',
  vision: 'To make Al Waheed one of Karachi\'s most trusted names in real estate, where every family buys with confidence.',
  message: [
    'When I founded Al Waheed Group in 2016, Karachi\'s property market was full of opportunity but short on trust. Too many families had lost their savings to unclear files and promises that were never kept. I wanted to build a company that people could rely on, one where every deal is explained in plain words and every commitment is honoured.',
    'We learned this business from the ground up. From 2022 to 2023 we worked as an authorized dealer for Al Ghafoor Builders & Developers, and since 2023 we have been an authorized dealer for Falaknaz Group. Serving families and investors through these partnerships taught us what buyers really need: fair prices, flexible installments, transparent documentation and a team that still picks up the phone after the sale.',
    'In 2026 we took the next step and launched our own development, United Palm Greens in Scheme 43, Karachi. It is a gated community planned around what our clients told us matters most: a Jamia Masjid, an education center, parks and a playground, wide roads and round the clock security, all within walking distance of home.',
    'My vision for Al Waheed Group is to become one of Karachi\'s most trusted names in real estate, known not only for what we build but for how honestly we deal. Alongside our own development we are proud to sponsor Khairunnisa Heights by Al Ghaffar Group, and we are preparing three new projects: United Sky View, United Greens and United Lodges.',
    'For me, leadership means accountability. Our doors are open, our numbers are clear and our word is our bond. To every family and investor who has trusted us, thank you. Together, we will keep building better lives.',
  ],
  bio: 'Founded Al Waheed Group in 2016. Built the group\'s reputation as an authorized dealer for Al Ghafoor Builders & Developers (2022 to 2023) and Falaknaz Group (2023 to present), and now leads its first own development, United Palm Greens.',
};

export const board = [
  { name: chairman.name, title: chairman.title, initials: chairman.initials, photo: chairman.photo, bio: chairman.bio, vision: chairman.vision },
  {
    name: 'Muhammad Saeed Meo',
    title: 'Director Operations',
    initials: 'MS',
    photo: 'team/muhammad-saeed-meo',
    bio: 'Oversees day to day operations across the group, from site execution and infrastructure quality at United Palm Greens to documentation, allocation and handover. Known for keeping projects on schedule and clients informed at every stage.',
    vision: 'Every promise we make on paper must be delivered on the ground: on time, to standard and without surprises for our clients.',
  },
  {
    name: 'Babar Majeed Meo',
    title: 'Director Sales & Marketing',
    initials: 'BM',
    photo: 'team/babar-majeed-meo',
    bio: 'Leads sales and marketing for the group, including United Marketing Group campaigns, the dealer network and client relationships. Focused on honest advice, clear payment plans and a smooth journey from first call to booking.',
    vision: 'Great real estate marketing is simply telling the truth well. Every client should feel informed, respected and confident in their decision.',
  },
];

// PLACEHOLDER testimonials. Replace with real, verified client feedback before launch.
export const testimonials = [
  { name: 'Ahmed Raza', detail: 'Overseas investor, Dubai', project: 'United Palm Greens', quote: 'I booked my plot from Dubai without flying back once. The team shared every document on WhatsApp, took my calls late at night and the installment schedule has been exactly as promised.' },
  { name: 'Sana Tariq', detail: 'Homeowner, Karachi', project: 'United Palm Greens', quote: 'We wanted a gated community where our children could play safely. The site visit was well organised and nobody pushed us. We are very happy with our decision.' },
  { name: 'Bilal Hussain', detail: 'Business owner, Karachi', project: 'Commercial plot booking', quote: 'I bought a commercial plot near the entrance. The advisor explained the payment plan clearly, showed me the exact position on the layout plan and followed up at every step.' },
  { name: 'Rubina Aslam', detail: 'Retired teacher, Hyderabad', project: 'Plot booking through Al Waheed', quote: 'As a first time buyer I had many questions. Al Waheed answered all of them patiently and helped my son and me choose a plot within our budget.' },
  { name: 'Usman Sheikh', detail: 'Software engineer, Toronto', project: 'Falaknaz booking through Al Waheed', quote: 'Transparent pricing, quick replies and a proper video tour of the site. It is rare to find this level of professionalism in Pakistani real estate.' },
];

export const homeFaqs = [
  ['Where are Al Waheed Group projects located?', 'United Palm Greens is on the Main 400 ft Wide Road in Scheme 43, Karachi, beside Silk Garden by Naya Nazimabad. Khairunnisa Heights, which we sponsor, is on Main Scheme 33 Road, Punjabi Sodagran, Karachi.'],
  ['What apartments are available at Khairunnisa Heights?', 'Khairunnisa Heights offers Ruby and Opal 4 room apartments and Diamond 5 room apartments, on a plan of two down payments, 24 monthly and 4 half yearly installments and a payment on possession.'],
  ['What is the payment plan for United Palm Greens?', 'Booking starts from Rs. 600,000, and the balance is paid in easy monthly and half yearly installments. You can view and download the full payment schedule on the project page.'],
  ['Can overseas Pakistanis book a plot remotely?', 'Yes. We handle the full booking remotely, with virtual site tours, digital documentation and an advisor available on WhatsApp across time zones.'],
  ['What plot sizes are available?', 'United Palm Greens offers residential plots of 120, 400 and 2,000 square yards, plus commercial plots at the entrance.'],
  ['How do I book a site visit?', 'Book a free consultation through this website, call us or send a WhatsApp message. Our team will arrange a guided site visit at a time that suits you.'],
  ['Is Al Waheed Group an authorized dealer?', 'Yes. Al Waheed Group was an authorized dealer for Al Ghafoor Builders & Developers from 2022 to 2023 and has been an authorized dealer for Falaknaz Group since 2023.'],
];

export const milestones = [
  ['2016', 'Al Waheed Group Founded', 'Abdul Waheed Meo founds the group in Karachi with a promise of honest, transparent real estate.'],
  ['2022', 'Al Ghafoor Builders & Developers', 'Al Waheed becomes an authorized dealer for Al Ghafoor Builders & Developers, until 2023.'],
  ['2023', 'Falaknaz Group', 'Authorized dealership with Falaknaz Group begins and continues today.'],
  ['2026', 'United Palm Greens', 'Launch of the group\'s first own development in Scheme 43, Karachi.'],
  ['Now', 'Khairunnisa Heights', 'Al Waheed Group sponsors Khairunnisa Heights, a high rise apartment project by Al Ghaffar Group.'],
  ['Next', 'Three New Projects', 'United Sky View, United Greens and United Lodges are in the pipeline.'],
];

export const values = [
  ['Integrity', 'We say what we will do, and we do what we say.'],
  ['Transparency', 'Clear prices, clear paperwork and honest answers.'],
  ['Quality', 'Infrastructure and construction built to last for generations.'],
  ['Community', 'We plan neighbourhoods, not just plots.'],
];

// PLACEHOLDER jobs. Remove or replace before launch.
export const jobs = [
  { title: 'Real Estate Sales Executive', dept: 'Sales', location: 'Karachi', type: 'Full time', employmentType: 'FULL_TIME', summary: 'Guide families and investors through our projects, arrange site visits and manage clients from first call to booking.', points: ['1 to 3 years of sales experience, real estate preferred', 'Confident communication in Urdu and English', 'Own transport is a plus'] },
  { title: 'Site Engineer (Civil)', dept: 'Projects', location: 'Scheme 43, Karachi', type: 'Full time', employmentType: 'FULL_TIME', summary: 'Supervise roads, utilities and building works at United Palm Greens, ensuring quality, safety and timelines.', points: ['BE Civil with 2 or more years of site experience', 'Registered with Pakistan Engineering Council', 'Strong knowledge of infrastructure works'] },
  { title: 'Digital Marketing Executive', dept: 'Marketing', location: 'Karachi', type: 'Full time', employmentType: 'FULL_TIME', summary: 'Plan and run social media, search and lead generation campaigns for group projects.', points: ['Hands on experience with Meta and Google Ads', 'Content planning and basic design skills', 'Real estate campaign experience is a plus'] },
  { title: 'Customer Relationship Officer', dept: 'After Sales', location: 'Karachi', type: 'Full time', employmentType: 'FULL_TIME', summary: 'Support existing clients with installments, documents and updates, including our overseas clients.', points: ['Excellent phone and WhatsApp etiquette', 'Organised, patient and detail oriented', 'Comfortable with evening shifts for overseas clients'] },
];

export const perks = [
  ['trend', 'Growth Paths', 'Clear promotion tracks across our affiliated groups.'],
  ['award', 'Performance Rewards', 'Competitive salaries with attractive commissions and bonuses.'],
  ['users', 'Supportive Team', 'Experienced mentors in sales, engineering and finance.'],
  ['headset', 'Training', 'Regular training on sales, compliance and customer care.'],
];
