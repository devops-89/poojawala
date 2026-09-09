export const MOCK_SERVICES = [
  {
    id: '1',
    name: 'Satyanarayan Katha',
    category: 'Home Puja',
    image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A deeply spiritual home puja to bring prosperity and peace.',
    duration: '2-3 Hours',
    price: 2500,
  },
  {
    id: '2',
    name: 'Grah Shanti Havan',
    category: 'Havan/Yagya',
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Resolve doshas and bring harmony to your living space.',
    duration: '3-4 Hours',
    price: 4500,
  },
  {
    id: '3',
    name: 'Vastu Consultation',
    category: 'Vastu',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Expert Vastu advice for your home or office space.',
    duration: '1 Hour',
    price: 1500,
  },
  {
    id: '4',
    name: 'Kundali Matching',
    category: 'Astrology',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Detailed astrological compatibility analysis for marriage.',
    duration: '45 Mins',
    price: 1100,
  }
];

export const MOCK_PUROHITS = [
  {
    id: '101',
    name: 'Acharya Rajendra Sharma',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    title: 'Vedic Scholar & Astrologer',
    experience: '15+ Years',
    rating: 4.9,
    reviews: 124,
    languages: ['Hindi', 'Sanskrit', 'English'],
    specialties: ['Astrology', 'Havan/Yagya'],
    bio: 'Acharya Rajendra Sharma is a highly respected Vedic scholar with over 15 years of experience in conducting intricate homams and providing accurate astrological consultations.',
  },
  {
    id: '102',
    name: 'Pandit Vivek Tiwari',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    title: 'Specialist in Home Pujas',
    experience: '8 Years',
    rating: 4.7,
    reviews: 89,
    languages: ['Hindi', 'Bhojpuri'],
    specialties: ['Satyanarayan Katha', 'Grah Pravesh'],
    bio: 'Pandit Vivek brings immense devotion and clarity to his pujas, ensuring that every ritual is performed with the utmost sanctity and adherence to scriptures.',
  }
];

export const MOCK_BOOKINGS = [
  {
    id: 'B-10029',
    service: 'Satyanarayan Katha',
    purohit: 'Pandit Vivek Tiwari',
    date: '2026-07-10',
    time: '10:00 AM',
    status: 'Upcoming',
    amount: 2500,
  },
  {
    id: 'B-10014',
    service: 'Vastu Consultation',
    purohit: 'Acharya Rajendra Sharma',
    date: '2026-07-02',
    time: '04:00 PM',
    status: 'Completed',
    amount: 1500,
  }
];
