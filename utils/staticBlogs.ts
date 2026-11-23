export interface StaticBlogSection {
  title: string;
  description: string;
}

export interface StaticBlog {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  authorName: string;
  readTime: number;
  publishedAt: string;
  createdAt: string;
  coverImage: string;
  status: "PUBLISHED";
  isActive: boolean;
  isFeatured: boolean;
  content: string;
  sections: StaticBlogSection[];
}

export const STATIC_BLOGS: StaticBlog[] = [
  {
    id: "book-verified-pandit-ji-online",
    slug: "book-verified-pandit-ji-online",
    title: "Book Verified Pandit Ji Online: Find the Right Pandit for Your Pooja",
    metaTitle: "Book Verified Pandit Ji Online Or Offline for All Poojas",
    metaDescription:
      "Find experienced Pandits for Hindu ceremonies and book verified Pandit Ji online for your special religious occasions with 1Pooja.",
    excerpt:
      "Choosing a Pandit Ji is not just about arranging someone to perform a pooja. Learn how to book verified Pandit Ji online or offline for trusted Vedic rituals with 1Pooja.",
    category: "Pandit Booking",
    authorName: "1Pooja Editorial",
    readTime: 6,
    publishedAt: "2026-11-18T10:00:00.000Z",
    createdAt: "2026-11-18T10:00:00.000Z",
    coverImage: "/images/puja/satyanarayan.webp",
    status: "PUBLISHED",
    isActive: true,
    isFeatured: false,
    content: `
      <p>Choosing a Pandit Ji is not just about arranging someone to perform a pooja. It is about finding the right person who understands your traditions, respects your beliefs, and knows how to conduct the rituals properly.</p>
      <p>In Hindu tradition, every pooja has a purpose. Whether it is a Griha Pravesh, Satyanarayan Katha, Rudrabhishek, or a simple Ganesh Pooja, the importance of the ceremony lies in performing the rituals with devotion and following the appropriate vidhi.</p>
      <p>However, finding a knowledgeable Pandit Ji at the right time is not always easy. Sometimes, families depend on personal references, while others struggle to find someone familiar with their specific rituals. Today, technology has made this process more convenient. Platforms like <a href="/"><strong>1Pooja</strong></a> help families explore religious services and connect with experienced Pandits for different spiritual occasions.</p>
      <p>If you are planning a religious ceremony and want to <a href="/services?isOnline=true"><strong>Book verified Pandit Ji online</strong></a>, understanding a few important things before making your decision can help you choose the right person.</p>
    `,
    sections: [
      {
        title: '<a href="/services?isOnline=true">Book Verified Pandit Ji Online</a> for Trusted Vedic Pooja Services',
        description: `
          <p>A Pandit Ji does much more than recite mantras during a religious ceremony. He understands the significance of different rituals, their traditional sequences, and the purpose behind the mantras. For example, Griha Pravesh Pooja and Bhoomi Pooja are both associated with a new home or property, but their procedures and religious purposes are different.</p>
          <p>An experienced Pandit can guide the family regarding:</p>
          <ul>
            <li>The appropriate pooja vidhi according to the ceremony.</li>
            <li>Traditional mantras and their correct pronunciation.</li>
            <li>Auspicious timings and muhurat requirements.</li>
            <li>Pooja samagri and preparation.</li>
            <li>The sequence of rituals, including Sankalp, Ganesh Pooja, Havan and Aarti, wherever applicable.</li>
          </ul>
          <p>Another important consideration is communication. A good Pandit should be able to explain the purpose of important rituals so that family members understand what they are participating in.</p>
        `,
      },
      {
        title: 'How to <a href="/services?isOnline=true">Book Verified Pandit Ji Online</a> Through <a href="/">1Pooja</a>?',
        description: `
          <p>Many families today prefer a convenient way to arrange religious ceremonies without spending days searching for a suitable priest. This is where 1Pooja can help. The platform brings religious services together, allowing devotees to explore Pandit booking options for different occasions. Here is a simple approach to arranging your pooja through the platform.</p>
          <ul>
            <li><strong>Step 1: Visit the 1Pooja Website</strong> &mdash; Visit the official 1Pooja website and explore the available religious services. You can discover different pooja packages and options for online and offline religious assistance.</li>
            <li><strong>Step 2: Select Your Pooja Requirement</strong> &mdash; Every ceremony has different requirements. Select the pooja according to your occasion, whether it is a housewarming ceremony, a family ritual, a havan, or a special worship.</li>
            <li><strong>Step 3: Understand the Pooja Package</strong> &mdash; Before proceeding, carefully review the package details. Check the included services, applicable charges, ceremony requirements and other relevant information.</li>
            <li><strong>Step 4: Share Your Ceremony Details</strong> &mdash; Provide the required information, such as your preferred date, location, type of pooja and any specific traditional preferences.</li>
            <li><strong>Step 5: Confirm Your Booking</strong> &mdash; Follow the website's booking instructions and confirm the arrangements. It is always advisable to discuss the availability of the Pandit Ji and pooja samagri requirements beforehand.</li>
          </ul>
        `,
      },
      {
        title: "Which Hindu Poojas Can You Arrange Through 1Pooja?",
        description: `
          <p>One thing every family should understand is that different occasions call for different religious ceremonies. Choosing the appropriate pooja is equally important as selecting the right Pandit. Here are some popular Hindu ceremonies worth exploring.</p>
          <ol>
            <li><strong>Griha Pravesh Pooja:</strong> Entering a new home is a special milestone. Griha Pravesh Pooja is traditionally performed to seek blessings for peace, happiness and prosperity in the new house.</li>
            <li><strong>Satyanarayan Pooja:</strong> Dedicated to Lord Vishnu, Satyanarayan Pooja is commonly performed on auspicious occasions, during family celebrations and for expressing gratitude.</li>
            <li><strong>Rudrabhishek Pooja:</strong> Rudrabhishek is an important Shiva worship ritual involving the Abhishek of Shivling with traditional offerings and the chanting of Vedic mantras.</li>
            <li><strong>Bhoomi Pooja:</strong> Before starting construction on a new property, families traditionally perform Bhoomi Pooja to seek blessings and express respect towards Mother Earth.</li>
            <li><strong>Navgraha Shanti Pooja:</strong> This ceremony is traditionally performed to seek blessings from the nine planetary deities and is conducted according to specific astrological and religious requirements.</li>
            <li><strong>Annaprashan Pooja:</strong> Annaprashan marks a baby's first introduction to solid food. It is an important family occasion celebrated with traditional rituals and blessings.</li>
          </ol>
        `,
      },
      {
        title: "Online or Offline Pandit Booking: Which Is Better?",
        description: `
          <p>The right choice depends on your family traditions, location and the nature of the ceremony.</p>
          <p><strong>Offline Pandit Booking:</strong> If you want the Pandit Ji to visit your home, temple or another venue, offline services are generally more suitable. These are particularly useful for ceremonies involving havan, family participation and physical pooja arrangements.</p>
          <p><strong>Online Pandit Services:</strong> Online religious services can be helpful for devotees who live away from their hometown or prefer remote religious guidance. However, remember that ceremonies requiring physical participation and offerings may need an offline arrangement.</p>
          <p>1Pooja provides options to explore both online and offline religious services according to your requirements.</p>
        `,
      },
      {
        title: "What Should You Check Before Finalising a Pandit?",
        description: `
          <p>From a traditional perspective, selecting a Pandit should never be based on price alone. Knowledge, experience, communication and familiarity with the required ceremony are equally important. Keep these points in mind:</p>
          <ol>
            <li>Ask about the Pandit's experience with your particular pooja.</li>
            <li>Confirm whether the ceremony will follow your preferred religious tradition.</li>
            <li>Discuss the language of mantras and explanations.</li>
            <li>Clarify whether pooja samagri is included.</li>
            <li>Confirm the date, muhurat, location and expected duration.</li>
            <li>Understand the complete charges before confirming.</li>
          </ol>
          <p>A little preparation beforehand can make the entire ceremony more organised and peaceful.</p>
        `,
      },
      {
        title: "Why Explore 1Pooja for Your Religious Requirements?",
        description: `
          <p>Finding the right religious service should be a comfortable experience. 1Pooja aims to simplify the process by bringing different spiritual services together on one platform. Some of the features highlighted by the platform include:</p>
          <ul>
            <li>Access to verified and experienced Pandits.</li>
            <li>Multiple Hindu pooja and ceremony options.</li>
            <li>Online and offline service arrangements.</li>
            <li>Secure booking facilities.</li>
            <li>Customer support for booking-related assistance.</li>
          </ul>
          <p>Whether you are planning a traditional family ceremony or seeking guidance for an upcoming religious occasion, you can explore the available services and understand which arrangement suits your needs.</p>
        `,
      },
      {
        title: "Final Thoughts",
        description: `
          <p>A pooja becomes more meaningful when it is performed with proper preparation, devotion and an understanding of the rituals involved. Choosing a knowledgeable Pandit Ji helps families follow traditional practices while making everyone feel involved in the ceremony.</p>
          <p>Rather than rushing into a booking at the last moment, take time to understand your requirements, discuss the pooja vidhi and confirm all important arrangements. If you are planning your next religious ceremony, <a href="/services?isOnline=true"><strong>Book verified Pandit Ji online</strong></a> through <a href="/">1Pooja</a> and explore the services available for your spiritual needs.</p>
        `,
      },
    ],
  },
];

export const findStaticBlogByIdOrSlug = (
  idOrSlug?: string | number | null
): StaticBlog | undefined => {
  if (!idOrSlug) return undefined;
  const normalized = String(idOrSlug).trim().toLowerCase();
  return STATIC_BLOGS.find(
    (b) =>
      b.id.toLowerCase() === normalized || b.slug.toLowerCase() === normalized
  );
};

export const mergeWithStaticBlogs = (apiBlogs: any[]): any[] => {
  const safeApiBlogs = Array.isArray(apiBlogs) ? apiBlogs : [];
  const existingSlugs = new Set(
    safeApiBlogs
      .map((b) => String(b?.slug || b?.id || "").trim().toLowerCase())
      .filter(Boolean)
  );
  const existingTitles = new Set(
    safeApiBlogs
      .map((b) => String(b?.title || b?.heading || "").trim().toLowerCase())
      .filter(Boolean)
  );

  const missingStatic = STATIC_BLOGS.filter(
    (sb) =>
      !existingSlugs.has(sb.slug.toLowerCase()) &&
      !existingSlugs.has(sb.id.toLowerCase()) &&
      !existingTitles.has(sb.title.toLowerCase())
  );

  return [...missingStatic, ...safeApiBlogs];
};
