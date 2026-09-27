// ============================================================
// KaamSetu — Full App (React 18 + Tailwind CSS)
// ============================================================

const { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } = React;

// ─── Lucide icon helper ──────────────────────────────────────
function Icon({ name, size = 20, className = '', strokeWidth = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      el.style.display = 'inline-flex';
      ref.current.appendChild(el);
      window.lucide.createIcons({ elements: [el] });
      const svg = ref.current.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('stroke-width', strokeWidth);
        svg.style.display = 'block';
      }
    }
  }, [name, size, strokeWidth]);
  return <span ref={ref} className={`inline-flex items-center justify-center ${className}`} aria-hidden="true" />;
}

// ─── App Context ─────────────────────────────────────────────
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

// ─── Mock Data ───────────────────────────────────────────────
const WORKERS = [
  {
    id: 1, name: 'Ravi Kumar', photoUrl: null, initials: 'RK', color: '#0d9488',
    skillCategory: 'Electrician', skills: ['Wiring', 'Fan Repair', 'Appliance Repair', 'MCB Fixing'],
    bio: 'Certified electrician with 8+ years of experience across residential and commercial projects in Delhi. Safety-first approach, clean work guaranteed.',
    city: 'Delhi', locality: 'Saket', distanceKm: 1.2,
    hourlyRate: 350, currency: 'INR',
    rating: 4.9, reviewCount: 126, completedJobs: 540,
    verified: true, verifiedSince: 'Jan 2023',
    responseTimeMins: 15,
    availability: {
      days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
      slots: ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','3:00 PM','4:00 PM','5:00 PM']
    },
    bookedSlots: ['10:00 AM','3:00 PM'],
    portfolioPhotos: ['panel', 'wiring', 'lights'],
    reviews: [
      { reviewerName: 'Anjali Sharma', initials: 'AS', rating: 5, comment: 'Fixed our entire kitchen wiring in 3 hours. Extremely professional and tidy. Will definitely book again!', date: '12 Sep 2026' },
      { reviewerName: 'Rohit Verma', initials: 'RV', rating: 5, comment: 'Repaired the MCB panel and explained everything clearly. Very fair pricing.', date: '3 Sep 2026' },
      { reviewerName: 'Priya Nair', initials: 'PN', rating: 4, comment: 'Good work overall. Came on time and fixed the issue quickly.', date: '28 Aug 2026' },
    ]
  },
  {
    id: 2, name: 'Imran Khan', photoUrl: null, initials: 'IK', color: '#7c3aed',
    skillCategory: 'Plumber', skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Fittings', 'Drainage'],
    bio: 'Expert plumber specializing in leak detection and modern bathroom fittings. Available for same-day emergency calls across Dwarka.',
    city: 'Delhi', locality: 'Dwarka', distanceKm: 3.1,
    hourlyRate: 300, currency: 'INR',
    rating: 4.7, reviewCount: 89, completedJobs: 310,
    verified: true, verifiedSince: 'Mar 2023',
    responseTimeMins: 20,
    availability: {
      days: ['Mon','Tue','Thu','Fri','Sat','Sun'],
      slots: ['8:00 AM','9:00 AM','11:00 AM','2:00 PM','4:00 PM','6:00 PM']
    },
    bookedSlots: ['9:00 AM','2:00 PM','6:00 PM'],
    portfolioPhotos: ['pipe', 'bathroom', 'drainage'],
    reviews: [
      { reviewerName: 'Sneha Gupta', initials: 'SG', rating: 5, comment: 'Fixed a major kitchen pipe leak in under an hour. Emergency response was amazing!', date: '10 Sep 2026' },
      { reviewerName: 'Amit Malhotra', initials: 'AM', rating: 4, comment: 'Good quality work on our bathroom renovation. Knowledgeable and honest.', date: '1 Sep 2026' },
    ]
  },
  {
    id: 3, name: 'Meena Devi', photoUrl: null, initials: 'MD', color: '#db2777',
    skillCategory: 'Tailor', skills: ['Blouse Design', 'Alterations', 'Stitching', 'Embroidery', 'Lehengas'],
    bio: 'Master tailor with 15 years of expertise in traditional and contemporary Indian wear. Specializes in bridal blouses and heavy embroidery work.',
    city: 'Delhi', locality: 'Rohini', distanceKm: 2.4,
    hourlyRate: 250, currency: 'INR',
    rating: 4.8, reviewCount: 203, completedJobs: 880,
    verified: true, verifiedSince: 'Jun 2022',
    responseTimeMins: 30,
    availability: {
      days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
      slots: ['10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM']
    },
    bookedSlots: ['11:00 AM','2:00 PM'],
    portfolioPhotos: ['blouse', 'lehenga', 'embroidery'],
    reviews: [
      { reviewerName: 'Kavita Singh', initials: 'KS', rating: 5, comment: 'Absolutely stunning bridal blouse — got countless compliments at the wedding!', date: '15 Sep 2026' },
      { reviewerName: 'Rekha Joshi', initials: 'RJ', rating: 5, comment: 'Perfect alterations on my saree blouse. Quick turnaround too.', date: '8 Sep 2026' },
      { reviewerName: 'Sunita Sharma', initials: 'SS', rating: 5, comment: 'The embroidery work on my kurta was exquisite. Truly talented!', date: '2 Sep 2026' },
    ]
  },
  {
    id: 4, name: 'Suresh Pandey', photoUrl: null, initials: 'SP', color: '#ea580c',
    skillCategory: 'Carpenter', skills: ['Furniture Repair', 'Cabinet Making', 'Door Fitting', 'Custom Woodwork'],
    bio: 'Skilled carpenter offering bespoke furniture and expert repairs. From kitchen cabinets to complete room makeovers — quality that lasts.',
    city: 'Delhi', locality: 'Saket', distanceKm: 0.8,
    hourlyRate: 400, currency: 'INR',
    rating: 4.6, reviewCount: 67, completedJobs: 215,
    verified: true, verifiedSince: 'Nov 2023',
    responseTimeMins: 45,
    availability: {
      days: ['Mon','Wed','Thu','Fri','Sat'],
      slots: ['9:00 AM','10:00 AM','2:00 PM','3:00 PM','4:00 PM']
    },
    bookedSlots: ['9:00 AM'],
    portfolioPhotos: ['cabinet', 'furniture', 'door'],
    reviews: [
      { reviewerName: 'Rajesh Kumar', initials: 'RK', rating: 5, comment: 'Built a beautiful wardrobe that fits perfectly in our small room. Great attention to detail!', date: '11 Sep 2026' },
      { reviewerName: 'Anita Bose', initials: 'AB', rating: 4, comment: 'Fixed all the wobbly furniture in our office. Quick and professional.', date: '5 Sep 2026' },
    ]
  },
  {
    id: 5, name: 'Pooja Batra', photoUrl: null, initials: 'PB', color: '#9333ea',
    skillCategory: 'Beautician', skills: ['Makeup', 'Facial', 'Threading', 'Waxing', 'Hair Styling', 'Bridal Makeup'],
    bio: 'Certified makeup artist and beautician bringing salon-quality services to your home. Specializes in bridal and party looks for all occasions.',
    city: 'Delhi', locality: 'Dwarka', distanceKm: 4.2,
    hourlyRate: 600, currency: 'INR',
    rating: 4.9, reviewCount: 312, completedJobs: 1200,
    verified: true, verifiedSince: 'Apr 2022',
    responseTimeMins: 10,
    availability: {
      days: ['Tue','Wed','Thu','Fri','Sat','Sun'],
      slots: ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','4:00 PM','5:00 PM']
    },
    bookedSlots: ['9:00 AM','1:00 PM','5:00 PM'],
    portfolioPhotos: ['makeup1', 'makeup2', 'bridal'],
    reviews: [
      { reviewerName: 'Nisha Kapoor', initials: 'NK', rating: 5, comment: 'Made me look absolutely stunning for my wedding! Pooja is incredibly talented.', date: '18 Sep 2026' },
      { reviewerName: 'Deepika Mehta', initials: 'DM', rating: 5, comment: 'Best home facial I\'ve ever had. My skin felt amazing for days after.', date: '14 Sep 2026' },
      { reviewerName: 'Ritu Agarwal', initials: 'RA', rating: 5, comment: 'Party makeup was on point! Many guests asked for her number.', date: '9 Sep 2026' },
    ]
  },
  {
    id: 6, name: 'Vijay Sharma', photoUrl: null, initials: 'VS', color: '#0369a1',
    skillCategory: 'Tutor', skills: ['Mathematics', 'Physics', 'Chemistry', 'JEE Prep', 'Class 10-12'],
    bio: 'IIT Delhi graduate with 6 years of tutoring experience. Helped 200+ students crack JEE and board exams with a structured, concept-first approach.',
    city: 'Delhi', locality: 'Rohini', distanceKm: 3.8,
    hourlyRate: 500, currency: 'INR',
    rating: 4.8, reviewCount: 94, completedJobs: 3200,
    verified: true, verifiedSince: 'Feb 2023',
    responseTimeMins: 60,
    availability: {
      days: ['Mon','Tue','Wed','Thu','Fri'],
      slots: ['7:00 AM','8:00 AM','5:00 PM','6:00 PM','7:00 PM','8:00 PM']
    },
    bookedSlots: ['7:00 AM','6:00 PM','8:00 PM'],
    portfolioPhotos: ['board', 'class', 'results'],
    reviews: [
      { reviewerName: 'Arjun Malhotra', initials: 'AM', rating: 5, comment: 'My son\'s physics marks jumped from 60% to 92% in 4 months. Absolutely incredible!', date: '16 Sep 2026' },
      { reviewerName: 'Sanjay Gupta', initials: 'SG', rating: 5, comment: 'Clear explanations, lots of practice problems. My daughter got into IIT this year!', date: '10 Sep 2026' },
    ]
  },
  {
    id: 7, name: 'Lakshmi Reddy', photoUrl: null, initials: 'LR', color: '#15803d',
    skillCategory: 'Cook', skills: ['South Indian', 'North Indian', 'Tiffin Service', 'Party Catering', 'Healthy Meals'],
    bio: 'Home chef offering authentic South Indian and Punjabi meals. Trained in hygienic food prep, perfect for daily tiffin services or special occasions.',
    city: 'Delhi', locality: 'Saket', distanceKm: 2.1,
    hourlyRate: 400, currency: 'INR',
    rating: 4.7, reviewCount: 58, completedJobs: 420,
    verified: true, verifiedSince: 'Aug 2023',
    responseTimeMins: 30,
    availability: {
      days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      slots: ['7:00 AM','8:00 AM','12:00 PM','1:00 PM','6:00 PM','7:00 PM']
    },
    bookedSlots: ['7:00 AM','12:00 PM'],
    portfolioPhotos: ['thali', 'dosa', 'catering'],
    reviews: [
      { reviewerName: 'Priya Menon', initials: 'PM', rating: 5, comment: 'The best home-cooked food in South Delhi! Dal makhani and idlis are to die for.', date: '20 Sep 2026' },
      { reviewerName: 'Arun Kapoor', initials: 'AK', rating: 4, comment: 'Excellent tiffin service. Always on time and food is fresh and healthy.', date: '12 Sep 2026' },
    ]
  },
  {
    id: 8, name: 'Rahul Sethi', photoUrl: null, initials: 'RS', color: '#1d4ed8',
    skillCategory: 'Cleaner', skills: ['Deep Cleaning', 'Sofa Cleaning', 'Kitchen Cleaning', 'Post-Construction', 'Office Cleaning'],
    bio: 'Professional cleaning specialist with trained staff and eco-friendly products. Deep cleaning that reaches every corner — homes and offices across Delhi.',
    city: 'Delhi', locality: 'Dwarka', distanceKm: 5.7,
    hourlyRate: 280, currency: 'INR',
    rating: 4.5, reviewCount: 41, completedJobs: 180,
    verified: true, verifiedSince: 'Jan 2024',
    responseTimeMins: 90,
    availability: {
      days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
      slots: ['8:00 AM','9:00 AM','10:00 AM','1:00 PM','2:00 PM']
    },
    bookedSlots: ['8:00 AM','1:00 PM'],
    portfolioPhotos: ['kitchen', 'sofa', 'bathroom'],
    reviews: [
      { reviewerName: 'Vikram Singh', initials: 'VS', rating: 5, comment: 'Made my kitchen spotless after a messy renovation. Highly recommended!', date: '17 Sep 2026' },
      { reviewerName: 'Geeta Sharma', initials: 'GS', rating: 4, comment: 'Thorough cleaning job. Sofa looks brand new!', date: '8 Sep 2026' },
    ]
  },
  {
    id: 9, name: 'Aisha Qureshi', photoUrl: null, initials: 'AQ', color: '#be185d',
    skillCategory: 'Beautician', skills: ['Mehendi', 'Nail Art', 'Eyebrow Shaping', 'Pedicure', 'Manicure'],
    bio: 'Specialist in intricate mehendi designs and nail art. Bridal and festive bookings available with custom design consultations.',
    city: 'Delhi', locality: 'Rohini', distanceKm: 6.3,
    hourlyRate: 450, currency: 'INR',
    rating: 4.6, reviewCount: 77, completedJobs: 340,
    verified: false, verifiedSince: null,
    responseTimeMins: 45,
    availability: {
      days: ['Wed','Thu','Fri','Sat','Sun'],
      slots: ['10:00 AM','11:00 AM','1:00 PM','3:00 PM','4:00 PM','5:00 PM']
    },
    bookedSlots: ['10:00 AM','3:00 PM'],
    portfolioPhotos: ['mehendi1', 'mehendi2', 'nails'],
    reviews: [
      { reviewerName: 'Fatima Ahmed', initials: 'FA', rating: 5, comment: 'The most beautiful bridal mehendi! Everyone kept complimenting me throughout the wedding.', date: '5 Sep 2026' },
      { reviewerName: 'Zara Khan', initials: 'ZK', rating: 4, comment: 'Lovely nail art designs and very professional service.', date: '28 Aug 2026' },
    ]
  },
  {
    id: 10, name: 'Dev Prakash', photoUrl: null, initials: 'DP', color: '#b45309',
    skillCategory: 'Carpenter', skills: ['POP Work', 'False Ceiling', 'Partition Work', 'Modular Kitchen'],
    bio: 'Interior fit-out specialist with expertise in false ceilings, partitions, and modular kitchen installation. 10 years across premium residential projects.',
    city: 'Delhi', locality: 'Saket', distanceKm: 1.5,
    hourlyRate: 550, currency: 'INR',
    rating: 3.8, reviewCount: 22, completedJobs: 78,
    verified: false, verifiedSince: null,
    responseTimeMins: 120,
    availability: {
      days: ['Mon','Tue','Wed','Fri','Sat'],
      slots: ['9:00 AM','10:00 AM','11:00 AM','3:00 PM','4:00 PM']
    },
    bookedSlots: ['9:00 AM','10:00 AM','11:00 AM','3:00 PM','4:00 PM'],
    portfolioPhotos: ['ceiling', 'partition', 'kitchen'],
    reviews: [
      { reviewerName: 'Manish Kapoor', initials: 'MK', rating: 4, comment: 'Good false ceiling work. Took slightly longer than estimated but quality is fine.', date: '6 Sep 2026' },
      { reviewerName: 'Seema Yadav', initials: 'SY', rating: 3, comment: 'Work was okay but communication could be better.', date: '25 Aug 2026' },
    ]
  },
  {
    id: 11, name: 'Nandita Arora', photoUrl: null, initials: 'NA', color: '#0891b2',
    skillCategory: 'Tutor', skills: ['English', 'Hindi', 'Social Studies', 'Class 6-10', 'Spoken English'],
    bio: 'Passionate teacher specializing in language arts and communication skills. Patience and creativity at the core of every lesson.',
    city: 'Delhi', locality: 'Dwarka', distanceKm: 4.8,
    hourlyRate: 300, currency: 'INR',
    rating: 4.4, reviewCount: 36, completedJobs: 890,
    verified: true, verifiedSince: 'Oct 2023',
    responseTimeMins: 30,
    availability: {
      days: ['Mon','Tue','Wed','Thu','Fri'],
      slots: ['9:00 AM','10:00 AM','4:00 PM','5:00 PM','6:00 PM']
    },
    bookedSlots: ['9:00 AM','5:00 PM'],
    portfolioPhotos: ['class1', 'class2', 'books'],
    reviews: [
      { reviewerName: 'Mohit Gupta', initials: 'MG', rating: 5, comment: 'My daughter\'s English speaking confidence has improved tremendously. Excellent teacher!', date: '13 Sep 2026' },
    ]
  },
  {
    id: 12, name: 'Ganesh Murugan', photoUrl: null, initials: 'GM', color: '#16a34a',
    skillCategory: 'Cleaner', skills: ['Carpet Cleaning', 'Terrace Cleaning', 'Tank Cleaning', 'Pest Control'],
    bio: 'Specialized cleaning services including water tank sanitization, terrace clearing, and pest control — services most cleaners won\'t handle.',
    city: 'Delhi', locality: 'Rohini', distanceKm: 7.2,
    hourlyRate: 350, currency: 'INR',
    rating: 4.3, reviewCount: 19, completedJobs: 95,
    verified: false, verifiedSince: null,
    responseTimeMins: 180,
    availability: {
      days: ['Tue','Wed','Sat','Sun'],
      slots: ['8:00 AM','10:00 AM','1:00 PM','3:00 PM']
    },
    bookedSlots: [],
    portfolioPhotos: ['carpet', 'tank', 'pest'],
    reviews: []
  },
];

const CATEGORIES = ['All', 'Electrician', 'Plumber', 'Tailor', 'Carpenter', 'Beautician', 'Tutor', 'Cook', 'Cleaner'];
const LOCALITIES = ['All Areas', 'Saket', 'Dwarka', 'Rohini'];
const SORT_OPTIONS = [
  { value: 'trust', label: 'Trust + Distance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const STATS = [
  { value: '500+', label: 'Verified providers' },
  { value: '4.8', label: 'Average rating' },
  { value: '12', label: 'Cities live' },
  { value: '98%', label: 'Repeat customers' },
];

const HOW_IT_WORKS = [
  { step: 1, icon: 'search', title: 'Search nearby', desc: 'Enter your skill need and neighbourhood. We surface verified providers closest to you.' },
  { step: 2, icon: 'scale', title: 'Compare trust & price', desc: 'See verified identity, skill certificates, transparent hourly rates, and real customer reviews — all in one place.' },
  { step: 3, icon: 'calendar-check', title: 'Book instantly', desc: 'Pick a time slot that works for you. Free cancellation up to 2 hours before your booking.' },
];

// ─── Utility functions ───────────────────────────────────────
function formatINR(n) { return `₹${n.toLocaleString('en-IN')}`; }
function formatRating(r) { return r.toFixed(1); }
function trustScore(w) { return w.rating * 0.6 + (1 / w.distanceKm) * 2 + (w.verified ? 1 : 0); }
function sortWorkers(workers, sort) {
  const arr = [...workers];
  if (sort === 'price_asc') return arr.sort((a, b) => a.hourlyRate - b.hourlyRate);
  if (sort === 'price_desc') return arr.sort((a, b) => b.hourlyRate - a.hourlyRate);
  if (sort === 'rating') return arr.sort((a, b) => b.rating - a.rating);
  return arr.sort((a, b) => trustScore(b) - trustScore(a));
}

// ─── Stars component ─────────────────────────────────────────
function Stars({ rating, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

// ─── Avatar ──────────────────────────────────────────────────
function Avatar({ worker, size = 'md', className = '' }) {
  const s = { sm: 'w-10 h-10 text-sm', md: 'w-14 h-14 text-lg', lg: 'w-24 h-24 text-3xl', xl: 'w-32 h-32 text-4xl' }[size];
  return (
    <div
      className={`${s} rounded-2xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0 ${className}`}
      style={{ background: `linear-gradient(135deg, ${worker.color}cc, ${worker.color})` }}
      aria-label={`Profile photo of ${worker.name}`}
    >
      {worker.initials}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────
function Badge({ type, small }) {
  if (type === 'verified') return (
    <span className={`inline-flex items-center gap-1 badge-verified rounded-full font-semibold ${small ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
      <Icon name="shield-check" size={12} /> Verified
    </span>
  );
  if (type === 'pending') return (
    <span className={`inline-flex items-center gap-1 badge-pending rounded-full font-semibold ${small ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
      <Icon name="clock" size={12} /> Verification pending
    </span>
  );
  if (type === 'top') return (
    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-xs px-2.5 py-1 font-semibold">
      <Icon name="trophy" size={12} /> Top Rated
    </span>
  );
  if (type === 'fast') return (
    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs px-2.5 py-1 font-semibold">
      <Icon name="zap" size={12} /> Fast responder
    </span>
  );
  return null;
}

// ─── Button ──────────────────────────────────────────────────
function Btn({ variant = 'primary', size = 'md', children, className = '', loading, disabled, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 select-none';
  const variants = {
    primary: 'bg-teal-700 hover:bg-teal-600 active:bg-teal-800 text-white shadow-md hover:shadow-lg disabled:opacity-50',
    secondary: 'border-2 border-teal-700 text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 dark:text-teal-400 dark:border-teal-500 disabled:opacity-50',
    ghost: 'text-gray-600 hover:text-teal-700 hover:bg-teal-50 dark:text-gray-400 dark:hover:bg-teal-900/20 disabled:opacity-50',
    amber: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow-md hover:shadow-lg disabled:opacity-50',
    danger: 'bg-red-600 hover:bg-red-500 text-white disabled:opacity-50',
  };
  const sizes = {
    xs: 'text-xs px-3 py-1.5',
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3',
    xl: 'text-lg px-8 py-4',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
      {children}
    </button>
  );
}

// ─── Skeleton ────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex gap-4 mb-4">
        <div className="skeleton w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 rounded-lg w-3/4" />
          <div className="skeleton h-3 rounded-lg w-1/2" />
          <div className="skeleton h-3 rounded-lg w-2/3" />
        </div>
      </div>
      <div className="skeleton h-3 rounded-lg w-full mb-2" />
      <div className="skeleton h-3 rounded-lg w-4/5 mb-4" />
      <div className="flex gap-2">
        <div className="skeleton h-8 rounded-lg flex-1" />
        <div className="skeleton h-8 rounded-lg flex-1" />
      </div>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 pointer-events-none" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl max-w-sm toast-enter
            ${t.type === 'success' ? 'bg-green-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'}`}
          role="alert"
        >
          <Icon name={t.type === 'success' ? 'check-circle' : t.type === 'error' ? 'x-circle' : 'info'} size={18} className="flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="flex-shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss notification">
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────
function Header() {
  const { page, setPage, darkMode, setDarkMode } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-md border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'}`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => setPage('home')} className="flex items-center gap-2 font-heading font-bold text-xl group" aria-label="KaamSetu home">
          <span className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
            <Icon name="wrench" size={16} />
          </span>
          <span className={`${page === 'home' && !scrolled ? 'text-white' : 'text-gray-900 dark:text-white'} transition-colors`}>KaamSetu</span>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {[
            { label: 'How it works', target: 'how-it-works' },
            { label: 'Browse services', page: 'search' },
            { label: 'Become a provider', page: 'onboarding' },
          ].map(n => (
            <button key={n.label}
              className={`nav-link text-sm font-medium transition-colors
                ${page === 'home' && !scrolled ? 'text-teal-100 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400'}`}
              onClick={() => {
                if (n.page) setPage(n.page);
                else if (n.target) {
                  setPage('home');
                  setTimeout(() => document.getElementById(n.target)?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(d => !d)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
              ${page === 'home' && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={darkMode ? 'sun' : 'moon'} size={18} />
          </button>
          <Btn variant="secondary" size="sm"
            className={`hidden md:inline-flex ${page === 'home' && !scrolled ? 'border-white/60 text-white hover:bg-white/10 dark:border-white/60 dark:text-white' : ''}`}
            onClick={() => {}} aria-label="Sign in (demo)">
            Sign in
          </Btn>
          <Btn variant="amber" size="sm" className="hidden md:inline-flex" onClick={() => setPage('onboarding')}>
            Join as provider
          </Btn>
          <button className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center" onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
            <Icon name={mobileOpen ? 'x' : 'menu'} size={20} className={page === 'home' && !scrolled ? 'text-white' : ''} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-2 animate-fade-in">
          {['Browse services','Become a provider'].map(l => (
            <button key={l} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => { setPage(l === 'Browse services' ? 'search' : 'onboarding'); setMobileOpen(false); }}>
              {l}
            </button>
          ))}
          <div className="pt-2 flex gap-2">
            <Btn variant="secondary" size="sm" className="flex-1" onClick={() => setMobileOpen(false)}>Sign in</Btn>
            <Btn variant="amber" size="sm" className="flex-1" onClick={() => { setPage('onboarding'); setMobileOpen(false); }}>Join as provider</Btn>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero / SearchBar ─────────────────────────────────────────
function Hero() {
  const { setPage, setSearchQuery, setSearchFilters } = useApp();
  const [query, setQuery] = useState('');
  const [locality, setLocality] = useState('');

  const handleSearch = () => {
    setSearchQuery(query);
    if (locality && locality !== 'All Areas') setSearchFilters(f => ({ ...f, locality }));
    setPage('search');
  };

  return (
    <section
      className="hero-section relative overflow-hidden"
      aria-label="Hero section"
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" aria-hidden="true" />
      <div className="absolute top-24 -left-12 w-40 h-40 bg-amber-400/10 rounded-full" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-teal-300/10 rounded-full" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/90 rounded-full px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
            Now live in Delhi, Mumbai & Bangalore
          </div>

          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight mb-4 page-enter">
            Local skills.<br />
            <span className="text-amber-400">Trusted nearby.</span>
          </h1>

          <p className="text-teal-100/90 text-lg md:text-xl leading-relaxed mb-10 page-enter stagger-1">
            Discover skilled people in your city. Compare their verified reputation,<br className="hidden md:block" />
            transparent pricing, and real reviews — then book in seconds.
          </p>

          {/* Search bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 page-enter stagger-2" role="search" aria-label="Search for local services">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700">
              <Icon name="search" size={18} className="text-teal-700 dark:text-teal-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search electrician, tutor, tailor..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm font-medium outline-none"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                aria-label="Search for a service"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 sm:w-44">
              <Icon name="map-pin" size={18} className="text-teal-700 dark:text-teal-400 flex-shrink-0" />
              <select
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm font-medium outline-none cursor-pointer"
                value={locality}
                onChange={e => setLocality(e.target.value)}
                aria-label="Select locality"
              >
                <option value="">Locality</option>
                {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <Btn variant="amber" size="lg" onClick={handleSearch} className="sm:px-8">
              <Icon name="search" size={16} /> Search
            </Btn>
          </div>

          <p className="mt-4 text-teal-100/70 text-sm page-enter stagger-3">
            Popular: <button className="underline hover:text-white transition-colors" onClick={() => { setSearchQuery('Electrician'); setPage('search'); }}>Electrician</button>
            {' · '}<button className="underline hover:text-white transition-colors" onClick={() => { setSearchQuery('Plumber'); setPage('search'); }}>Plumber</button>
            {' · '}<button className="underline hover:text-white transition-colors" onClick={() => { setSearchQuery('Tutor'); setPage('search'); }}>Tutor</button>
            {' · '}<button className="underline hover:text-white transition-colors" onClick={() => { setSearchQuery('Beautician'); setPage('search'); }}>Beautician</button>
          </p>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-full fill-gray-50 dark:fill-gray-950">
          <path d="M0,40 C300,80 900,0 1200,40 L1200,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}

// ─── Trust Strip ─────────────────────────────────────────────
function TrustStrip() {
  const items = [
    { icon: 'shield-check', title: 'Verified identity & skills', desc: 'Every provider passes background and skill verification before going live.' },
    { icon: 'indian-rupee', title: 'Transparent pricing', desc: 'Fixed hourly rates, no hidden charges. You see the full cost before you confirm.' },
    { icon: 'map-pin', title: 'Local-first', desc: 'Providers within your neighbourhood, not hired labour from across the city.' },
  ];
  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-950" aria-label="Our commitments">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={item.title}
              className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-start gap-4 shadow-sm page-enter stagger-${i+1}`}>
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon} size={20} className="text-teal-700 dark:text-teal-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-950" aria-labelledby="how-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 id="how-heading" className="font-heading font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-3">
            Book a service in 3 steps
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            From search to confirmation in under 2 minutes. No phone calls, no haggling.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className={`relative page-enter stagger-${i+1}`}>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 z-0" aria-hidden="true">
                  <div className="w-full border-t-2 border-dashed border-teal-200 dark:border-teal-800" />
                </div>
              )}
              <div className="relative z-10 text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-teal-700 flex items-center justify-center shadow-lg shadow-teal-700/25">
                    <Icon name={step.icon} size={28} className="text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Worker Card ─────────────────────────────────────────────
function WorkerCard({ worker, onView, onBook, index = 0 }) {
  const isFullyBooked = worker.bookedSlots.length >= worker.availability.slots.length;
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm card-hover page-enter flex flex-col`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Top row */}
      <div className="flex gap-4 mb-3">
        <Avatar worker={worker} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">{worker.name}</h3>
              <p className="text-teal-700 dark:text-teal-400 text-xs font-medium">{worker.skillCategory}</p>
            </div>
            {worker.verified ? <Badge type="verified" small /> : <Badge type="pending" small />}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Stars rating={worker.rating} size={12} />
            <span className="text-gray-500 dark:text-gray-400 text-xs tabular-nums">{formatRating(worker.rating)} ({worker.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-gray-400 dark:text-gray-500 text-xs">
            <Icon name="map-pin" size={11} />
            <span>{worker.locality} · {worker.distanceKm} km away</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">{worker.bio}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {worker.skills.slice(0, 3).map(s => (
          <span key={s} className="bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-full text-xs px-2 py-0.5 font-medium">{s}</span>
        ))}
        {worker.skills.length > 3 && <span className="text-gray-400 text-xs py-0.5">+{worker.skills.length - 3}</span>}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 dark:border-gray-700/50">
        <div>
          <span className="font-bold text-gray-900 dark:text-white tabular-nums">{formatINR(worker.hourlyRate)}</span>
          <span className="text-gray-400 dark:text-gray-500 text-xs">/hr</span>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="xs" onClick={() => onView(worker)}>Profile</Btn>
          {isFullyBooked ? (
            <Btn variant="ghost" size="xs" disabled>Fully booked</Btn>
          ) : !worker.verified ? (
            <Btn variant="ghost" size="xs" disabled title="This provider is awaiting skill verification">Pending review</Btn>
          ) : (
            <Btn variant="primary" size="xs" onClick={() => onBook(worker)}>Book</Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Recommended Section ──────────────────────────────────────
function Recommended() {
  const { setPage, setSelectedWorker, setBookingWorker } = useApp();
  const top = useMemo(() => sortWorkers(WORKERS.filter(w => w.verified), 'trust').slice(0, 6), []);
  return (
    <section className="py-16 bg-white dark:bg-gray-900" aria-labelledby="rec-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 id="rec-heading" className="font-heading font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">Recommended near you</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sorted by trust score and distance</p>
          </div>
          <Btn variant="ghost" size="sm" onClick={() => setPage('search')}>
            View all <Icon name="arrow-right" size={14} />
          </Btn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {top.map((w, i) => (
            <WorkerCard key={w.id} worker={w} index={i}
              onView={w => { setSelectedWorker(w); setPage('profile'); }}
              onBook={w => setBookingWorker(w)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Strip ─────────────────────────────────────────────
function StatsStrip() {
  return (
    <section className="stats-section py-12" aria-label="Platform statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center page-enter stagger-${i+1}`}>
              <div className="font-heading font-bold text-3xl md:text-4xl text-white tabular-nums">{s.value}</div>
              <div className="text-teal-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Different ───────────────────────────────────────────
function WhyDifferent() {
  const { setPage } = useApp();
  const points = [
    { icon: 'award', title: 'Reputation you own', desc: 'Workers build a verified digital profile they carry forever — not trapped in one platform\'s walled garden.' },
    { icon: 'star', title: 'Reviews that travel with you', desc: 'A cleaner who excelled on one job has proof of that for every future client, anywhere on KaamSetu.' },
    { icon: 'receipt', title: 'No listing or commission fees', desc: 'We charge a flat booking fee — not a cut of every job. Workers earn more, customers pay less.' },
    { icon: 'users', title: 'Community-verified skills', desc: 'Peer verification and customer reviews together create a trust score no fake profile can game.' },
  ];
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950" aria-labelledby="why-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-teal-700 dark:text-teal-400 font-semibold text-sm uppercase tracking-wider mb-3">Why KaamSetu</span>
            <h2 id="why-heading" className="font-heading font-bold text-3xl md:text-4xl text-gray-900 dark:text-white leading-tight mb-4">
              A platform built for<br />workers, not just customers
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              We believe the plumber who fixed 200 homes should have a reputation as powerful as any corporate brand.
              KaamSetu gives every local skilled worker the digital tools to prove their worth and grow their business.
            </p>
            <Btn variant="primary" size="lg" onClick={() => setPage('onboarding')}>
              <Icon name="arrow-right" size={18} /> Join as a provider
            </Btn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((p, i) => (
              <div key={p.title} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm page-enter stagger-${i+1}`}>
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-3">
                  <Icon name={p.icon} size={20} className="text-teal-700 dark:text-teal-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{p.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────
function Footer() {
  const { setPage } = useApp();
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
                <Icon name="wrench" size={16} className="text-white" />
              </span>
              <span className="font-heading font-bold text-white text-lg">KaamSetu</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">Local skills. Trusted nearby. Connecting verified workers with the people who need them most.</p>
            <div className="flex gap-3">
              {['twitter', 'instagram', 'linkedin'].map(s => (
                <button key={s} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-teal-700 flex items-center justify-center transition-colors" aria-label={`${s} (non-functional demo)`}>
                  <Icon name={s === 'twitter' ? 'twitter' : s === 'instagram' ? 'instagram' : 'linkedin'} size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
          {[
            { head: 'Platform', links: ['Browse services','How it works','Trust & Safety','Pricing'] },
            { head: 'Providers', links: ['Become a provider','Provider handbook','Verification process','Success stories'] },
            { head: 'Company', links: ['About us','Blog','Careers','Contact'] },
          ].map(col => (
            <div key={col.head}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.head}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <button className="text-sm hover:text-teal-400 transition-colors"
                      onClick={() => { if (l === 'Browse services') setPage('search'); if (l === 'Become a provider') setPage('onboarding'); }}>
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">© 2026 KaamSetu. Demo profiles & bookings — no real payments processed.</p>
          <div className="flex gap-4 text-xs">
            <button className="hover:text-teal-400 transition-colors">Privacy Policy</button>
            <button className="hover:text-teal-400 transition-colors">Terms of Service</button>
            <button className="hover:text-teal-400 transition-colors">Cookie Settings</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────
function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Recommended />
      <StatsStrip />
      <WhyDifferent />
    </main>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────
function FilterPanel({ filters, onChange, onReset, compact }) {
  const cls = compact ? '' : 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm sticky top-20';
  return (
    <aside className={cls} aria-label="Search filters">
      {!compact && (
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="sliders-horizontal" size={16} className="text-teal-700" /> Filters
          </h2>
          <button onClick={onReset} className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-medium">Reset all</button>
        </div>
      )}

      {/* Category */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.filter(c => c !== 'All').map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox"
                className="w-4 h-4 rounded accent-teal-700"
                checked={filters.categories.includes(cat)}
                onChange={e => onChange('categories', e.target.checked ? [...filters.categories, cat] : filters.categories.filter(c => c !== cat))}
                aria-label={`Filter by ${cat}`}
              />
              <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Distance</h3>
        {[{ v: 99, l: 'Any distance' },{ v: 2, l: 'Within 2 km' },{ v: 5, l: 'Within 5 km' },{ v: 10, l: 'Within 10 km' }].map(opt => (
          <label key={opt.v} className="flex items-center gap-2.5 cursor-pointer group mb-1.5">
            <input type="radio" name="distance" className="accent-teal-700"
              checked={filters.maxDistance === opt.v}
              onChange={() => onChange('maxDistance', opt.v)}
              aria-label={opt.l}
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{opt.l}</span>
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max price</h3>
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 tabular-nums">{filters.maxPrice >= 1000 ? '₹1000+' : `₹${filters.maxPrice}/hr`}</span>
        </div>
        <input type="range" min={200} max={1000} step={50}
          value={filters.maxPrice}
          onChange={e => onChange('maxPrice', Number(e.target.value))}
          aria-label={`Maximum price per hour: ${filters.maxPrice}`}
        />
      </div>

      {/* Min rating */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Minimum rating</h3>
        <div className="flex gap-2">
          {[0, 3.5, 4.0, 4.5].map(r => (
            <button key={r}
              className={`flex-1 text-xs py-1.5 rounded-lg border transition-all font-medium
                ${filters.minRating === r ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-teal-400'}`}
              onClick={() => onChange('minRating', r)}
              aria-pressed={filters.minRating === r}
              aria-label={r === 0 ? 'Any rating' : `Minimum ${r} stars`}
            >
              {r === 0 ? 'Any' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Verified only */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input type="checkbox" className="sr-only"
            checked={filters.verifiedOnly}
            onChange={e => onChange('verifiedOnly', e.target.checked)}
            aria-label="Show verified providers only"
          />
          <div className={`w-10 h-5 rounded-full transition-colors ${filters.verifiedOnly ? 'bg-teal-700' : 'bg-gray-200 dark:bg-gray-600'}`} />
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.verifiedOnly ? 'translate-x-5' : ''}`} />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Verified only</span>
      </label>
    </aside>
  );
}

// ─── Map View ─────────────────────────────────────────────────
function MapView({ workers, onPin }) {
  return (
    <div className="relative bg-teal-50 dark:bg-teal-900/20 rounded-2xl overflow-hidden border border-teal-100 dark:border-teal-800" style={{ height: 420 }} aria-label="Map view of providers">
      {/* Grid lines for faux-map look */}
      <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0d9488" strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Road lines */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#0d9488" strokeWidth="2" strokeOpacity="0.15" />
        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#0d9488" strokeWidth="1.5" strokeOpacity="0.1" />
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#0d9488" strokeWidth="1.5" strokeOpacity="0.1" />
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#0d9488" strokeWidth="1" strokeOpacity="0.08" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#0d9488" strokeWidth="1" strokeOpacity="0.08" />
      </svg>

      {/* "You are here" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg relative map-pin-pulse">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium shadow">You</div>
        </div>
      </div>

      {/* Worker pins */}
      {workers.map((w, i) => {
        const angle = (i / workers.length) * 2 * Math.PI;
        const radius = 100 + (w.distanceKm / 10) * 80;
        const left = 50 + Math.cos(angle) * (radius / 4);
        const top = 50 + Math.sin(angle) * (radius / 5);
        return (
          <button
            key={w.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${Math.min(Math.max(left, 8), 92)}%`, top: `${Math.min(Math.max(top, 12), 88)}%` }}
            onClick={() => onPin(w)}
            aria-label={`${w.name} — ${w.skillCategory}, ${formatINR(w.hourlyRate)}/hr`}
          >
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-125"
                style={{ background: `linear-gradient(135deg, ${w.color}cc, ${w.color})`, borderWidth: 2.5 }}
              >
                {w.initials}
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                style={{ background: w.color }} />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="font-semibold">{w.name}</div>
              <div className="text-gray-300">{w.skillCategory} · {formatINR(w.hourlyRate)}/hr</div>
            </div>
          </button>
        );
      })}

      {/* Map label */}
      <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 shadow">
        <Icon name="info" size={11} className="inline mr-1" />Click a pin to see the provider
      </div>
    </div>
  );
}

// ─── SEARCH PAGE ─────────────────────────────────────────────
function SearchPage() {
  const { searchQuery, searchFilters, setSearchFilters, setPage, setSelectedWorker, setBookingWorker, addToast } = useApp();
  const [filters, setFilters] = useState({
    categories: [],
    maxDistance: 99,
    maxPrice: 1000,
    minRating: 0,
    verifiedOnly: false,
    ...searchFilters,
  });
  const [sort, setSort] = useState('trust');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState(searchQuery || '');
  const [highlightedId, setHighlightedId] = useState(null);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [query, filters, sort]);

  const filtered = useMemo(() => {
    let arr = [...WORKERS];
    if (query) arr = arr.filter(w =>
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.skillCategory.toLowerCase().includes(query.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
    );
    if (filters.categories.length) arr = arr.filter(w => filters.categories.includes(w.skillCategory));
    if (filters.maxDistance < 99) arr = arr.filter(w => w.distanceKm <= filters.maxDistance);
    if (filters.maxPrice < 1000) arr = arr.filter(w => w.hourlyRate <= filters.maxPrice);
    if (filters.minRating > 0) arr = arr.filter(w => w.rating >= filters.minRating);
    if (filters.verifiedOnly) arr = arr.filter(w => w.verified);
    return sortWorkers(arr, sort);
  }, [query, filters, sort]);

  const handleFilterChange = useCallback((key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
  }, []);

  const handleReset = () => {
    setFilters({ categories: [], maxDistance: 99, maxPrice: 1000, minRating: 0, verifiedOnly: false });
    setQuery('');
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950" id="main-content">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search bar */}
          <div className="flex-1 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 max-w-md w-full">
            <Icon name="search" size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search service or skill..."
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Refine search"
            />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search"><Icon name="x" size={14} className="text-gray-400 hover:text-gray-600" /></button>}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Mobile filter toggle */}
            <button
              className="flex items-center gap-1.5 text-sm font-medium text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-700 rounded-xl px-3 py-2 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors lg:hidden"
              onClick={() => setFilterOpen(o => !o)}
              aria-expanded={filterOpen}
              aria-controls="filter-drawer"
            >
              <Icon name="sliders-horizontal" size={14} /> Filters
              {(filters.categories.length || filters.verifiedOnly || filters.maxDistance < 99 || filters.minRating > 0 || filters.maxPrice < 1000) &&
                <span className="bg-teal-700 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center ml-0.5">!</span>
              }
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400 flex-1 sm:flex-none">{loading ? 'Searching...' : `${filtered.length} found`}</span>

            {/* Sort */}
            <select
              className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort results"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* View toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1" role="group" aria-label="View mode">
              {[{ v: 'grid', icon: 'layout-grid' },{ v: 'list', icon: 'list' },{ v: 'map', icon: 'map' }].map(m => (
                <button key={m.v}
                  className={`p-2 rounded-lg transition-colors ${viewMode === m.v ? 'bg-white dark:bg-gray-700 shadow text-teal-700 dark:text-teal-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                  onClick={() => setViewMode(m.v)}
                  aria-pressed={viewMode === m.v}
                  aria-label={`${m.v} view`}
                >
                  <Icon name={m.icon} size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar (desktop) */}
          <div className="w-60 flex-shrink-0 hidden lg:block">
            <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
          </div>

          {/* Mobile filter drawer */}
          {filterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" id="filter-drawer" aria-label="Filters drawer">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} aria-hidden="true" />
              <div className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 overflow-y-auto p-5 shadow-2xl drawer-slide-in">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900 dark:text-white">Filters</h2>
                  <button onClick={() => setFilterOpen(false)} aria-label="Close filters"><Icon name="x" size={18} className="text-gray-500" /></button>
                </div>
                <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} compact />
                <div className="mt-6 flex gap-3">
                  <Btn variant="secondary" size="sm" className="flex-1" onClick={() => { handleReset(); setFilterOpen(false); }}>Reset</Btn>
                  <Btn variant="primary" size="sm" className="flex-1" onClick={() => setFilterOpen(false)}>Apply</Btn>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-5">
              {CATEGORIES.map(cat => (
                <button key={cat}
                  className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition-all
                    ${(cat === 'All' && filters.categories.length === 0) || filters.categories.includes(cat)
                      ? 'bg-teal-700 border-teal-700 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400'}`}
                  onClick={() => {
                    if (cat === 'All') handleFilterChange('categories', []);
                    else handleFilterChange('categories', filters.categories.includes(cat) ? filters.categories.filter(c => c !== cat) : [...filters.categories, cat]);
                  }}
                  aria-pressed={cat === 'All' ? filters.categories.length === 0 : filters.categories.includes(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {viewMode === 'map' && (
              <div className="mb-6">
                <MapView
                  workers={loading ? [] : filtered}
                  onPin={w => { setHighlightedId(w.id); setSelectedWorker(w); setPage('profile'); }}
                />
              </div>
            )}

            {loading ? (
              <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'}>
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 page-enter" role="status" aria-live="polite">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Icon name="search-x" size={32} className="text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">No providers match your filters</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                  Try widening your search radius, removing some filters, or searching for a different skill.
                </p>
                <Btn variant="primary" onClick={handleReset}>Reset all filters</Btn>
              </div>
            ) : (
              <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'}>
                {filtered.map((w, i) => (
                  viewMode === 'list' ? (
                    <div key={w.id}
                      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm card-hover flex items-start gap-5 page-enter ${w.id === highlightedId ? 'ring-2 ring-teal-500' : ''}`}
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <Avatar worker={w} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{w.name}</h3>
                            <p className="text-teal-700 dark:text-teal-400 text-xs font-medium">{w.skillCategory} · {w.locality}</p>
                          </div>
                          {w.verified ? <Badge type="verified" small /> : <Badge type="pending" small />}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center gap-1"><Stars rating={w.rating} size={12} /><span className="text-xs text-gray-500">{formatRating(w.rating)} ({w.reviewCount})</span></span>
                          <span className="text-xs text-gray-400">{w.distanceKm} km</span>
                          <span className="text-xs text-gray-400">{w.completedJobs} jobs</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-2">{w.bio}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 dark:text-white tabular-nums">{formatINR(w.hourlyRate)}<span className="text-gray-400 font-normal text-xs">/hr</span></span>
                          <div className="flex gap-2">
                            <Btn variant="secondary" size="xs" onClick={() => { setSelectedWorker(w); setPage('profile'); }}>View profile</Btn>
                            {w.verified && w.bookedSlots.length < w.availability.slots.length &&
                              <Btn variant="primary" size="xs" onClick={() => setBookingWorker(w)}>Book</Btn>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <WorkerCard key={w.id} worker={w} index={i}
                      onView={w => { setSelectedWorker(w); setPage('profile'); }}
                      onBook={w => setBookingWorker(w)}
                    />
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Review Card ──────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {review.initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{review.reviewerName}</span>
            <span className="text-gray-400 text-xs">{review.date}</span>
          </div>
          <Stars rating={review.rating} size={12} />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"{review.comment}"</p>
    </div>
  );
}

// ─── WORKER PROFILE PAGE ──────────────────────────────────────
function WorkerProfilePage() {
  const { selectedWorker: w, setPage, setBookingWorker } = useApp();
  const [tab, setTab] = useState('about');
  const [stickyBtn, setStickyBtn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handler = () => setStickyBtn(window.scrollY > 300);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!w) return null;

  const isFullyBooked = w.bookedSlots.length >= w.availability.slots.length;
  const tabs = ['about', 'skills', 'portfolio', 'reviews', 'availability'];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950" id="main-content">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <button onClick={() => setPage('home')} className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Home</button>
          <Icon name="chevron-right" size={14} />
          <button onClick={() => setPage('search')} className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">Search</button>
          <Icon name="chevron-right" size={14} />
          <span className="text-gray-900 dark:text-white font-medium">{w.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Profile header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm mb-6 page-enter">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar worker={w} size="xl" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">{w.name}</h1>
                      <p className="text-teal-700 dark:text-teal-400 font-semibold">{w.skillCategory}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {w.verified ? <Badge type="verified" /> : <Badge type="pending" />}
                      {w.rating >= 4.8 && <Badge type="top" />}
                      {w.responseTimeMins <= 20 && <Badge type="fast" />}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-5 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Stars rating={w.rating} size={16} />
                      <span className="font-bold text-gray-900 dark:text-white tabular-nums">{formatRating(w.rating)}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">({w.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Icon name="map-pin" size={14} className="text-teal-700 dark:text-teal-400" />
                      {w.locality} · {w.distanceKm} km away
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Icon name="briefcase" size={14} className="text-teal-700 dark:text-teal-400" />
                      {w.completedJobs} jobs completed
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Icon name="clock" size={14} className="text-teal-700 dark:text-teal-400" />
                      Responds in ~{w.responseTimeMins} min
                    </div>
                  </div>

                  {/* Action buttons (desktop) */}
                  <div className="hidden sm:flex gap-3 flex-wrap">
                    <Btn variant="secondary" size="md">
                      <Icon name="message-circle" size={16} /> Message
                    </Btn>
                    {isFullyBooked ? (
                      <Btn variant="ghost" size="md" disabled>
                        <Icon name="calendar-x" size={16} /> Fully booked · Next: Thu 10 AM
                      </Btn>
                    ) : !w.verified ? (
                      <Btn variant="ghost" size="md" disabled>
                        Verification in progress
                      </Btn>
                    ) : (
                      <Btn variant="amber" size="md" onClick={() => setBookingWorker(w)}>
                        <Icon name="calendar-check" size={16} /> Book Now
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto hide-scrollbar" role="tablist">
                {tabs.map(t => (
                  <button key={t}
                    role="tab"
                    aria-selected={tab === t}
                    className={`flex-shrink-0 px-5 py-4 text-sm font-medium capitalize transition-colors border-b-2 -mb-px
                      ${tab === t ? 'border-teal-700 text-teal-700 dark:text-teal-400 dark:border-teal-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-6" role="tabpanel" aria-label={`${tab} tab`}>
                {tab === 'about' && (
                  <div className="space-y-4 page-enter">
                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg">About {w.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{w.bio}</p>
                    {w.verified && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex gap-3">
                        <Icon name="shield-check" size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-800 dark:text-green-300 text-sm">Identity & skills verified</p>
                          <p className="text-green-700 dark:text-green-400 text-xs mt-0.5">
                            {w.name}'s government-issued ID, professional certificates, and skill assessment have been verified by the KaamSetu team since {w.verifiedSince}.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {tab === 'skills' && (
                  <div className="page-enter">
                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">Skills & expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {w.skills.map(s => (
                        <span key={s} className="bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 rounded-xl text-sm px-4 py-2 font-medium border border-teal-100 dark:border-teal-800">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Works in</h3>
                      <div className="flex flex-wrap gap-2">
                        {w.availability.days.map(d => (
                          <span key={d} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm px-3 py-1 font-medium">{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {tab === 'portfolio' && (
                  <div className="page-enter">
                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">Portfolio</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {w.portfolioPhotos.map((p, i) => (
                        <div key={i}
                          className="aspect-square rounded-xl overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${w.color}22, ${w.color}55)` }}
                          aria-label={`Portfolio photo ${i + 1} of ${w.portfolioPhotos.length}`}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon name="image" size={32} className="text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">Portfolio photos are illustrative for this demo</p>
                  </div>
                )}
                {tab === 'reviews' && (
                  <div className="page-enter">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Customer reviews</h2>
                      <div className="flex items-center gap-2">
                        <Stars rating={w.rating} size={16} />
                        <span className="font-bold text-gray-900 dark:text-white tabular-nums">{formatRating(w.rating)}</span>
                        <span className="text-gray-500 text-sm">({w.reviewCount})</span>
                      </div>
                    </div>
                    {w.reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="message-circle" size={36} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">New to KaamSetu</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Be the first to review {w.name} after your booking!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {w.reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
                      </div>
                    )}
                  </div>
                )}
                {tab === 'availability' && (
                  <div className="page-enter">
                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Weekly availability</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Available days and time slots for the upcoming week</p>
                    <div className="space-y-4">
                      {w.availability.days.map(day => (
                        <div key={day}>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">{day}</p>
                          <div className="flex flex-wrap gap-2">
                            {w.availability.slots.map(slot => (
                              <span key={slot} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${w.bookedSlots.includes(slot) ? 'slot-booked' : 'slot-available'}`}>
                                {slot} {w.bookedSlots.includes(slot) ? '(Booked)' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-5">
            {/* Pricing card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm page-enter stagger-1">
              <div className="flex items-end gap-1 mb-1">
                <span className="font-heading font-bold text-3xl text-gray-900 dark:text-white tabular-nums">{formatINR(w.hourlyRate)}</span>
                <span className="text-gray-500 dark:text-gray-400 mb-1">/hr</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Min. 1 hour booking · No hidden charges</p>
              <div className="space-y-2 mb-5 text-sm">
                {[
                  { icon: 'clock', text: `${w.responseTimeMins}-min avg response` },
                  { icon: 'briefcase', text: `${w.completedJobs} completed jobs` },
                  { icon: 'calendar', text: `${w.availability.days.length} days/week available` },
                  { icon: 'refresh-ccw', text: 'Free cancellation up to 2 hrs before' },
                ].map(i => (
                  <div key={i.text} className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                    <Icon name={i.icon} size={14} className="text-teal-700 dark:text-teal-400 flex-shrink-0" />
                    {i.text}
                  </div>
                ))}
              </div>
              {isFullyBooked ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-center">
                  <p className="text-amber-800 dark:text-amber-300 font-semibold text-sm">Fully booked this week</p>
                  <p className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">Next available: Thu 10:00 AM</p>
                </div>
              ) : !w.verified ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                  <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm">Verification in progress</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Bookings open once verified</p>
                </div>
              ) : (
                <>
                  <Btn variant="amber" size="lg" className="w-full" onClick={() => setBookingWorker(w)}>
                    <Icon name="calendar-check" size={18} /> Book Now
                  </Btn>
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                    <Icon name="lock" size={10} className="inline mr-1" />Secure · Pay on completion · No upfront charges
                  </p>
                </>
              )}
            </div>

            {/* Similar providers */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm page-enter stagger-2">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Similar providers nearby</h3>
              <div className="space-y-3">
                {WORKERS.filter(x => x.id !== w.id && x.skillCategory === w.skillCategory).slice(0,3).map(sim => (
                  <button key={sim.id}
                    className="w-full flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl p-2 -mx-2 transition-colors text-left"
                    onClick={() => { setSelectedWorker(sim); setPage('profile'); window.scrollTo(0,0); }}
                    aria-label={`View profile of ${sim.name}`}
                  >
                    <Avatar worker={sim} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{sim.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Stars rating={sim.rating} size={10} /> {formatRating(sim.rating)} · {formatINR(sim.hourlyRate)}/hr
                      </p>
                    </div>
                  </button>
                ))}
                {WORKERS.filter(x => x.id !== w.id && x.skillCategory === w.skillCategory).length === 0 && (
                  <p className="text-xs text-gray-400">No other {w.skillCategory}s in your area yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {stickyBtn && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-3 sm:hidden z-40 animate-fade-in shadow-2xl">
          <Btn variant="secondary" size="md" className="flex-1"><Icon name="message-circle" size={16} /> Message</Btn>
          {!isFullyBooked && w.verified && <Btn variant="amber" size="md" className="flex-1" onClick={() => setBookingWorker(w)}><Icon name="calendar-check" size={16} /> Book Now</Btn>}
        </div>
      )}
    </main>
  );
}

// ─── BOOKING MODAL ────────────────────────────────────────────
function BookingModal({ worker, onClose }) {
  const { addToast } = useApp();
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [address, setAddress] = useState('B-24, Saket, New Delhi, 110017');
  const [duration, setDuration] = useState(2);
  const [confirming, setConfirming] = useState(false);
  const [bookingRef] = useState(`KS-${Date.now().toString().slice(-6)}`);
  const [complete, setComplete] = useState(false);

  const availableSlots = worker.availability.slots.filter(s => !worker.bookedSlots.includes(s));
  const estimatedCost = worker.hourlyRate * duration;

  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].filter(d => worker.availability.days.includes(d));

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setComplete(true);
      addToast('Booking confirmed! ' + worker.name + ' will see your request.', 'success');
    }, 1400);
  };

  const canNext = () => {
    if (step === 1) return selectedSlot && selectedDay;
    if (step === 2) return jobDesc.trim().length > 0 && address.trim().length > 0;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label="Booking flow">
      <div className="absolute inset-0 modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white">
              {complete ? 'Booking Confirmed!' : `Book ${worker.name}`}
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close booking modal">
              <Icon name="x" size={16} />
            </button>
          </div>
          {!complete && (
            <div className="flex items-center gap-2">
              {[1,2,3].map(s => (
                <React.Fragment key={s}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                    ${step >= s ? 'bg-teal-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    {step > s ? <Icon name="check" size={12} /> : s}
                  </div>
                  {s < 3 && <div className={`step-connector ${step > s ? 'active' : ''}`} aria-hidden="true" />}
                </React.Fragment>
              ))}
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">Step {step} of 3</span>
            </div>
          )}
        </div>

        <div className="px-6 py-5">
          {/* Success */}
          {complete ? (
            <div className="text-center py-6 page-enter">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 50 50" fill="none" aria-hidden="true">
                    <circle cx="25" cy="25" r="24" stroke="#16a34a" strokeWidth="2" />
                    <polyline points="13,25 21,33 37,17" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-animate" />
                  </svg>
                </div>
              </div>
              <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-2">All set!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Your booking reference</p>
              <div className="inline-block bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 font-mono font-bold text-lg px-5 py-2 rounded-xl border border-teal-200 dark:border-teal-700 mb-6">{bookingRef}</div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-left mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">What happens next?</h4>
                <div className="space-y-2.5">
                  {[
                    { icon: 'bell', text: `${worker.name} will confirm within ${worker.responseTimeMins} minutes` },
                    { icon: 'message-circle', text: 'You\'ll get a chat link to discuss job details' },
                    { icon: 'indian-rupee', text: 'Pay only after the job is done — no upfront payment' },
                  ].map(i => (
                    <div key={i.text} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <Icon name={i.icon} size={14} className="text-teal-700 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                      {i.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Btn variant="secondary" size="sm" className="flex-1" onClick={() => {}}>
                  <Icon name="calendar-plus" size={14} /> Add to calendar
                </Btn>
                <Btn variant="primary" size="sm" className="flex-1" onClick={onClose}>
                  Done
                </Btn>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div className="page-enter">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Pick a day and time</h3>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Day</p>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS.map(d => (
                        <button key={d}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                            ${selectedDay === d ? 'bg-teal-700 border-teal-700 text-white shadow-md' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-teal-400'}`}
                          onClick={() => setSelectedDay(d)}
                          aria-pressed={selectedDay === d}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Time slot</p>
                    <div className="grid grid-cols-3 gap-2">
                      {worker.availability.slots.map(slot => {
                        const booked = worker.bookedSlots.includes(slot);
                        return (
                          <button key={slot}
                            className={`py-2 rounded-xl text-xs font-medium border transition-all
                              ${booked ? 'slot-booked' : selectedSlot === slot ? 'bg-teal-700 border-teal-700 text-white' : 'slot-available'}`}
                            onClick={() => !booked && setSelectedSlot(slot)}
                            disabled={booked}
                            aria-pressed={selectedSlot === slot}
                            aria-disabled={booked}
                          >
                            {slot}{booked ? ' ✕' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Job details */}
              {step === 2 && (
                <div className="page-enter space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Tell us about the job</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor="job-desc">What needs to be done?</label>
                    <textarea
                      id="job-desc"
                      rows={3}
                      placeholder={`e.g. "I need ${worker.skillCategory.toLowerCase()} work for my 2BHK flat — ${worker.skills[0]?.toLowerCase()} and ${worker.skills[1]?.toLowerCase()}"`}
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none transition"
                      value={jobDesc}
                      onChange={e => setJobDesc(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor="job-address">Service address</label>
                    <input
                      id="job-address"
                      type="text"
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor="job-duration">Estimated duration</label>
                    <div className="flex gap-2" id="job-duration" role="group" aria-label="Job duration in hours">
                      {[1,2,3,4].map(h => (
                        <button key={h}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                            ${duration === h ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-teal-400'}`}
                          onClick={() => setDuration(h)}
                          aria-pressed={duration === h}
                        >
                          {h}hr
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {step === 3 && (
                <div className="page-enter">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Review your booking</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3 mb-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                      <Avatar worker={worker} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{worker.name}</p>
                        <p className="text-teal-700 dark:text-teal-400 text-xs">{worker.skillCategory}</p>
                      </div>
                    </div>
                    {[
                      { label: 'Date & Time', value: `${selectedDay}, ${selectedSlot}` },
                      { label: 'Duration', value: `${duration} hour${duration > 1 ? 's' : ''}` },
                      { label: 'Address', value: address },
                      { label: 'Job description', value: jobDesc },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{r.label}</span>
                        <span className="text-gray-900 dark:text-white font-medium text-right">{r.value}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white">Estimated total</span>
                      <span className="font-heading font-bold text-xl text-amber-600 dark:text-amber-400 tabular-nums">{formatINR(estimatedCost)}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-5 flex gap-2 text-sm">
                    <Icon name="info" size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-amber-800 dark:text-amber-300">
                      <strong>Pay on completion.</strong> No payment now — you'll pay {worker.name} directly after the job is done to your satisfaction.
                    </div>
                  </div>

                  <Btn variant="amber" size="lg" className="w-full" onClick={handleConfirm} loading={confirming} disabled={confirming}>
                    {confirming ? 'Confirming booking...' : 'Confirm Booking'}
                  </Btn>
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                    <Icon name="refresh-ccw" size={10} className="inline mr-1" />Free cancellation up to 2 hours before
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className={`flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 ${step === 3 ? 'hidden' : ''}`}>
                {step > 1 && (
                  <Btn variant="secondary" size="md" className="flex-1" onClick={() => setStep(s => s - 1)}>
                    <Icon name="arrow-left" size={14} /> Back
                  </Btn>
                )}
                <Btn variant="primary" size="md" className="flex-1" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
                  {step === 2 ? 'Review booking' : 'Continue'} <Icon name="arrow-right" size={14} />
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING PAGE ──────────────────────────────────────────
function OnboardingPage() {
  const { setPage } = useApp();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const TOTAL = 3;

  const [form, setForm] = useState({
    name: '', phone: '', city: 'Delhi', locality: '',
    category: '', skills: [], hourlyRate: '', bio: '',
    idUploaded: false, certUploaded: false,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = s => set('skills', form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);

  const SKILL_MAP = {
    Electrician: ['Wiring', 'Appliance Repair', 'MCB/Fuses', 'LED Lighting', 'AC Repair'],
    Plumber: ['Leak Repair', 'Pipe Fitting', 'Bathroom Fitting', 'Drainage', 'Water Heater'],
    Tailor: ['Stitching', 'Alterations', 'Blouse Design', 'Embroidery', 'Lehenga'],
    Carpenter: ['Furniture Repair', 'Cabinet Making', 'Modular Kitchen', 'Door Fitting', 'POP Work'],
    Beautician: ['Makeup', 'Mehendi', 'Facial', 'Waxing', 'Hair Styling', 'Nail Art'],
    Tutor: ['Maths', 'Physics', 'Chemistry', 'English', 'Hindi', 'Science'],
    Cook: ['North Indian', 'South Indian', 'Tiffin Service', 'Party Catering', 'Continental'],
    Cleaner: ['Deep Cleaning', 'Sofa Cleaning', 'Kitchen Cleaning', 'Carpet Cleaning', 'Post-Construction'],
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1500);
  };

  const canNext = () => {
    if (step === 1) return form.name && form.phone && form.city && form.locality;
    if (step === 2) return form.category && form.skills.length > 0 && form.hourlyRate && form.bio;
    if (step === 3) return form.idUploaded;
    return true;
  };

  if (submitted) return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4" id="main-content">
      <div className="text-center max-w-md page-enter">
        <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="clock" size={44} className="text-teal-700 dark:text-teal-400" />
        </div>
        <h2 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-3">You're on the list!</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
          <strong>{form.name}</strong>, your profile is under verification.
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
          Our team will review your submitted documents and reach out to you at <strong>{form.phone}</strong> within 24 hours. Once approved, your profile goes live instantly.
        </p>
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-2xl p-5 mb-8 text-left space-y-2">
          <h3 className="font-semibold text-teal-900 dark:text-teal-200 text-sm">What to expect next</h3>
          {['Verification call within 24 hours', 'Profile live within 48 hours', 'First booking request could come within a week!'].map(t => (
            <div key={t} className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-400">
              <Icon name="check-circle" size={14} /> {t}
            </div>
          ))}
        </div>
        <Btn variant="primary" size="lg" onClick={() => setPage('home')}>
          <Icon name="home" size={16} /> Back to home
        </Btn>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4" id="main-content">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 page-enter">
          <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Icon name="user-plus" size={14} /> Become a KaamSetu provider
          </div>
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-2">Join 500+ skilled workers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Build your verified digital reputation and grow your local business.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1,2,3].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step >= s ? 'text-teal-700 dark:text-teal-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${step > s ? 'bg-teal-700 text-white' : step === s ? 'bg-teal-700 text-white ring-4 ring-teal-100 dark:ring-teal-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  {step > s ? <Icon name="check" size={12} /> : s}
                </div>
                <span className="text-xs font-medium hidden sm:block">
                  {['Basic info','Skills & pricing','Verification'][i]}
                </span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full transition-colors ${step > s ? 'bg-teal-700' : 'bg-gray-200 dark:bg-gray-700'}`} aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 page-enter">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-5">Basic information</h2>
              {[
                { id: 'name', label: 'Full name', placeholder: 'e.g. Ravi Kumar', type: 'text', key: 'name' },
                { id: 'phone', label: 'Mobile number', placeholder: '+91 98765 43210', type: 'tel', key: 'phone' },
              ].map(f => (
                <div key={f.id}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor={f.id}>{f.label}</label>
                  <input
                    id={f.id}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                    value={form[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor="city">City</label>
                  <select id="city" className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-teal-500 cursor-pointer"
                    value={form.city} onChange={e => set('city', e.target.value)}>
                    {['Delhi','Mumbai','Bangalore','Chennai','Hyderabad','Pune'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor="locality">Locality / Area</label>
                  <input id="locality" type="text" placeholder="e.g. Saket" className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                    value={form.locality} onChange={e => set('locality', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-5">Skills & pricing</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor="category">Primary skill category</label>
                <select id="category" className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-teal-500 cursor-pointer"
                  value={form.category} onChange={e => { set('category', e.target.value); set('skills', []); }}>
                  <option value="">Select a category...</option>
                  {Object.keys(SKILL_MAP).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {form.category && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select your skills <span className="text-gray-400 font-normal">(pick all that apply)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_MAP[form.category].map(s => (
                      <button key={s}
                        className={`text-sm px-3 py-1.5 rounded-lg border transition-all font-medium
                          ${form.skills.includes(s) ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-teal-400'}`}
                        onClick={() => toggleSkill(s)}
                        aria-pressed={form.skills.includes(s)}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor="rate">Hourly rate (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input id="rate" type="number" placeholder="350" min={100} max={2000}
                    className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl pl-8 pr-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                    value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value)} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Market average for {form.category || 'this category'} in Delhi: ₹300–₹500/hr</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5" htmlFor="bio">Short bio <span className="text-gray-400 font-normal">(1-2 sentences)</span></label>
                <textarea id="bio" rows={3} placeholder="e.g. Experienced electrician with 8 years in residential projects across Delhi. Known for clean, safe work and on-time delivery."
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none transition"
                  value={form.bio} onChange={e => set('bio', e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Verification documents</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                We verify every provider's identity and skills before they go live. This protects you and your customers.
              </p>

              {[
                { key: 'idUploaded', icon: 'id-card', title: 'Government-issued ID', desc: 'Aadhaar, PAN, Passport or Voter ID — any one', required: true },
                { key: 'certUploaded', icon: 'file-badge', title: 'Skill certificate', desc: 'ITI certificate, trade license, or any relevant credential (optional but recommended)', required: false },
              ].map(doc => (
                <div key={doc.key}
                  className={`rounded-2xl border-2 border-dashed p-5 transition-all cursor-pointer
                    ${form[doc.key] ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'}`}
                  onClick={() => set(doc.key, !form[doc.key])}
                  role="button"
                  aria-pressed={form[doc.key]}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && set(doc.key, !form[doc.key])}
                  aria-label={`${doc.title} - click to ${form[doc.key] ? 'remove' : 'add'} (demo)`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${form[doc.key] ? 'bg-teal-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                      <Icon name={form[doc.key] ? 'check' : doc.icon} size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {doc.title} {doc.required && <span className="text-red-500">*</span>}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{doc.desc}</p>
                    </div>
                    {form[doc.key] ? (
                      <span className="text-xs bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full font-semibold">Uploaded ✓</span>
                    ) : (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2.5 py-1 rounded-full">Demo upload</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 flex gap-2 text-xs text-amber-800 dark:text-amber-300">
                <Icon name="lock" size={13} className="flex-shrink-0 mt-0.5" />
                Your documents are encrypted and only accessed by our verification team. We never share them with customers.
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-8 pt-5 border-t border-gray-100 dark:border-gray-800">
            {step > 1 ? (
              <Btn variant="secondary" size="md" className="flex-1" onClick={() => setStep(s => s - 1)}>
                <Icon name="arrow-left" size={14} /> Back
              </Btn>
            ) : (
              <Btn variant="ghost" size="md" className="flex-1" onClick={() => setPage('home')}>Cancel</Btn>
            )}
            {step < TOTAL ? (
              <Btn variant="primary" size="md" className="flex-1" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
                Continue <Icon name="arrow-right" size={14} />
              </Btn>
            ) : (
              <Btn variant="primary" size="md" className="flex-1" onClick={handleSubmit} loading={submitting} disabled={!canNext() || submitting}>
                {submitting ? 'Submitting...' : 'Submit for review'}
              </Btn>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Already a provider? <button className="text-teal-700 dark:text-teal-400 hover:underline font-medium">Sign in to your dashboard →</button>
        </p>
      </div>
    </main>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingWorker, setBookingWorker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [toasts, setToasts] = useState([]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const ctx = {
    page, setPage, darkMode, setDarkMode,
    selectedWorker, setSelectedWorker,
    bookingWorker, setBookingWorker,
    searchQuery, setSearchQuery,
    searchFilters, setSearchFilters,
    addToast,
  };

  return (
    <AppCtx.Provider value={ctx}>
      {/* Skip to content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
        Skip to main content
      </a>

      <Header />

      {page === 'home' && <HomePage />}
      {page === 'search' && <SearchPage />}
      {page === 'profile' && selectedWorker && <WorkerProfilePage />}
      {page === 'onboarding' && <OnboardingPage />}

      {page === 'home' && <Footer />}

      {/* Booking modal */}
      {bookingWorker && (
        <BookingModal
          worker={bookingWorker}
          onClose={() => setBookingWorker(null)}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AppCtx.Provider>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
