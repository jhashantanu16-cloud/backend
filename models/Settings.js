const mongoose = require('mongoose');

const socialLinksSchema = new mongoose.Schema(
  {
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  { _id: false }
);

const navItemSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Work' },
    href: { type: String, default: '#work' },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Scroll-Stop Visuals' },
    description: { type: String, default: 'Short-form AI video built for the first 1.5 seconds of a feed.' },
    details: { type: String, default: '' },
    includes: { type: [String], default: [] },
  },
  { _id: false }
);

const workSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Reel 01' },
    video: { type: String, default: '' },
    tag: { type: String, default: 'AI Ad' },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Starter' },
    price: { type: String, default: '$499' },
    description: { type: String, default: '2 AI ads' },
    popular: { type: Boolean, default: false },
    features: [{ type: String, default: '' }],
  },
  { _id: false }
);

const processStepSchema = new mongoose.Schema(
  {
    number: { type: String, default: '01' },
    title: { type: String, default: 'Discovery' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    value: { type: String, default: '250+' },
    label: { type: String, default: 'Ads Produced' },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Motion Franzy' },
    siteTitle: { type: String, default: 'Motion Franzy — AI Ads Agency' },
    siteDescription: { type: String, default: 'AI-powered advertising studio for beauty, cosmetics and ecommerce brands.' },
    logo: { type: Object, default: { url: '' } },
    favicon: { type: Object, default: { url: '' } },
    header: {
      navItems: { type: [navItemSchema], default: [
        { label: 'Work', href: '#work' },
        { label: 'Services', href: '#services' },
        { label: 'Process', href: '#process' },
        { label: 'Pricing', href: '#pricing' }
      ] },
      ctaText: { type: String, default: "Let's Talk" },
      ctaLink: { type: String, default: '#contact' },
    },
    heroSection: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: 'ADS BUILT TO STOP THE SCROLL.' },
      accent: { type: String, default: 'STOP THE SCROLL.' },
      subtitle: { type: String, default: 'Motion Franzy turns product photos into scroll-stopping AI video ads — built for cosmetic & beauty brands, founders and the marketers who grow them.' },
      ctaText: { type: String, default: 'See the Work' },
      ctaLink: { type: String, default: '#work' },
      heroVideo: { type: String, default: '' },
      backgroundOpacity: { type: Number, default: 1, min: 0, max: 1 },
      backgroundVideos: { type: [String], default: [] },
      backgroundSlides: { type: [String], default: [] },
      badgeText: { type: String, default: 'AI-MADE' },
      badgeValue: { type: String, default: '100%' },
      badgeSub: { type: String, default: 'NO CREW' },
    },
    brand: {
      primaryColor: { type: String, default: '#ED2A22' },
      accentColor: { type: String, default: '#FFC72C' },
      darkColor: { type: String, default: '#0A0A0A' },
      paperColor: { type: String, default: '#F3F1EA' },
      logoText: { type: String, default: 'MOTION FRANZY' },
      logoTag: { type: String, default: '/ AI ADS' },
    },
    contentBlocks: {
      heroEyebrow: { type: String, default: 'AI Advertising Studio' },
      heroSecondaryCta: { type: String, default: 'Start a Project' },
      marqueeItems: { type: [String], default: ['BUILT FOR META ADS', 'INSTAGRAM REELS', 'YOUTUBE SHORTS', 'GOOGLE ADS FORMATS', 'ECOMMERCE BRANDS'] },
      introTitle: { type: String, default: 'NOT JUST VIDEOS, A GROWTH ENGINE.' },
      introSubtitle: { type: String, default: 'Every reel is built to earn attention in the first second and convert by the last frame.' },
      introLinkText: { type: String, default: 'View Full Portfolio' },
      servicesKicker: { type: String, default: 'What We Do' },
      servicesTitle: { type: String, default: 'Smart Creative For Bold Brands.' },
      servicesDescription: { type: String, default: "We combine AI production with ad strategy to build creative that's engineered to perform, not just look good." },
      serviceLinkText: { type: String, default: 'Learn More' },
      services: { type: [serviceSchema], default: [
        { title: 'Scroll-Stop Visuals', description: 'Short-form AI video built for the first 1.5 seconds of a feed.', details: 'Short-form video built for the first second of a feed. We design the opening frame, the motion, and the line of text so someone scrolling actually stops.', includes: ['Thumb-stopping opening frame', 'Vertical cut for Reels and Shorts', 'On-screen hook in the first second', 'A version you can run as an ad'] },
        { title: 'Product Commercials', description: 'Studio-grade hero shots and product films — no physical shoot needed.', details: 'Studio-style product films without booking a studio. We build hero shots, pack close-ups, and a simple story around the product you already sell.', includes: ['Hero and detail shots of the product', 'Lighting and background matched to the brand', '15s and 30s commercial cuts', 'Clean exports for site and paid social'] },
        { title: 'Full Advertising', description: 'Creative built and paired for Meta & Instagram ad campaigns.', details: 'Creative and media thinking in one pass. We pair the film with the campaign it is meant to run in, including the hook, the audience, and the placement.', includes: ['Campaign concept, not just a clip', 'Meta and Instagram cutdowns', 'Primary text and headline suggestions', 'A launch-ready file set'] },
        { title: 'Ad Variant Testing', description: 'Multiple AI-generated hooks and cuts, built to find your winning ad fast.', details: 'One ad is a guess. We produce several hooks and cuts from the same brief so you can see which opening, offer, or length actually wins.', includes: ['3 or more hook variants', 'Same offer, different openings', 'Cuts labeled for your ad account', 'A short note on what each variant tests'] }
      ] },
      workTitle: { type: String, default: 'Real Reels, Real Brands.' },
      workKicker: { type: String, default: 'Selected Work' },
      workVideos: { type: [workSchema], default: [
        { title: 'Reel 01', video: 'https://drive.google.com/file/d/1t8Pa7sulJI0naaUZri_DgQSkKoqelGdN/preview', tag: 'AI Ad' },
        { title: 'Reel 02', video: 'https://drive.google.com/file/d/1gHorDzFkLBJo7OHGEcaWMzCvh_Jff2X3/preview', tag: 'AI Ad' },
        { title: 'Reel 03', video: 'https://drive.google.com/file/d/1b0K5NKnQ_EUiqlnVg0nuG4ZRiVbjZsmg/preview', tag: 'AI Ad' }
      ] },
      pricingTitle: { type: String, default: 'Flexible Plans For Every Brand.' },
      pricingKicker: { type: String, default: 'Pricing' },
      pricingButtonText: { type: String, default: 'Choose Plan' },
      pricingSuffix: { type: String, default: '/mo' },
      pricingPlans: { type: [planSchema], default: [
        { name: 'Starter', price: '$499', description: '2 AI ad videos', features: ['2 AI ad videos', '1 revision round', 'Meta-ready formats'] },
        { name: 'Growth', price: '$999', description: '5 AI ad videos', popular: true, features: ['5 AI ad videos', 'Ad variant testing', 'Priority turnaround'] },
        { name: 'Scale', price: '$1999', description: 'Unlimited ad videos', features: ['Unlimited ad videos', 'Dedicated strategist', 'Full campaign support'] }
      ] },
      ctaTitle: { type: String, default: "Let's Create Ads People Can't Scroll Past." },
      ctaSubtitle: { type: String, default: 'Send us your product — we\'ll come back with a free sample scroll-stop visual.' },
      ctaPrimary: { type: String, default: 'Start a Project' },
      ctaSecondary: { type: String, default: 'Get a Free Sample' },
      processKicker: { type: String, default: 'How We Work' },
      processTitle: { type: String, default: 'Our Proven Process.' },
      processSteps: { type: [processStepSchema], default: [
        { number: '01', title: 'Discovery', description: 'Product, audience and current ad performance.' },
        { number: '02', title: 'Concept', description: '2–3 creative directions, storyboarded first.' },
        { number: '03', title: 'Production', description: 'AI-generated visuals, built fast, refined on feedback.' },
        { number: '04', title: 'Launch', description: 'Delivered ad-ready, with variants for testing.' }
      ] },
      stats: { type: [statSchema], default: [
        { value: '250+', label: 'Ads Produced' },
        { value: '30+', label: 'Brands Served' },
        { value: '3x', label: 'Faster Turnaround' },
        { value: '98%', label: 'Client Satisfaction' }
      ] },
    },
    footer: {
      companyName: { type: String, default: 'Motion Franzy' },
      description: { type: String, default: 'AI ads and creative systems built for modern brands.' },
      footerText: { type: String, default: '© 2026 Motion Franzy. All rights reserved.' },
      socialLinks: { type: socialLinksSchema, default: () => ({}) },
    },
    contactSection: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Let's Talk." },
      email: { type: String, default: 'shantanujha16@gmail.com' },
      phone: { type: String, default: '+1 (555) 123-4567' },
      address: { type: String, default: 'San Francisco, CA' },
      hours: { type: String, default: 'Monday – Friday: 9am – 6pm PT\nSaturday – Sunday: By appointment' },
      formTitle: { type: String, default: 'Send us a message' },
    },
    colors: {
      primary: { type: String, default: '#ED2A22' },
      secondary: { type: String, default: '#FFC72C' },
      dark: { type: String, default: '#0A0A0A' },
      light: { type: String, default: '#F3F1EA' },
    },
    maintenance: {
      enabled: { type: Boolean, default: false },
      message: { type: String, default: 'We are updating the site. Please check back soon.' },
    },
    seo: {
      metaTitle: { type: String, default: 'Motion Franzy — AI Ads Agency' },
      metaDescription: { type: String, default: 'AI-powered advertising studio for beauty, cosmetics and ecommerce brands.' },
      keywords: { type: String, default: 'AI ads, growth, branding, creative agency' },
      ogImage: { type: String, default: '' },
    },
    marketing: {
      announcement: {
        enabled: { type: Boolean, default: true },
        text: { type: String, default: 'New brands get a free sample reel this month.' },
        linkLabel: { type: String, default: 'Claim yours' },
        link: { type: String, default: '#contact' },
      },
      offer: {
        enabled: { type: Boolean, default: true },
        badge: { type: String, default: 'Launch offer' },
        title: { type: String, default: 'Your first concept is on us.' },
        detail: { type: String, default: 'Tell us about the product. We reply with one scroll-stop concept before you pick a plan.' },
      },
      testimonials: {
        type: [{
          quote: { type: String, default: '' },
          name: { type: String, default: '' },
          role: { type: String, default: '' },
          result: { type: String, default: '' },
        }],
        default: [],
      },
      tracking: {
        googleAnalyticsId: { type: String, default: '' },
        metaPixelId: { type: String, default: '' },
      },
    },
    media: {
      heroVideo: { type: String, default: 'https://drive.google.com/file/d/1t8Pa7sulJI0naaUZri_DgQSkKoqelGdN/preview' },
      showcaseVideos: { type: [String], default: [
        'https://drive.google.com/file/d/1gHorDzFkLBJo7OHGEcaWMzCvh_Jff2X3/preview',
        'https://drive.google.com/file/d/1b0K5NKnQ_EUiqlnVg0nuG4ZRiVbjZsmg/preview',
        'https://drive.google.com/file/d/1gRIuNYKVTv5Yn9bAbLsHkSrwWUrgzHIH/preview'
      ] },
      workVideos: { type: [String], default: [
        'https://drive.google.com/file/d/1t8Pa7sulJI0naaUZri_DgQSkKoqelGdN/preview',
        'https://drive.google.com/file/d/1gHorDzFkLBJo7OHGEcaWMzCvh_Jff2X3/preview',
        'https://drive.google.com/file/d/1b0K5NKnQ_EUiqlnVg0nuG4ZRiVbjZsmg/preview',
        'https://drive.google.com/file/d/1gRIuNYKVTv5Yn9bAbLsHkSrwWUrgzHIH/preview',
        'https://drive.google.com/file/d/1ierWyORY9wELq6CxmZjLKcf1bpJNssq0/preview'
      ] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
