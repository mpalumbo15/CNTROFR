// Single source of truth for route <-> view mapping and per-route SEO metadata.
// Imported by App.jsx (client) AND scripts/prerender.mjs (build-time, plain Node) --
// this is why it has zero React/JSX in it. Keep it that way so the prerender
// script can import it directly without a JSX transform.

// Maps URL paths <-> view state. /tools also encodes the active tab as a sub-path.
export const PATH_TO_VIEW = {
  "/": "home",
  "/mission": "mission",
  "/contact": "contact",
  "/privacy": "privacy",
  "/terms": "tos",
  "/tools": "tools",
  "/faq": "faq",
  "/blog": "blog",
  "/the-arsenal": "arsenal",
  "/blog/dealer-doc-fees-explained": "blog_doc_fees",
  "/blog/fi-products-decoded": "blog_fi",
  "/blog/how-to-negotiate-car-add-ons": "blog_addons",
  "/blog/car-shopper-vs-car-buyer": "blog_shopper",
  "/blog/fico-score-vs-credit-karma": "blog_credit_score",
  "/blog/lease-catch-22-turn-in-guide": "blog_lease",
  "/blog/finance-office-what-happens-while-you-wait": "blog_finance_wait",
};

export const VIEW_TO_PATH = {
  home: "/",
  mission: "/mission",
  contact: "/contact",
  privacy: "/privacy",
  faq: "/faq",
  tos: "/terms",
  tools: "/tools",
  blog: "/blog",
  arsenal: "/the-arsenal",
  blog_doc_fees: "/blog/dealer-doc-fees-explained",
  blog_fi: "/blog/fi-products-decoded",
  blog_addons: "/blog/how-to-negotiate-car-add-ons",
  blog_shopper: "/blog/car-shopper-vs-car-buyer",
  blog_credit_score: "/blog/fico-score-vs-credit-karma",
  blog_lease: "/blog/lease-catch-22-turn-in-guide",
  blog_finance_wait: "/blog/finance-office-what-happens-while-you-wait",
  admin: "/", // admin stays hidden, never reflected in URL
};

export const TAB_TO_SLUG = { deal:"deal-analyzer", fee:"fee-comparison", review:"review-purity", fi:"fi-decoder", addons:"add-on-fighter", guide:"counter-guide" };
export const SLUG_TO_TAB = Object.fromEntries(Object.entries(TAB_TO_SLUG).map(([k,v])=>[v,k]));

// Per-tool title/description -- keyed by tab id. Used instead of the generic
// PAGE_META.tools entry when view === "tools", so each of the 6 /tools/<slug>
// URLs has its own distinct <title>/description rather than all six sharing
// identical tags (which reads as near-duplicate content to crawlers).
export const TOOL_META = {
  deal: { title:"Free Car Deal Analyzer -- CNTROFR", desc:"Run your numbers -- price, fees, add-ons, financing -- through CNTROFR's free AI Deal Analyzer for an instant GO/NEGOTIATE/WALK verdict.", intro:"The Deal Analyzer runs your full deal -- vehicle price, fees, add-ons, and financing terms -- through CNTROFR's AI to return an instant GO, NEGOTIATE, or WALK verdict, plus the exact numbers that are out of line." },
  fee: { title:"Dealer Fee Comparison Tool -- CNTROFR", desc:"Compare a dealer's quoted fees against typical and state-legal ranges. Spot inflated doc fees before you sign.", intro:"Fee Comparison checks a dealership's quoted doc fee and other charges against typical and state-legal ranges, so you know immediately whether a fee is normal or padded." },
  review: { title:"Review Purity -- Dealer Review Checker -- CNTROFR", desc:"Screen dealer reviews for authenticity and corporate-group sales patterns before you commit to a store.", intro:"Review Purity screens a dealership's online reviews for authenticity and, for corporate-owned stores, flags reported group-wide sales and F&I patterns worth knowing before you walk in." },
  fi: { title:"F&I Decoder -- Finance Office Product Checker -- CNTROFR", desc:"Decode VSCs, GAP, and F&I add-ons -- real dealer cost vs. what you're quoted, plus your cancellation rights.", intro:"The F&I Decoder explains any finance-office product you're offered -- what it actually costs the dealer, what it's worth to you, and your real cancellation window -- before you say yes in the box." },
  addons: { title:"Add-On Fighter -- CNTROFR", desc:"Identify pre-installed dealer add-ons and their real market value, with word-for-word scripts to negotiate or remove them.", intro:"Add-On Fighter identifies pre-installed dealer add-ons, tells you what they're really worth, and gives you word-for-word scripts to negotiate the price down or have them removed." },
  guide: { title:"Counter Guide -- Word-for-Word Negotiation Scripts -- CNTROFR", desc:"Get exact word-for-word counter scripts for every stage of the deal, from first offer to F&I office.", intro:"Counter Guide gives you exact word-for-word scripts for every stage of a car deal -- from the first offer on the lot to the products presented in the F&I office." },
};

export const PAGE_META = {
  home: { title:"CNTROFR -- AI Car Deal Analyzer & Pocket Consultant", desc:"CNTROFR: the AI deal analyzer that exposes dealer markups, fees, and add-ons -- built by an F&I insider. Don't sign. Counter." },
  tools: { title:"Free Deal Analyzer & Tools -- CNTROFR", desc:"Run your deal through CNTROFR's AI tools -- Deal Analyzer, Fee Comparison, Review Purity, F&I Decoder, and Add-On Fighter." },
  arsenal: { title:"What Each Tool Actually Does -- CNTROFR", desc:"A full breakdown of CNTROFR's six tools -- Quote Scanner, Deal Analyzer, Fee Comparison, Review Purity, F&I Decoder, and Add-On Fighter -- and exactly what each one catches.", intro:"A full breakdown of every CNTROFR tool -- Quote Scanner, Deal Analyzer, Fee Comparison, Review Purity, F&I Decoder, and Add-On Fighter -- and exactly what each one catches before you sign." },
  mission: { title:"Our Mission -- CNTROFR", desc:"CNTROFR was built by an automotive insider to give car buyers the same playbook dealers use. Zero dealer kickbacks. Ever.", intro:"CNTROFR was built by an automotive insider to give car buyers the same playbook dealerships use internally. Zero dealer, lender, or manufacturer kickbacks -- ever." },
  blog: { title:"Car Buying Guides & Resources -- CNTROFR", desc:"Expert car buying guides from a certified automotive insider. Doc fees, F&I products, add-on tactics, and everything dealers hope you never learn.", intro:"Expert car-buying guides from a certified automotive insider -- doc fees, F&I products, add-on tactics, and everything dealers hope you never learn." },
  blog_doc_fees: { title:"What Is a Dealer Doc Fee — And Is Yours Too High? | CNTROFR", desc:"Doc fees vary wildly by state and dealer. Here's what's normal, what's inflated, and exactly how to use a high doc fee as leverage on your vehicle price." },
  blog_fi: { title:"Every F&I Product Decoded — Dealer Cost vs. What You Pay | CNTROFR", desc:"Finance office products decoded by a certified F&I insider. What each product actually costs the dealer, what it's genuinely worth to you, and how to negotiate it fairly if you want it." },
  blog_addons: { title:"How to Negotiate Dealer Add-Ons (And Remove the Ones You Don't Want) | CNTROFR", desc:"Dealers pre-install add-ons hoping you'll just pay. Here's how to identify force adds, what they're actually worth, and word-for-word scripts to remove them." },
  blog_shopper: { title:"Car Shopper vs. Car Buyer — Which One Are You? | CNTROFR", desc:"The most expensive car mistake isn't overpaying. It's overpaying for the wrong car. Know your driving habits, match your vehicle to your life, and walk in ready to buy — not browse." },
  blog_credit_score: { title:"FICO Auto Score vs. Credit Karma — Why Your Score Isn't What the Dealer Sees | CNTROFR", desc:"Credit Karma shows a VantageScore. Most auto lenders pull a FICO Auto Score instead. The gap can be 20-40+ points -- here's why, and how to know your real number before you sit down to negotiate." },
  blog_lease: { title:"The Lease Catch-22s Nobody Explains (Plus Your Full Turn-In Playbook) | CNTROFR", desc:"Leasing gets sold as the simple option. Here's what actually happens at turn-in -- excess wear, mileage overages, the insurance claim decision, lease-end protection, and why CNTROFR doesn't analyze lease deals." },
  blog_finance_wait: { title:"What's Actually Happening While You're Waiting for the Finance Office | CNTROFR", desc:"That wait isn't nothing. Here's what's really happening back there -- why some paperwork still needs a wet-ink signature, and the four things being worked on while you wait it out." },
  contact: { title:"Contact -- CNTROFR", desc:"Get in touch with the CNTROFR team." },
  privacy: { title:"Privacy Policy -- CNTROFR", desc:"CNTROFR's privacy policy. We never sell your data or refer you to dealers." },
  tos: { title:"Terms of Use -- CNTROFR", desc:"Terms of use for CNTROFR's car deal analysis tools." },
  faq: { title:"FAQ & Resources -- CNTROFR", desc:"Everything you need to know about car buying, dealer tactics, and how CNTROFR works as your pocket consultant." },
  admin: { title:"CNTROFR", desc:"" },
};
