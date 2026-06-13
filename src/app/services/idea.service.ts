import { Injectable, signal, inject } from '@angular/core';
import { Idea, IdeaCategory } from '../models/idea.model';
import { AuthService } from './auth.service';

const MOCK_IDEAS: Idea[] = [
  {
    id: 'idea1',
    title: 'AI Pantry Chef: Smart Recipe Suggestions from Your Fridge',
    category: 'tech',
    price: 299,
    previewDescription:
      'An app that scans your pantry/fridge via camera and suggests personalized recipes using AI, reducing food waste and saving time on meal planning.',
    fullDescription:
      'Full implementation blueprint: Use computer vision (YOLO/MobileNet) for ingredient detection. Backend in FastAPI + PostgreSQL. Monetize via premium recipe packs and sponsored ingredients. Partnerships with grocery delivery APIs (Instacart, etc.) for one-click ingredient ordering. Users set dietary preferences, allergies, and budget constraints. B2C app + B2B white-label for smart fridge manufacturers. MVP cost estimate: ~$40K. TAM: $5B food tech market.',
    tags: ['AI', 'food', 'ML', 'sustainability'],
    sellerId: 'user1',
    sellerName: 'Alex Kim',
    sellerAvatar: 'AK',
    buyerId: 'user3',
    status: 'sold',
    rating: 4.9,
    reviewCount: 3,
    createdAt: new Date('2025-03-10'),
    coverEmoji: '🍳',
    viewCount: 342,
  },
  {
    id: 'idea2',
    title: 'SkillSwap: Trade Your Expertise Without Money',
    category: 'social',
    price: 189,
    previewDescription:
      'A barter platform where professionals exchange skills — a developer trades 5 hours of coding for 5 hours of graphic design. Time-backed credits, no money involved.',
    fullDescription:
      'Full business model: Time-credit system (1 credit = 1 hour). Skill verification badges via portfolio + peer endorsements. Dispute resolution via community moderators. Revenue model: premium listings, featured profiles, enterprise team subscriptions ($49/mo). Cold start: partner with freelancer communities on Reddit and LinkedIn. App + web platform. Legal considerations for service exchange regulations by region. Expected CAC: $8. LTV: $200+.',
    tags: ['marketplace', 'skills', 'barter', 'freelance'],
    sellerId: 'user1',
    sellerName: 'Alex Kim',
    sellerAvatar: 'AK',
    status: 'available',
    rating: 4.7,
    reviewCount: 5,
    createdAt: new Date('2025-04-02'),
    coverEmoji: '🤝',
    viewCount: 218,
  },
  {
    id: 'idea3',
    title: 'Dialect.io: Gamified Learning for Regional Languages',
    category: 'education',
    price: 249,
    previewDescription:
      'Duolingo-style app focused exclusively on endangered dialects and regional languages. Partner with UNESCO and local cultural organizations for content authenticity.',
    fullDescription:
      'Complete go-to-market strategy: Target diaspora communities — first-gen immigrants wanting to teach kids their heritage language. Revenue via subscriptions ($9.99/mo) + government cultural preservation grants. Content creation: partner with native speakers as paid contributors (revenue share model). Gamification: streak system, regional leaderboards, cultural trivia cards. Launch with 5-10 languages based on diaspora population in English-speaking countries. Estimated Y1 revenue: $800K.',
    tags: ['EdTech', 'language', 'culture', 'gamification'],
    sellerId: 'user2',
    sellerName: 'Sara Chen',
    sellerAvatar: 'SC',
    buyerId: 'user1',
    status: 'sold',
    rating: 4.8,
    reviewCount: 4,
    createdAt: new Date('2025-02-28'),
    coverEmoji: '🗣️',
    viewCount: 456,
  },
  {
    id: 'idea4',
    title: 'RentMyGear: Camera & Studio Equipment Rental P2P',
    category: 'business',
    price: 399,
    previewDescription:
      'AirBnB for creative equipment. Photographers and filmmakers rent out their gear when not in use. Insurance built-in, instant booking system.',
    fullDescription:
      'Full business plan: Insurance partnership to cover damage/theft via micro-insurance per rental. Verification system for lenders/renters. Dynamic pricing based on demand and equipment age. Revenue: 15% transaction fee. Launch strategy: target photography clubs, film schools. Categories: cameras, lenses, drones, audio gear, lighting, studio backdrops. Trust & safety: ID verification, damage deposit, bidirectional review system. Break-even at 500 monthly transactions.',
    tags: ['rental', 'photography', 'P2P', 'marketplace'],
    sellerId: 'user2',
    sellerName: 'Sara Chen',
    sellerAvatar: 'SC',
    buyerId: 'user3',
    status: 'sold',
    rating: 4.6,
    reviewCount: 6,
    createdAt: new Date('2025-01-15'),
    coverEmoji: '📷',
    viewCount: 589,
  },
  {
    id: 'idea5',
    title: 'PlantTrade: Rare Plant Cuttings Social Marketplace',
    category: 'social',
    price: 149,
    previewDescription:
      'Instagram meets eBay for rare plant enthusiasts. Trade, sell, or gift cuttings. Live plant care streams from expert growers included.',
    fullDescription:
      'Niche but passionate community: 50M+ plant enthusiasts on social media. Monetization: listing fees, premium subscription ($4.99/mo), live stream tips. Shipping guidelines for live plants with per-country compliance tools. Partner with USDA for international trade regulations. Community: grow journals, AI-powered plant problem diagnosis (photo to diagnosis), local meetup groups. Seasonal campaigns: spring propagation season, holiday gift bundles. CAC: $3 via organic social.',
    tags: ['plants', 'community', 'marketplace', 'social'],
    sellerId: 'user1',
    sellerName: 'Alex Kim',
    sellerAvatar: 'AK',
    status: 'available',
    rating: 4.5,
    reviewCount: 7,
    createdAt: new Date('2025-04-20'),
    coverEmoji: '🌿',
    viewCount: 175,
  },
  {
    id: 'idea6',
    title: 'MindCheck: AI Companion for Daily Mental Wellness',
    category: 'health',
    price: 599,
    previewDescription:
      'Daily 2-minute emotional check-ins with an AI companion. Tracks mood trends, suggests micro-interventions, and knows when to escalate to real therapists.',
    fullDescription:
      'Technical architecture: LLM-powered conversational AI fine-tuned for CBT/DBT techniques. HIPAA-compliant data storage with end-to-end encryption. Freemium: free daily check-ins, paid tier ($12.99/mo) includes trend analytics, journal export, therapist referral network. Emergency escalation: detect crisis signals (NLP) and surface hotline resources. B2B path: sell to employers as mental health benefit at $8/employee/mo. Insurance channel: reduce claims via preventative care. Regulatory pathway included.',
    tags: ['mental health', 'AI', 'wellness', 'B2B'],
    sellerId: 'user2',
    sellerName: 'Sara Chen',
    sellerAvatar: 'SC',
    status: 'available',
    rating: 4.9,
    reviewCount: 9,
    createdAt: new Date('2025-03-05'),
    coverEmoji: '🧠',
    viewCount: 721,
  },
  {
    id: 'idea7',
    title: 'SoundDrop: Original Music Samples NFT Marketplace',
    category: 'creative',
    price: 199,
    previewDescription:
      'Buy, sell, and license original music loops and samples as NFTs. Producers own their sounds, artists get trackable royalties on every single use.',
    fullDescription:
      'Smart contract architecture: ERC-1155 tokens for multi-use license tiers. Royalty splits: 80% creator, 15% platform, 5% reseller on secondary market. Curated weekly drops for high-profile producers to drive hype. DAW integrations: Ableton, FL Studio, Logic plugins for direct import. Streaming oracle: auto-trigger royalty payments when sample detected on Spotify/Apple. Governance token for community curation votes. Legal framework: IP assignment and licensing agreement templates included.',
    tags: ['music', 'NFT', 'Web3', 'creative'],
    sellerId: 'user2',
    sellerName: 'Sara Chen',
    sellerAvatar: 'SC',
    buyerId: 'user1',
    status: 'sold',
    rating: 4.4,
    reviewCount: 3,
    createdAt: new Date('2025-02-10'),
    coverEmoji: '🎵',
    viewCount: 298,
  },
  {
    id: 'idea8',
    title: 'ParkShare: Neighborhood Driveway Micro-Rental',
    category: 'social',
    price: 179,
    previewDescription:
      "Rent out your driveway by the hour when you're away. Solves urban parking nightmares while generating passive income for homeowners.",
    fullDescription:
      'Execution playbook: IoT-enabled smart lock integration for unattended access (optional hardware tier). Google Maps API for real-time slot availability. Dynamic surge pricing during events. Revenue: 20% commission. Legal: city-by-city parking regulation compliance checklist included. Launch cities: NYC, SF, Chicago, London. HOA-friendly compliance templates. Insurance add-on for property damage ($0.50/rental). Average earning: $200-500/month per driveway. Break-even: 2,000 registered spots.',
    tags: ['parking', 'sharing economy', 'passive income', 'urban'],
    sellerId: 'user1',
    sellerName: 'Alex Kim',
    sellerAvatar: 'AK',
    status: 'available',
    rating: 4.3,
    reviewCount: 4,
    createdAt: new Date('2025-05-01'),
    coverEmoji: '🚗',
    viewCount: 203,
  },
  {
    id: 'idea9',
    title: 'InternBridge: Micro-Internship Platform for High Schoolers',
    category: 'education',
    price: 349,
    previewDescription:
      '2-4 week micro-internships matching high school students with startups. No experience needed. Startups get eager talent, students get real-world exposure.',
    fullDescription:
      'Platform design: Student profile (interests, skills, grade, location). Company profile (culture, project type, supervision commitment). AI matching algorithm based on interests + commute/remote preference. Revenue: $50 per successful placement from companies. School partnership API for academic credit integration. Legal: work permit compliance for minors per U.S. state included. Safety: background checks for supervisors, parental consent flow. Impact tracking: college admissions outcome correlation dashboard.',
    tags: ['education', 'internship', 'students', 'startups'],
    sellerId: 'user2',
    sellerName: 'Sara Chen',
    sellerAvatar: 'SC',
    status: 'available',
    rating: 4.7,
    reviewCount: 6,
    createdAt: new Date('2025-03-18'),
    coverEmoji: '🎓',
    viewCount: 412,
  },
  {
    id: 'idea10',
    title: 'StyleCycle: Sustainable Fashion Swap App',
    category: 'creative',
    price: 129,
    previewDescription:
      'Swap your unused clothes with others nearby. Tinder-style swipe interface. Each swap earns green points redeemable for eco-brand discounts.',
    fullDescription:
      'Feature set: Wardrobe inventory with AI-powered photo tagging. Smart matching by size, style, brand preferences. Swap proposals + multi-item negotiation flow. Shipping label auto-generation or local pickup map. Green points gamification with partner brand redemption. Revenue: premium membership ($7.99/mo for unlimited swaps) + eco-brand ad placements. Thrift store overstock partnership channel. Impact dashboard: CO2 saved, water conserved per swap. Viral mechanic: "30-day no-buy challenge" community events.',
    tags: ['fashion', 'sustainability', 'swap', 'eco'],
    sellerId: 'user1',
    sellerName: 'Alex Kim',
    sellerAvatar: 'AK',
    status: 'available',
    rating: 4.6,
    reviewCount: 8,
    createdAt: new Date('2025-05-12'),
    coverEmoji: '👗',
    viewCount: 267,
  },
  {
    id: 'idea11',
    title: 'DreamTale: AI-Personalized Bedtime Stories for Kids',
    category: 'tech',
    price: 449,
    previewDescription:
      "Parents fill in a form about their child (name, favorite animals, fears, heroes) and an AI generates a unique 10-minute bedtime story narrated by a chosen voice.",
    fullDescription:
      'Tech stack: GPT-4 with custom prompt templates for child-safe story generation. ElevenLabs for voice synthesis with celebrity voice licensing strategy included. Story library builds over time — saved, shareable, replayable. Sibling mode: weave multiple children into same narrative. Revenue: subscription ($12.99/mo) + one-time story pack purchases. B2B: hospital pediatric wards, daycare centers ($200/yr license). Brand partnerships: Disney/Pixar character licensing roadmap. Story generation cost: ~$0.04 each. Projected margin: 78%.',
    tags: ['AI', 'kids', 'parenting', 'storytelling'],
    sellerId: 'user2',
    sellerName: 'Sara Chen',
    sellerAvatar: 'SC',
    status: 'available',
    rating: 4.8,
    reviewCount: 11,
    createdAt: new Date('2025-04-08'),
    coverEmoji: '🌙',
    viewCount: 634,
  },
  {
    id: 'idea12',
    title: 'FlowSpace: Virtual Co-Working for Freelancers',
    category: 'business',
    price: 299,
    previewDescription:
      'A virtual office where remote freelancers can "be at work" together. Ambient sounds, presence indicators, focus timers, and a coffee-chat roulette feature.',
    fullDescription:
      'Core features: Virtual rooms (focused work, casual, brainstorming). Pomodoro timer synced across roommates for accountability. Status indicators (available, deep work, break). Drop-in video/audio chat. Procedurally generated ambient soundscapes. Revenue: freemium — free public rooms up to 5 people, paid team rooms ($15/mo/team). Integrations: Slack, Notion, Google Calendar. Community events: weekly virtual coworking meetups, skill-share sessions. Target market: 40M global freelancers. Competitor analysis and differentiation matrix included.',
    tags: ['remote work', 'freelance', 'productivity', 'community'],
    sellerId: 'user1',
    sellerName: 'Alex Kim',
    sellerAvatar: 'AK',
    status: 'available',
    rating: 4.5,
    reviewCount: 7,
    createdAt: new Date('2025-05-22'),
    coverEmoji: '💻',
    viewCount: 389,
  },
];

@Injectable({ providedIn: 'root' })
export class IdeaService {
  private authService = inject(AuthService);
  private _ideas = signal<Idea[]>(MOCK_IDEAS);
  readonly ideas = this._ideas.asReadonly();

  getById(id: string): Idea | undefined {
    return this._ideas().find((i) => i.id === id);
  }

  getBySellerId(sellerId: string): Idea[] {
    return this._ideas().filter((i) => i.sellerId === sellerId);
  }

  search(
    term: string = '',
    category: IdeaCategory | 'all' = 'all',
    sort: 'latest' | 'price-asc' | 'price-desc' | 'rating' = 'latest',
    showAll = true
  ): Idea[] {
    let result = this._ideas();

    if (!showAll) {
      result = result.filter((i) => i.status === 'available');
    }

    if (term.trim()) {
      const t = term.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(t) ||
          i.previewDescription.toLowerCase().includes(t) ||
          i.tags.some((tag) => tag.toLowerCase().includes(t))
      );
    }

    if (category !== 'all') {
      result = result.filter((i) => i.category === category);
    }

    const sorted = [...result];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
    }
  }

  createIdea(
    data: Omit<
      Idea,
      'id' | 'status' | 'rating' | 'reviewCount' | 'createdAt' | 'viewCount'
    >
  ): Idea {
    const newIdea: Idea = {
      ...data,
      id: 'idea_' + Date.now(),
      status: 'available',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      viewCount: 0,
    };
    this._ideas.update((ideas) => [...ideas, newIdea]);
    const user = this.authService.currentUser();
    if (user) {
      this.authService.updateCurrentUser({
        listedIdeaIds: [...user.listedIdeaIds, newIdea.id],
      });
    }
    return newIdea;
  }

  purchaseIdea(ideaId: string): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    const idea = this.getById(ideaId);
    if (!idea || idea.status !== 'available') return false;
    if (idea.sellerId === user.id) return false;

    this._ideas.update((ideas) =>
      ideas.map((i) =>
        i.id === ideaId ? { ...i, status: 'sold', buyerId: user.id } : i
      )
    );
    this.authService.updateCurrentUser({
      purchasedIdeaIds: [...user.purchasedIdeaIds, ideaId],
      totalSpent: user.totalSpent + idea.price,
    });
    return true;
  }

  hasPurchased(ideaId: string): boolean {
    const user = this.authService.currentUser();
    return user?.purchasedIdeaIds.includes(ideaId) ?? false;
  }

  isOwnIdea(ideaId: string): boolean {
    const user = this.authService.currentUser();
    return user?.listedIdeaIds.includes(ideaId) ?? false;
  }

  updateRating(ideaId: string, newRating: number, newCount: number): void {
    this._ideas.update((ideas) =>
      ideas.map((i) =>
        i.id === ideaId ? { ...i, rating: newRating, reviewCount: newCount } : i
      )
    );
  }
}
