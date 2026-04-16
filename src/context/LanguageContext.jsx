import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    code: 'EN',
    flag: '🇮🇳',
    label: 'English',
    nav: {
      features: 'Features',
      howItWorks: 'How It Works',
      pricing: 'Pricing',
      about: 'About',
      requestDemo: 'Request Demo',
    },
    hero: {
      label: 'AgriTech Dealer Platform',
      headline: ['Manage Farmers.', 'Track Sales.', 'Grow Together.'],
      subtext: "India's most complete dealer management platform — farmer profiles, Udhaar tracking, AI crop advice, and QR IDs. Built for Bharat.",
      cta1: 'Request a Demo',
      cta2: 'Watch How It Works',
      trust: ['2,000+ Farmers Registered', '5 Languages', 'Made in India 🇮🇳'],
    },
    features: {
      label: 'Features',
      heading: 'Everything a dealer needs.',
      items: [
        { title: 'Farmer Registration & QR ID Cards', headline: 'Every farmer, one scan away.', body: 'Register farmers in under 2 minutes. Auto-generate QR-linked ID cards with crop history, credit limit, and contact details. Works offline — syncs when connected.' },
        { title: 'Field Visit Logging & AI Recommendations', headline: 'Log visits. Get instant crop advice.', body: 'Record every field visit with photos, GPS, and crop condition notes. AI Agronomist suggests the right product — fertilizer, pesticide, or seed — based on crop stage and soil type.' },
        { title: 'Udhaar & Credit Ledger', headline: 'No more notebook Khata.', body: 'Track credit, repayments, and overdue balances digitally. Auto-reminders for farmers. Full ledger history per account. Dealers recover 23% more credit on average.' },
        { title: 'Inventory & Stock Alerts', headline: 'Never run out of what sells.', body: 'Real-time stock tracking across product categories. Low stock alerts before you run out. Reorder suggestions based on seasonal demand patterns in your region.' },
        { title: 'Sales Analytics & Geographic Map', headline: 'See your business from above.', body: 'Revenue charts, collection rate, farmer growth trends — all in one dashboard. A live map shows where your farmers are, which villages are active, and where opportunity lies.' },
        { title: 'AI Agronomist Chat', headline: 'Expert crop advice. 5 languages.', body: 'Dealers and farmers ask crop questions in Hindi, Marathi, Gujarati, Rajasthani, or English. AI responds with specific product advice, dosage, and timing. No agri-degree needed.' },
      ]
    },
    stats: {
      heading: 'Trusted by dealers across rural India',
      items: [
        { label: 'Farmers Registered' },
        { label: 'Languages Supported' },
        { label: 'Dealer Satisfaction' },
        { label: 'Field Visits Logged' }
      ]
    },
    howItWorks: {
      label: 'Simple Setup',
      heading: 'Up and running in one afternoon.',
      steps: [
        { title: 'Register as Dealer', body: 'Sign up, verify your shop details, and get access to the full platform in minutes.' },
        { title: 'Onboard Your Farmers', body: 'Add farmer profiles, generate QR ID cards, and build your digital network.' },
        { title: 'Log Visits & Sales', body: 'Record field visits, log transactions, and get AI-powered crop advice.' },
        { title: 'Track Everything', body: 'Monitor credit, inventory, analytics, and grow your business with data.' },
      ],
    },
    pricing: {
      label: 'Simple Pricing',
      heading: 'Pick the plan that fits your shop.',
      subtext: 'No hidden charges. Cancel anytime. GST invoice provided.',
      plans: [
        { name: 'Basic', period: '/month', description: 'For small dealers just getting started.', cta: 'Get Started', features: ['Up to 100 farmers', 'Field visit logging', 'Basic Udhaar tracking', 'Inventory management', '1 staff account', 'Email support'] },
        { name: 'Premium', period: '/month', description: 'For growing dealers who want the full picture.', badge: 'Most Popular', cta: 'Start Free Trial', features: ['Unlimited farmers', 'AI Agronomist Chat (5 languages)', 'QR Farmer ID Cards', 'Advanced Analytics + Map', 'Up to 5 staff accounts', 'WhatsApp reminders', 'Priority support', 'Offline mode'] }
      ]
    },
    testimonials: {
      label: 'Dealer Stories',
      heading: 'From the fields of India.',
      items: [
        { quote: 'Pehle notebook mein sab likhna padta tha. Ab ek mobile se sab track ho jaata hai. Udhaar recover bhi zyada ho raha hai.', role: 'Fertilizer Dealer', location: 'Anand, Gujarat', tag: 'Udhaar Tracking' },
        { quote: 'AI ne ekdum sahi product suggest kiya for powdery mildew on grapes. Farmer was very happy. I was more confident recommending it.', role: 'Seed & Pesticide Dealer', location: 'Nashik, Maharashtra', tag: 'AI Agronomist' },
        { quote: 'QR card feature is very useful. Farmers show their card, I scan it, all their history comes up. No more searching in registers.', role: 'Agri Input Dealer', location: 'Ludhiana, Punjab', tag: 'QR ID Cards' },
        { quote: 'Rajasthani language support bahut achha laga. Ab mere farmers khud bhi AI se seedha baat kar sakte hain.', role: 'Krishi Kendra Owner', location: 'Jodhpur, Rajasthan', tag: '5 Languages' }
      ],
      trustLabels: ['🇮🇳 Made in India', '📶 Offline-First', '🔒 Data Secure', '🌾 Built for Bharat']
    },
    cta: {
      eyebrow: 'Ready to modernise your shop?',
      heading: 'Join 2,000+ dealers already on Prithvix.',
      subtext: 'Free 14-day trial. No credit card. Setup in one afternoon.',
      cta1: 'Request a Demo',
      cta2: 'Download on Play Store',
    },
    contact: {
      successHeading: 'Demo Request Sent!',
      successSubtext: 'Our team will contact you within 24 hours.',
      label: 'Request a Demo',
      heading: "Let's grow together.",
      subtext: 'Fill in your details and our team will set up a personalized demo.',
      fields: {
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone Number',
        shopName: 'Shop Name',
        location: 'Location',
        message: 'Message',
      },
      placeholders: {
        name: 'Ramesh Patel',
        email: 'ramesh@example.com',
        phone: '+91 98765 43210',
        shopName: 'Patel Krishi Kendra',
        location: 'Anand, Gujarat',
        message: 'Tell us about your shop...',
      },
      button: 'Request Demo',
      footer: "We'll never spam you. Read our Privacy Policy.",
    },
    footer: {
      tagline: 'Kisan ka saathi. Dealer ka software.',
      product: 'Product',
      productLinks: ['Features', 'Pricing', 'How It Works', 'Download App'],
      company: 'Company',
      companyLinks: ['About', 'Blog', 'Careers', 'Contact'],
      support: 'Support',
      supportLinks: ['Help Center', 'Privacy Policy', 'Terms of Use', 'GST Invoice'],
      copyright: '© 2025 Prithvix Technologies Pvt. Ltd.',
      madeIn: 'Made with ♥ in India',
    },
  },
  hi: {
    code: 'हिं',
    flag: '🇮🇳',
    label: 'हिन्दी',
    nav: {
      features: 'विशेषताएं',
      howItWorks: 'कैसे काम करता है',
      pricing: 'मूल्य',
      about: 'हमारे बारे में',
      requestDemo: 'डेमो अनुरोध',
    },
    hero: {
      label: 'एग्रीटेक डीलर प्लेटफॉर्म',
      headline: ['किसानों को संभालें।', 'बिक्री ट्रैक करें।', 'साथ मिलकर बढ़ें।'],
      subtext: 'भारत का सबसे पूरा डीलर मैनेजमेंट प्लेटफॉर्म — किसान प्रोफ़ाइल, उधार ट्रैकिंग, AI फसल सलाह, और QR ID। भारत के लिए बनाया गया।',
      cta1: 'डेमो अनुरोध करें',
      cta2: 'देखें कैसे काम करता है',
      trust: ['2,000+ किसान पंजीकृत', '5 भाषाएं', 'भारत में निर्मित 🇮🇳'],
    },
    features: {
      label: 'विशेषताएं',
      heading: 'एक डीलर को जो चाहिए।',
      items: [
        { title: 'किसान पंजीकरण और QR आईडी कार्ड', headline: 'हर किसान, बस एक स्कैन दूर।', body: 'किसानों को 2 मिनट से कम समय में पंजीकृत करें। फसल इतिहास, क्रेडिट सीमा और संपर्क विवरण के साथ ऑटो-जेनरेट QR-लिंक किए गए आईडी कार्ड। ऑफ़लाइन काम करता है — कनेक्ट होने पर सिंक हो जाता है।' },
        { title: 'फील्ड विजिट लॉगिंग और AI सिफारिशें', headline: 'विजिट लॉग करें। तुरंत फसल सलाह प्राप्त करें।', body: 'फ़ोटो, GPS और फसल की स्थिति के नोट्स के साथ प्रत्येक फील्ड विजिट को रिकॉर्ड करें। AI एग्रोनोमिस्ट फसल के चरण और मिट्टी के प्रकार के आधार पर सही उत्पाद — उर्वरक, कीटनाशक, या बीज — का सुझाव देता है।' },
        { title: 'उधार और क्रेडिट लेजर', headline: 'अब कोई नोटबुक खाता नहीं।', body: 'क्रेडिट, पुनर्भुगतान और अतिदेय शेष राशि को डिजिटल रूप से ट्रैक करें। किसानों के लिए ऑटो-रिमाइंडर। प्रति खाता पूर्ण लेजर इतिहास। डीलर औसतन 23% अधिक क्रेडिट वसूलते हैं।' },
        { title: 'इन्वेंटरी और स्टॉक अलर्ट', headline: 'जो बिकता है उसकी कमी कभी न हो।', body: 'उत्पाद श्रेणियों में रीयल-टाइम स्टॉक ट्रैकिंग। स्टॉक खत्म होने से पहले कम स्टॉक अलर्ट। आपके क्षेत्र में मौसमी मांग पैटर्न के आधार पर पुनः आदेश सुझाव।' },
        { title: 'बिक्री Analytics और भौगोलिक नक्शा', headline: 'अपने व्यापार को ऊपर से देखें।', body: 'राजस्व चार्ट, संग्रह दर, किसान वृद्धि के रुझान — सब एक ही डैशबोर्ड में। एक लाइव नक्शा दिखाता है कि आपके किसान कहाँ हैं, कौन से गाँव सक्रिय हैं, और अवसर कहाँ हैं।' },
        { title: 'AI एग्रोनोमिस्ट चैट', headline: 'विशेषज्ञ फसल सलाह। 5 भाषाएं।', body: 'डीलर और किसान हिंदी, मराठी, गुजराती, राजस्थानी या अंग्रेजी में फसल से जुड़े सवाल पूछते हैं। AI विशिष्ट उत्पाद सलाह, खुराक और समय के साथ जवाब देता है। किसी कृषि डिग्री की आवश्यकता नहीं है।' },
      ]
    },
    stats: {
      heading: 'ग्रामीण भारत के डीलरों द्वारा विश्वसनीय',
      items: [
        { label: 'किसान पंजीकृत' },
        { label: 'भाषाएं समर्थित' },
        { label: 'डीलर संतुष्टि' },
        { label: 'फील्ड विजिट लॉग किए गए' }
      ]
    },
    howItWorks: {
      label: 'सरल सेटअप',
      heading: 'एक दोपहर में शुरू करें।',
      steps: [
        { title: 'डीलर के रूप में पंजीकरण', body: 'साइन अप करें, अपनी दुकान की जानकारी सत्यापित करें।' },
        { title: 'अपने किसानों को जोड़ें', body: 'किसान प्रोफ़ाइल जोड़ें, QR ID कार्ड बनाएं।' },
        { title: 'विज़िट और बिक्री लॉग करें', body: 'फील्ड विज़िट रिकॉर्ड करें, AI फसल सलाह पाएं।' },
        { title: 'सब कुछ ट्रैक करें', body: 'क्रेडिट, इन्वेंट्री, एनालिटिक्स को ट्रैक करें।' },
      ],
    },
    pricing: {
      label: 'सरल मूल्य',
      heading: 'अपनी दुकान के लिए सही योजना चुनें।',
      subtext: 'कोई छिपे शुल्क नहीं। कभी भी रद्द करें। GST इनवॉइस।',
      plans: [
        { name: 'बेसिक', period: '/महीना', description: 'शुरुआत करने वाले छोटे डीलरों के लिए।', cta: 'शुरू करें', features: ['100 किसानों तक', 'फील्ड विजिट लॉगिंग', 'बेसिक उधार ट्रैकिंग', 'इन्वेंटरी प्रबंधन', '1 स्टाफ खाता', 'ईमेल सपोर्ट'] },
        { name: 'प्रीमियम', period: '/महीना', description: 'बढ़ते डीलरों के लिए जो पूरी तस्वीर चाहते हैं।', badge: 'सबसे लोकप्रिय', cta: 'मुफ्त ट्रायल शुरू करें', features: ['असीमित किसान', 'AI एग्रोनोमिस्ट चैट (5 भाषाएं)', 'QR किसान आईडी कार्ड', 'उन्नत एनालिटिक्स + मैप', '5 स्टाफ खाते तक', 'WhatsApp रिमाइंडर', 'प्राथमिकता सपोर्ट', 'ऑफ़लाइन मोड'] }
      ]
    },
    testimonials: {
      label: 'डीलर कहानियां',
      heading: 'भारत के खेतों से।',
      items: [
        { quote: 'पहले नोटबुक में सब लिखना पड़ता था। अब एक मोबाइल से सब ट्रैक हो जाता है। उधार रिकवर भी ज्यादा हो रहा है।', role: 'उर्वरक डीलर', location: 'आणंद, गुजरात', tag: 'उधार ट्रैकिंग' },
        { quote: 'AI ने अंगूर पर पाउडर फफूंदी के लिए एकदम सही उत्पाद का सुझाव दिया। किसान बहुत खुश था। मैं इसकी सिफारिश करने में अधिक आश्वस्त था।', role: 'बीज और कीटनाशक डीलर', location: 'नासिक, महाराष्ट्र', tag: 'AI एग्रोनोमिस्ट' },
        { quote: 'QR कार्ड फीचर बहुत उपयोगी है। किसान अपना कार्ड दिखाते हैं, मैं इसे स्कैन करता हूं, उनका सारा इतिहास आ जाता है। अब रजिस्टरों में खोजना नहीं पड़ता।', role: 'कृषि इनपुट डीलर', location: 'लुधियाना, पंजाब', tag: 'QR आईडी कार्ड' },
        { quote: 'राजस्थानी भाषा समर्थन बहुत अच्छा लगा। अब मेरे किसान खुद भी AI से सीधा बात कर सकते हैं।', role: 'कृषि केंद्र मालिक', location: 'जोधपुर, राजस्थान', tag: '5 भाषाएं' }
      ],
      trustLabels: ['🇮🇳 भारत में निर्मित', '📶 ऑफ़लाइन-फर्स्ट', '🔒 डेटा सुरक्षित', '🌾 भारत के लिए निर्मित']
    },
    cta: {
      eyebrow: 'अपनी दुकान को आधुनिक बनाने के लिए तैयार?',
      heading: '2,000+ डीलर पहले से Prithvix पर हैं।',
      subtext: '14 दिन का मुफ्त ट्रायल। क्रेडिट कार्ड नहीं चाहिए।',
      cta1: 'डेमो अनुरोध करें',
      cta2: 'Play Store से डाउनलोड करें',
    },
    contact: {
      successHeading: 'डेमो अनुरोध भेजा गया!',
      successSubtext: 'हमारी टीम 24 घंटों के भीतर आपसे संपर्क करेगी।',
      label: 'डेमो अनुरोध',
      heading: "आइए एक साथ बढ़ें।",
      subtext: 'अपना विवरण भरें और हमारी टीम एक व्यक्तिगत डेमो सेट करेगी।',
      fields: {
        name: 'पूरा नाम',
        email: 'ईमेल',
        phone: 'फ़ोन नंबर',
        shopName: 'दुकान का नाम',
        location: 'स्थान',
        message: 'संदेश',
      },
      placeholders: {
        name: 'रमेश पटेल',
        email: 'ramesh@example.com',
        phone: '+91 98765 43210',
        shopName: 'पटेल कृषि केंद्र',
        location: 'आणंद, गुजरात',
        message: 'अपनी दुकान के बारे में बताएं...',
      },
      button: 'डेमो अनुरोध',
      footer: "हम आपको कभी स्पैम नहीं करेंगे। हमारी गोपनीयता नीति पढ़ें।",
    },
    footer: {
      tagline: 'किसान का साथी। डीलर का सॉफ्टवेयर।',
      product: 'उत्पाद',
      productLinks: ['विशेषताएं', 'मूल्य', 'कैसे काम करता है', 'ऐप डाउनलोड करें'],
      company: 'कंपनी',
      companyLinks: ['हमारे बारे में', 'ब्लॉग', 'करियर', 'संपर्क'],
      support: 'सहायता',
      supportLinks: ['सहायता केंद्र', 'गोपनीयता नीति', 'उपयोग की शर्तें', 'GST इनवॉइस'],
      copyright: '© 2025 प्रिथविक्स टेक्नोलॉजीज प्रा. लिमिटेड',
      madeIn: 'भारत में ♥ से बनाया',
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = translations[lang];
  const switchLanguage = (newLang) => {
    if (translations[newLang]) setLang(newLang);
  };

  const languages = Object.keys(translations).map((key) => ({
    code: key,
    label: translations[key].label,
    display: translations[key].code,
    flag: translations[key].flag,
  }));

  return (
    <LanguageContext.Provider value={{ lang, t, switchLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
