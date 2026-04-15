import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { Building2, Calendar, DollarSign, Users, TrendingUp, MapPin, ExternalLink, ChevronDown, Globe, Zap, Shield, BookOpen, ArrowRight, ArrowDown, Check, X, AlertTriangle, BarChart3, Calculator, Home, Newspaper, Clock, Star, ChevronRight } from "lucide-react";

// ─── Design Tokens ───
const C = {
  bg: "#0a0a0f",
  surface: "#111118",
  surfaceAlt: "#16161f",
  border: "#1e1e2a",
  borderHover: "#2a2a3a",
  text: "#e4e4ef",
  textMuted: "#8888a0",
  accent: "#3b82f6",
  accentDim: "#1e3a5f",
  green: "#22c55e",
  greenDim: "#0a2e1a",
  red: "#ef4444",
  redDim: "#2e0a0a",
  amber: "#f59e0b",
  amberDim: "#2e1f0a",
  purple: "#a855f7",
};

// ─── Nav Items ───
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "calculator", label: "Calculator", icon: Calculator },
  { id: "casestudies", label: "Case Studies", icon: Globe },
  { id: "offices", label: "Office Listings", icon: Building2 },
  { id: "proposal", label: "Proposal", icon: Newspaper },
];

// ─── City Data for Calculator ───
const CITIES = {
  bangkok: { name: "Bangkok", rentSqm: 10, devSalary: 2250, costIndex: 40, flag: "TH" },
  hcmc: { name: "Ho Chi Minh City", rentSqm: 12, devSalary: 1800, costIndex: 35, flag: "VN" },
  dubai: { name: "Dubai", rentSqm: 45, devSalary: 5500, costIndex: 62, flag: "AE" },
  singapore: { name: "Singapore", rentSqm: 120, devSalary: 7500, costIndex: 81, flag: "SG" },
  tokyo: { name: "Tokyo", rentSqm: 43, devSalary: 5000, costIndex: 70, flag: "JP" },
  hongkong: { name: "Hong Kong", rentSqm: 95, devSalary: 6500, costIndex: 76, flag: "HK" },
  berlin: { name: "Berlin", rentSqm: 30, devSalary: 5000, costIndex: 65, flag: "DE" },
};

// ─── Office Listings Data (curated, real research) ───
const OFFICE_LISTINGS = {
  bangkok: [
    {
      name: "Kronos Sathorn Tower",
      area: "Sathorn",
      size: "200-400 sqm",
      pricePerSqm: 900,
      currency: "THB",
      transit: "Chong Nonsi BTS (2 min)",
      grade: "A",
      features: ["24/7 access", "Meeting rooms", "Fiber internet"],
      url: "https://www.ddproperty.com/en/office-space-for-rent/in-sathorn-th1003",
      thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
      monthlyEst: "$7,500",
      source: "DDProperty",
    },
    {
      name: "Liberty Square",
      area: "Silom",
      size: "130-400 sqm",
      pricePerSqm: 680,
      currency: "THB",
      transit: "Sala Daeng BTS (3 min)",
      grade: "B+",
      features: ["Renovated interiors", "Event space", "Affordable CBD"],
      url: "https://www.ddproperty.com/en/office-space-for-rent/in-silom-th100402",
      thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
      monthlyEst: "$5,667",
      source: "DDProperty",
    },
    {
      name: "Renovated Shophouse, Krungthonburi",
      area: "Riverside",
      size: "220 sqm",
      pricePerSqm: 350,
      currency: "THB",
      transit: "Krungthonburi BTS (200m)",
      grade: "Renovated",
      features: ["Full renovation", "Character building", "Lowest cost"],
      url: "https://www.ddproperty.com/en/office-space-for-rent/in-bangkok-th10",
      thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
      monthlyEst: "$2,916",
      source: "DDProperty",
    },
    {
      name: "Exchange Tower",
      area: "Sukhumvit / Asok",
      size: "150-500 sqm",
      pricePerSqm: 1200,
      currency: "THB",
      transit: "Asok BTS (1 min)",
      grade: "A+",
      features: ["Premium finishes", "Conference facilities", "Parking"],
      url: "https://www.ddproperty.com/en/office-space-for-rent/in-watthana-th1039",
      thumbnail: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=250&fit=crop",
      monthlyEst: "$10,000",
      source: "DDProperty",
    },
  ],
  hcmc: [
    {
      name: "Deutsches Haus",
      area: "District 1",
      size: "200-500 sqm",
      pricePerSqm: 62,
      currency: "USD",
      transit: "Central D1 location",
      grade: "A (LEED Platinum)",
      features: ["LEED Platinum", "Premium CBD", "Multinational tenants"],
      url: "https://maisonoffice.vn/en/ho-chi-minh/",
      thumbnail: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=250&fit=crop",
      monthlyEst: "$18,600",
      source: "Maison Office",
    },
    {
      name: "Dreamplex Ngo Quang Huy",
      area: "District 2 / Thao Dien",
      size: "Coworking + Private",
      pricePerSqm: 18,
      currency: "USD",
      transit: "Thao Dien area",
      grade: "Coworking",
      features: ["Community events", "Rooftop", "F&B on-site"],
      url: "https://dreamplex.co/en/the-10-best-coworking-spaces-in-district-2/",
      thumbnail: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=250&fit=crop",
      monthlyEst: "$5,400",
      source: "Dreamplex",
    },
    {
      name: "The Hive Thao Dien",
      area: "District 2 / Thao Dien",
      size: "Flexible 50-300 sqm",
      pricePerSqm: 22,
      currency: "USD",
      transit: "Thao Dien Ward",
      grade: "Coworking",
      features: ["Rooftop meeting rooms", "50-60 capacity events", "Expat community"],
      url: "https://www.workthere.com/spaces/the-hive-thao-dien/",
      thumbnail: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=250&fit=crop",
      monthlyEst: "$6,600",
      source: "Workthere",
    },
    {
      name: "CBD Fringe Office, Binh Thanh",
      area: "Binh Thanh District",
      size: "200-400 sqm",
      pricePerSqm: 15,
      currency: "USD",
      transit: "Near D1, metro access",
      grade: "B+",
      features: ["New development", "Metro adjacent", "5-10x cheaper than D1 CBD"],
      url: "https://www.cushmanwakefield.com/en/vietnam/insights/ho-chi-minh-city-marketbeat/office-marketbeat",
      thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
      monthlyEst: "$4,500",
      source: "Cushman & Wakefield",
    },
  ],
  dubai: [
    {
      name: "JLT Cluster Office",
      area: "Jumeirah Lake Towers",
      size: "200-400 sqm",
      pricePerSqm: 27,
      currency: "USD",
      transit: "DMCC Metro (3 min)",
      grade: "B+",
      features: ["Free zone benefits", "Lake views", "Budget-friendly"],
      url: "https://www.propertyfinder.ae/en/commercial-rent/dubai/offices-for-rent.html",
      thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop",
      monthlyEst: "$8,100",
      source: "PropertyFinder",
    },
    {
      name: "Business Bay Tower Office",
      area: "Business Bay",
      size: "150-350 sqm",
      pricePerSqm: 52,
      currency: "USD",
      transit: "Business Bay Metro (5 min)",
      grade: "A",
      features: ["Canal views", "Premium lobby", "New towers"],
      url: "https://www.drivenproperties.com/dubai/properties-for-rent/office",
      thumbnail: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=250&fit=crop",
      monthlyEst: "$15,600",
      source: "Driven Properties",
    },
    {
      name: "DIFC Gate District",
      area: "DIFC",
      size: "200-500 sqm",
      pricePerSqm: 85,
      currency: "USD",
      transit: "Financial Centre Metro (2 min)",
      grade: "A+",
      features: ["Financial free zone", "Premium address", "Networking hub"],
      url: "https://dubaiofficefinder.com/cost-of-renting-an-office-in-dubai-2025/",
      thumbnail: "https://images.unsplash.com/photo-1582407947092-ff6f4089c5b0?w=400&h=250&fit=crop",
      monthlyEst: "$25,500",
      source: "Dubai Office Finder",
    },
    {
      name: "Sheikh Zayed Road Office",
      area: "Sheikh Zayed Road",
      size: "200-600 sqm",
      pricePerSqm: 33,
      currency: "USD",
      transit: "Multiple metro stations",
      grade: "B+",
      features: ["Iconic location", "High visibility", "Softening market"],
      url: "https://www.engelvoelkers.com/ae/en/resources/office-rental-prices-dubai",
      thumbnail: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=400&h=250&fit=crop",
      monthlyEst: "$9,900",
      source: "Engel & Volkers",
    },
  ],
  singapore: [
    {
      name: "100AM (Tanjong Pagar)",
      area: "Tanjong Pagar",
      size: "200-400 sqm",
      pricePerSqm: 91,
      currency: "USD",
      transit: "Tanjong Pagar MRT (2 min)",
      grade: "B+",
      features: ["Value CBD option", "Retail amenities", "Tech district"],
      url: "https://officefinder.com.sg/office-location/tanjong-pagar/",
      thumbnail: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=250&fit=crop",
      monthlyEst: "$27,300",
      source: "OfficeFinder SG",
    },
    {
      name: "Frasers Tower",
      area: "Tanjong Pagar / CBD",
      size: "200-500 sqm",
      pricePerSqm: 120,
      currency: "USD",
      transit: "Tanjong Pagar MRT (3 min)",
      grade: "A",
      features: ["Green Mark Platinum", "Premium lobby", "F&B podium"],
      url: "https://www.cushmanwakefield.com/en/singapore/properties/singapore/office-for-rent-singapore",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      monthlyEst: "$36,000",
      source: "Cushman & Wakefield",
    },
    {
      name: "Guoco Tower",
      area: "Tanjong Pagar",
      size: "200-600 sqm",
      pricePerSqm: 130,
      currency: "USD",
      transit: "Tanjong Pagar MRT (direct)",
      grade: "A+",
      features: ["Tallest in Tanjong Pagar", "Premium amenities", "Direct MRT access"],
      url: "https://officespaces.com.sg/singapore-office-rental-rates-guide/",
      thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=250&fit=crop",
      monthlyEst: "$39,000",
      source: "OfficeSpaces SG",
    },
    {
      name: "One-North Business Park",
      area: "One-North / Buona Vista",
      size: "200-400 sqm",
      pricePerSqm: 68,
      currency: "USD",
      transit: "One-North MRT (5 min)",
      grade: "B+",
      features: ["Tech/biomedical hub", "Lower rent vs CBD", "Innovation cluster"],
      url: "https://statrys.com/guides/singapore/office-rental",
      thumbnail: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=250&fit=crop",
      monthlyEst: "$20,400",
      source: "Statrys",
    },
  ],
  tokyo: [
    {
      name: "Shibuya Scramble Square Area",
      area: "Shibuya",
      size: "150-300 sqm",
      pricePerSqm: 55,
      currency: "USD",
      transit: "Shibuya Station (3 min)",
      grade: "A",
      features: ["Tech startup hub", "Young demographic", "High foot traffic"],
      url: "https://www.coworkingcafe.com/office-space/jp/tokyo/shibuya/",
      thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop",
      monthlyEst: "$16,500",
      source: "CoworkingCafe",
    },
    {
      name: "Tri-Seven Roppongi",
      area: "Roppongi / Minato",
      size: "200-400 sqm",
      pricePerSqm: 60,
      currency: "USD",
      transit: "Roppongi Station (2 min)",
      grade: "A",
      features: ["5-star fit-out", "Boardroom", "Coworking lounge"],
      url: "https://www.servcorp.co.jp/en/locations/tokyo/tri-seven-roppongi/",
      thumbnail: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=250&fit=crop",
      monthlyEst: "$18,000",
      source: "Servcorp",
    },
    {
      name: "Shinjuku Maynds Tower",
      area: "Shinjuku",
      size: "200-500 sqm",
      pricePerSqm: 38,
      currency: "USD",
      transit: "Shinjuku Station (5 min)",
      grade: "B+",
      features: ["Major transit hub", "Large floorplates", "Value pricing"],
      url: "https://rentofficetoday.com/en/city/offices-in-tokyo/",
      thumbnail: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&h=250&fit=crop",
      monthlyEst: "$11,400",
      source: "RentOfficeToday",
    },
    {
      name: "Nakameguro Area Office",
      area: "Meguro",
      size: "150-250 sqm",
      pricePerSqm: 30,
      currency: "USD",
      transit: "Nakameguro Station (4 min)",
      grade: "B",
      features: ["Creative district", "Cafes & lifestyle", "Lower rent"],
      url: "https://www.kencorp.com/offices/",
      thumbnail: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=400&h=250&fit=crop",
      monthlyEst: "$9,000",
      source: "Ken Corporation",
    },
  ],
  hongkong: [
    {
      name: "Kwun Tong Industrial Office",
      area: "Kwun Tong",
      size: "200-400 sqm",
      pricePerSqm: 31,
      currency: "USD",
      transit: "Kwun Tong MTR (5 min)",
      grade: "Industrial/B",
      features: ["Wide floorplates", "Affordable", "Growing tech area"],
      url: "https://hongkongoffices.com/en",
      thumbnail: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&h=250&fit=crop",
      monthlyEst: "$9,300",
      source: "HK Offices",
    },
    {
      name: "Wan Chai Furnished Office",
      area: "Wan Chai",
      size: "150-300 sqm",
      pricePerSqm: 55,
      currency: "USD",
      transit: "Wan Chai MTR (3 min)",
      grade: "B+",
      features: ["Furnished", "City views", "20-30% below Central"],
      url: "https://www.cbdofficehk.com/",
      thumbnail: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=250&fit=crop",
      monthlyEst: "$16,500",
      source: "CBD Office HK",
    },
    {
      name: "Central Grade A Tower",
      area: "Central",
      size: "200-500 sqm",
      pricePerSqm: 170,
      currency: "USD",
      transit: "Central MTR (2 min)",
      grade: "A+",
      features: ["Premium address", "Harbour views", "Global HQ standard"],
      url: "https://www.colliers.com/en-hk/services/office-services/top-offices-in-hong-kong",
      thumbnail: "https://images.unsplash.com/photo-1532009877282-3340270e0529?w=400&h=250&fit=crop",
      monthlyEst: "$51,000",
      source: "Colliers",
    },
    {
      name: "Cheung Sha Wan Office",
      area: "Cheung Sha Wan",
      size: "200-500 sqm",
      pricePerSqm: 22,
      currency: "USD",
      transit: "Lai Chi Kok MTR (5 min)",
      grade: "Industrial/B",
      features: ["Lowest HK option", "Large spaces", "Improving area"],
      url: "https://www.oneday.com.hk/en_US/commercial/",
      thumbnail: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&h=250&fit=crop",
      monthlyEst: "$6,600",
      source: "OneDay",
    },
  ],
};

// ─── Case Studies Data ───
const CASE_STUDIES = {
  superteam: {
    name: "Solana Superteam Shipyard",
    location: "Bangalore, India",
    status: "Active",
    statusColor: C.green,
    funding: "Solana Foundation",
    cost: "~$200-400K/yr",
    model: "Application-based, free for accepted builders. 24/7 access. Structured weekly rituals including 'Locked-In Wednesdays' for deep work and 'Shipping Saturdays' for demo days.",
    works: ["Application-based access creates quality filter", "Structured weekly rituals drive output", "Free access means quality of work is the only filter", "Similar cost structure to Bangkok ($1,500-3,000/mo dev salaries)"],
    lessons: "The Shipyard proves that a builder-focused permanent space in a low-cost city can become the flagship community asset for an entire ecosystem. Bangkok has identical cost advantages.",
    references: [
      { label: "Superteam Website", url: "https://superteam.fun/" },
      { label: "Shipyard Announcement", url: "https://x.com/SuperteamDAO" },
    ],
  },
  fullnode: {
    name: "Full Node Berlin",
    location: "Kreuzberg, Berlin",
    status: "7+ years running",
    statusColor: C.green,
    funding: "Self-sustaining (memberships + events)",
    cost: "~$1M initial buildout, ~EUR 15-25K/mo ops",
    model: "1,000 sqm blockchain-focused coworking with 20+ resident companies. Chain-agnostic positioning. Hot desks from EUR 150/mo, dedicated desks EUR 250-300/mo.",
    works: ["Survived two full bear markets (2018, 2022)", "Hybrid revenue model: memberships + event rentals", "Chain-agnostic approach maximizes occupancy", "Berlin's low rent by European capital standards"],
    lessons: "Full Node's 7+ year track record is the strongest proof point for permanent blockchain spaces. A comparable buildout in Bangkok would cost $20-50K vs. $1M, making economics dramatically more favorable.",
    references: [
      { label: "Full Node Website", url: "https://www.fullnode.berlin/" },
      { label: "Full Node on Twitter", url: "https://x.com/fullaboratory" },
    ],
  },
  near: {
    name: "NEAR Protocol Regional Hubs",
    location: "Global (Ukraine, Kenya, Asia, Balkans)",
    status: "Scaled back",
    statusColor: C.amber,
    funding: "NEAR Foundation (~$33M total)",
    cost: "$5-11M per hub",
    model: "Four regional hubs with independent legal entities and local leadership. Two models: Education-First (Ukraine, Kenya) and Product Lab (Asia, Balkans).",
    works: ["Ukraine hub became one of the most productive dev communities", "Kenya hub created genuine blockchain education infrastructure", "Independent entity model allowed fast adaptation"],
    mistakes: ["$33M distributed with accountability gaps", "Bear market forced budget cuts", "Some hubs underperformed relative to budgets", "Governance complexity made course-correction difficult"],
    lessons: "Education-first hubs produced more measurable impact per dollar than product-lab hubs. The Bangkok hub's education component aligns with the higher-ROI model. At 200K-2.8M ADA, the budget is dramatically more conservative than NEAR's $5-11M per hub.",
    references: [
      { label: "NEAR Hub Program", url: "https://near.org/ecosystem" },
      { label: "NEAR Foundation Blog", url: "https://near.foundation/blog" },
    ],
  },
  empiredao: {
    name: "EmpireDAO",
    location: "Manhattan, New York",
    status: "CLOSED after 4 months",
    statusColor: C.red,
    funding: "Crowdfunding (failed: $8,100 of $260K needed)",
    cost: "~$30-50K/mo burn rate",
    model: "DAO-structured Web3 coworking in Manhattan. Attempted to crowdfund operating costs through NFT sales. Launched September 2022, deep in the bear market.",
    works: [],
    mistakes: ["Bear market launch: community demoralized and underfunded", "Manhattan costs: $15-25K/mo rent alone", "Crowdfunding is not a business model for fixed costs", "DAO governance too slow for facilities management", "No anchor tenant or foundation backing"],
    lessons: "EmpireDAO is the strongest warning against (1) crowdfunding for fixed costs, (2) launching in an expensive city without secured funding, and (3) using DAO governance for physical operations. Bangkok at $8-12/sqm is 10-20x cheaper. The Catalyst/treasury funding model secures runway upfront.",
    references: [
      { label: "EmpireDAO Post-Mortem (Mirror)", url: "https://mirror.xyz/empiredao.eth" },
    ],
  },
  polygon: {
    name: "Polygon Builder Houses",
    location: "Rotating (Bangalore, Lisbon, Dubai)",
    status: "Active",
    statusColor: C.green,
    funding: "Polygon Labs",
    cost: "Variable per program",
    model: "2-4 week residential builder programs. Builders live and work together in rented houses. Each cohort expected to ship a working product. Supplemented by volunteer 'Guilds' in cities worldwide.",
    works: ["Intensity produces results: deep focus for 2-4 weeks", "No permanent lease risk", "Guilds scale cheaply with volunteers"],
    mistakes: ["No continuity between programs", "No permanent enterprise touchpoint", "Guild quality varies wildly"],
    lessons: "Builder Houses are a great complement to permanent spaces, not a replacement. The Bangkok hub could host similar 2-4 week residency programs while maintaining year-round operations.",
    references: [
      { label: "Polygon Village", url: "https://polygon.technology/community" },
    ],
  },
  sui: {
    name: "Sui Vietnam Community",
    location: "Ho Chi Minh City, Vietnam",
    status: "Active (no permanent space)",
    statusColor: C.amber,
    funding: "Sui Foundation grants",
    cost: "$500-2K per event",
    model: "Community program without a dedicated space. Events hosted at The Hive Thao Dien coworking. 'BUIDL Station Saturday' sessions. Regular meetups with 50-150 attendees.",
    works: ["Vietnam's crypto adoption provides large engaged audience", "Low event costs in HCMC", "Strong local community leaders"],
    mistakes: ["No permanent space means no daily builder presence", "Engagement is event-dependent, drops between events", "No infrastructure for enterprise demos"],
    lessons: "Sui Vietnam shows what community-only (no physical hub) looks like: strong events, but no continuity between them. The Bangkok hub fills exactly this gap.",
    references: [
      { label: "Sui Vietnam Twitter", url: "https://x.com/SuiVietnam" },
      { label: "The Hive Thao Dien", url: "https://thehive.com.vn/" },
    ],
  },
};

// ─── Reusable Components ───

function Nav({ active, setActive }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10,10,15,0.92)", backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 20px",
        display: "flex", alignItems: "center", gap: 0,
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        <button onClick={() => setActive("overview")} style={{
          fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em",
          color: C.accent, marginRight: 32, flexShrink: 0,
          padding: "16px 0", fontFamily: "'JetBrains Mono', monospace",
          background: "none", border: "none", cursor: "pointer",
        }}>
          cardanospaces
        </button>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              padding: "14px 16px", background: "none", border: "none",
              color: isActive ? C.accent : C.textMuted,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              cursor: "pointer", whiteSpace: "nowrap", position: "relative",
              display: "flex", alignItems: "center", gap: 6,
              borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
              transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function StatCard({ value, label, color = C.text, bg = C.surface }) {
  return (
    <div style={{
      background: bg, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: "20px 16px", textAlign: "center",
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

function Section({ title, subtitle, children, id, action }) {
  return (
    <section id={id} style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: subtitle ? 0 : 16 }}>
        {title && <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{title}</h2>}
        {action}
      </div>
      {subtitle && <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28, maxWidth: 640, lineHeight: 1.6 }}>{subtitle}</p>}
      {children}
    </section>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: 0 }} />;
}

function TabBar({ tabs, active, setActive }) {
  return (
    <div style={{ display: "flex", gap: 4, background: C.surfaceAlt, borderRadius: 8, padding: 4, marginBottom: 24, overflowX: "auto" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{
          padding: "8px 16px", border: "none", borderRadius: 6,
          background: active === t.id ? C.accent : "transparent",
          color: active === t.id ? "#fff" : C.textMuted,
          fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
          transition: "all 0.15s",
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function DeeperLink({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
      background: C.accentDim + "44", border: `1px solid ${C.accent}33`,
      color: C.accent, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
    }}>
      {label} <ChevronRight size={14} />
    </button>
  );
}

function ComparisonCard({ title, cost, color, items, negative }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: 24, borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>{cost}</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
          {negative
            ? <X size={14} color={C.red} style={{ marginTop: 2, flexShrink: 0 }} />
            : <Check size={14} color={C.green} style={{ marginTop: 2, flexShrink: 0 }} />}
          <span style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Mini Calculator (for homepage) ───
function MiniCalculator() {
  const [adaPrice, setAdaPrice] = useState(0.26);
  const [hubCity, setHubCity] = useState("bangkok");

  const city = CITIES[hubCity];
  const summitADA = 14076539;
  const summitUSD = summitADA * adaPrice;
  const hubAnnualRent = city.rentSqm * 300 * 12;
  const hubAnnualStaff = city.devSalary * 4 * 12;
  const hubAnnualOps = hubAnnualRent * 0.3;
  const hubAnnualTotal = hubAnnualRent + hubAnnualStaff + hubAnnualOps;
  const hubTotalCost = hubAnnualTotal * 3 + 50000;
  const yearsFromSummit = Math.floor(summitUSD / hubAnnualTotal);
  const hubsFromSummit = Math.floor(summitUSD / hubTotalCost);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>
            ADA Price: <span style={{ color: C.accent, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>${adaPrice.toFixed(2)}</span>
          </label>
          <input type="range" min={0.05} max={3} step={0.01} value={adaPrice}
            onChange={e => setAdaPrice(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: C.accent }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>Hub City</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {Object.entries(CITIES).slice(0, 5).map(([key, c]) => (
              <button key={key} onClick={() => setHubCity(key)} style={{
                padding: "4px 10px", borderRadius: 4, fontSize: 11, border: "none",
                background: hubCity === key ? C.accent : C.surfaceAlt,
                color: hubCity === key ? "#fff" : C.textMuted,
                cursor: "pointer", fontWeight: 500,
              }}>{c.name.split(" ")[0]}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div style={{ background: C.redDim + "44", borderRadius: 8, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.textMuted }}>Summit Cost</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>
            ${(summitUSD / 1e6).toFixed(1)}M
          </div>
        </div>
        <div style={{ background: C.greenDim + "44", borderRadius: 8, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.textMuted }}>Hub 3yr ({city.name.split(" ")[0]})</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.green, fontFamily: "'JetBrains Mono', monospace" }}>
            ${(hubTotalCost / 1e6).toFixed(2)}M
          </div>
        </div>
        <div style={{ background: C.accentDim + "44", borderRadius: 8, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.textMuted }}>Hubs from Summit ADA</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.accent, fontFamily: "'JetBrains Mono', monospace" }}>
            {hubsFromSummit}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 10, background: C.surfaceAlt, borderRadius: 6 }}>
        <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>
          At ${adaPrice.toFixed(2)}/ADA, the summit's 14M ADA could fund a {city.name} hub for <strong style={{ color: C.accent }}>{yearsFromSummit} years</strong>, or <strong style={{ color: C.accent }}>{hubsFromSummit} hubs</strong> across Asia for 3 years each.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// OVERVIEW PAGE (Homepage - carries the whole site)
// ═══════════════════════════════════════════════
function OverviewPage({ setActivePage }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero */}
      <div style={{
        minHeight: 420, display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", textAlign: "center", padding: "60px 20px",
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C.accentDim}44, transparent)`,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: C.accent,
          textTransform: "uppercase", marginBottom: 16,
          fontFamily: "'JetBrains Mono', monospace",
        }}>Independent Community Research</div>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: C.text,
          lineHeight: 1.1, maxWidth: 720, marginBottom: 20,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Permanent spaces beat<br />pop-up events.
        </h1>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
          The Cardano Foundation and EMURGO are requesting 14,076,539 ADA ($3.66M) from the treasury for 4 days in Singapore. Here is what that money could build instead.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => scrollTo("home-analysis")}
            style={{
              padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: C.surfaceAlt, border: `1px solid ${C.border}`,
              color: C.text, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
            Summit Budget Analysis <ArrowDown size={14} />
          </button>
          <button onClick={() => scrollTo("home-calculator")}
            style={{
              padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: C.accent, border: "none", color: "#fff", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
            Cost Calculator <Calculator size={14} />
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <Section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <StatCard value="47%" label="of Summit budget: venue and logistics" color={C.red} bg={C.redDim + "44"} />
          <StatCard value="$700K" label="paid to TOKEN2049 organizers, exits ecosystem" color={C.red} bg={C.redDim + "44"} />
          <StatCard value="1.5%" label="of budget funds the hackathon ($54,830)" color={C.amber} bg={C.amberDim + "44"} />
          <StatCard value="7%" label="of hackathon projects survive 6 months" color={C.amber} bg={C.amberDim + "44"} />
        </div>
      </Section>

      <Divider />

      {/* The 14M ADA Question */}
      <Section id="home-analysis" title="The 14M ADA Question" subtitle="What the community gets for $3.66 million over 4 days vs. what that same capital could build."
        action={<DeeperLink label="Full Budget Analysis" onClick={() => setActivePage("analysis")} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <ComparisonCard
            title="Singapore Summit (4 days)"
            cost="14,076,539 ADA"
            color={C.red}
            items={[
              "800-1,200 attendees for 2 days",
              "No permanent infrastructure after",
              "Revenue covers ~15% of costs",
              "$1.83M per surviving hackathon project",
              "No published post-event ROI data",
            ]}
            negative
          />
          <ComparisonCard
            title="Bangkok Hub (3 years)"
            cost="2,800,000 ADA"
            color={C.green}
            items={[
              "365 days/year of community access",
              "500+ developers trained over 3 years",
              "Permanent Midnight Center of Excellence",
              "30-50% self-sustaining by Year 3",
              "First permanent Cardano space in ASEAN",
            ]}
          />
        </div>
      </Section>

      <Divider />

      {/* Ecosystem Comparison Summary */}
      <Section title="How Other Chains Compare" subtitle="Cardano's summit costs significantly more per developer engaged than comparable ecosystem events."
        action={<DeeperLink label="Full Comparison" onClick={() => setActivePage("analysis")} />}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: C.surface, borderRadius: 12, overflow: "hidden" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ textAlign: "left", padding: "12px 14px", color: C.textMuted, fontWeight: 500 }}>Event</th>
                <th style={{ textAlign: "right", padding: "12px 14px", color: C.textMuted, fontWeight: 500 }}>Cost</th>
                <th style={{ textAlign: "right", padding: "12px 14px", color: C.textMuted, fontWeight: 500 }}>Duration</th>
                <th style={{ textAlign: "right", padding: "12px 14px", color: C.textMuted, fontWeight: 500 }}>Cost/Dev</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Cardano Summit 2026", cost: "$3.66M", duration: "4 days", costDev: "$18,300", color: C.red },
                { name: "Bangkok Hub (3yr)", cost: "$700K", duration: "1,095 days", costDev: "$1,400", color: C.green },
                { name: "ETHGlobal Bangkok", cost: "~$400K", duration: "3 days", costDev: "$114", color: C.purple },
                { name: "Solana Breakpoint", cost: "~$2M", duration: "4 days", costDev: "$500", color: C.amber },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 14px", color: row.color, fontWeight: 600 }}>{row.name}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{row.cost}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: C.textMuted }}>{row.duration}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{row.costDev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Divider />

      {/* Interactive Calculator on Homepage */}
      <Section id="home-calculator" title="Cost Comparison Calculator" subtitle="Adjust ADA price and city to see how far the summit's 14M ADA stretches."
        action={<DeeperLink label="Full Calculator" onClick={() => setActivePage("calculator")} />}>
        <MiniCalculator />
      </Section>

      <Divider />

      {/* Why Bangkok */}
      <Section title="Why Bangkok" subtitle="A permanent Cardano/Midnight hub delivers more community value per ADA than any conference.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {[
            { icon: Shield, title: "Tax-Free Crypto", desc: "Thailand offers 5-year capital gains exemption through 2029. 400+ registered crypto companies. Active SEC sandbox." },
            { icon: DollarSign, title: "5-10x Cheaper", desc: "Bangkok office: $8-12/sqm/mo vs. Singapore $70-130. Same regional access, a fraction of the cost." },
            { icon: Zap, title: "Midnight Ready", desc: "Midnight mainnet is live. A Bangkok hub becomes ASEAN's center of excellence for privacy-preserving smart contracts." },
            { icon: Building2, title: "Proven Model", desc: "Cardano runs hubs across Latin America. Full Node Berlin: 7+ years. The permanent space model works." },
            { icon: Users, title: "13.7x Engagement", desc: "30 daily members = 10,950 person-days/year. Over 3 years: 32,850 vs. the Summit's 2,400." },
            { icon: TrendingUp, title: "Self-Sustaining", desc: "Coworking memberships, event rentals, corporate training. Target 50%+ self-sustaining by Year 3." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: 20,
              }}>
                <Icon size={18} color={C.accent} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Divider />

      {/* 7% Problem */}
      <Section title="The 7% Problem" subtitle="Research on 11,889 hackathon events: only 7% of projects show any activity 6 months later.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
          <StatCard value="$1.83M" label="per surviving Summit hackathon project" color={C.red} bg={C.redDim + "44"} />
          <StatCard value="365" label="days/year of hub mentorship and support" color={C.green} bg={C.greenDim + "44"} />
          <StatCard value="~2" label="surviving projects from 30 submissions at 7%" color={C.amber} bg={C.amberDim + "44"} />
        </div>
        <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, maxWidth: 640 }}>
          Long-term project survival requires ongoing mentorship, skill diversity, and sustained technical support. A hub provides all three. A 2-day conference provides none.
        </p>
      </Section>

      <Divider />

      {/* Case Studies Preview */}
      <Section title="Lessons from Other Ecosystems" subtitle="Six case studies of blockchain spaces that succeeded or failed -- and what Cardano can learn."
        action={<DeeperLink label="All Case Studies" onClick={() => setActivePage("casestudies")} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {[
            { key: "superteam", color: C.green },
            { key: "fullnode", color: C.green },
            { key: "empiredao", color: C.red },
          ].map(({ key, color }) => {
            const cs = CASE_STUDIES[key];
            return (
              <div key={key} onClick={() => setActivePage("casestudies")} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: 20, cursor: "pointer", transition: "border-color 0.2s",
                borderLeft: `3px solid ${color}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{cs.name}</span>
                  <span style={{ fontSize: 10, color: cs.statusColor, background: cs.statusColor + "18", padding: "3px 8px", borderRadius: 12 }}>{cs.status}</span>
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{cs.location} // {cs.cost}</div>
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>{cs.lessons.slice(0, 120)}...</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Divider />

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "64px 20px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 12 }}>
          Rent attention for 4 days,<br />or build presence that lasts?
        </h2>
        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
          Explore the full research, budget analysis, and alternative proposal across the tabs.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://gov.tools/governance_actions/bd91fa7ea9b4e09f76cbde3abb0b564ffc60b27e18af464ccec9bef9c718d087#0"
            target="_blank" rel="noopener" style={{
              padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: C.surfaceAlt, border: `1px solid ${C.border}`,
              color: C.text, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>View Summit Proposal on gov.tools <ExternalLink size={14} /></a>
          <button onClick={() => setActivePage("proposal")} style={{
            padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: C.accent, border: "none", color: "#fff", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>Read the Hub Proposal <ArrowRight size={14} /></button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// ANALYSIS PAGE
// ═══════════════════════════════════════════════
function AnalysisPage() {
  const [tab, setTab] = useState("budget");

  const budgetData = [
    { name: "Venue & Logistics", value: 1320000, color: C.red },
    { name: "TOKEN2049 Fee", value: 699900, color: "#dc2626" },
    { name: "Staffing & Mgmt", value: 400000, color: C.amber },
    { name: "Marketing", value: 340000, color: "#f97316" },
    { name: "Content/Production", value: 280000, color: "#8b5cf6" },
    { name: "Hackathon", value: 54830, color: C.green },
    { name: "Other", value: 565170, color: C.textMuted },
  ];

  const opportunityData = [
    { price: "$0.26 (now)", value: 3660000 },
    { price: "$0.50", value: 7000000 },
    { price: "$0.75", value: 10500000 },
    { price: "$1.00", value: 14000000 },
    { price: "$1.50", value: 21000000 },
    { price: "$2.00", value: 28000000 },
  ];

  return (
    <>
      <Section title="Deep Analysis" subtitle="Comprehensive breakdown of the CF/EMURGO proposal and what the numbers actually show.">
        <TabBar
          tabs={[
            { id: "budget", label: "Budget Breakdown" },
            { id: "comparison", label: "vs. Other Chains" },
            { id: "opportunity", label: "Opportunity Cost" },
            { id: "timeline", label: "Impact Timeline" },
          ]}
          active={tab}
          setActive={setTab}
        />

        {tab === "budget" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Where the $3.66M Goes</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={2}>
                    {budgetData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `$${(v).toLocaleString()}`} contentStyle={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Line Items</h3>
              {budgetData.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < budgetData.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                    <span style={{ fontSize: 13, color: C.text }}>{item.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                      ${(item.value).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 11, color: C.textMuted, width: 40, textAlign: "right" }}>
                      {((item.value / 3660000) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "comparison" && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, overflowX: "auto" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Cardano Summit vs. Blockchain Events</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ textAlign: "left", padding: "10px 12px", color: C.textMuted, fontWeight: 500 }}>Metric</th>
                  <th style={{ textAlign: "right", padding: "10px 12px", color: C.red, fontWeight: 600 }}>Summit 2026</th>
                  <th style={{ textAlign: "right", padding: "10px 12px", color: C.green, fontWeight: 600 }}>Bangkok Hub</th>
                  <th style={{ textAlign: "right", padding: "10px 12px", color: C.purple, fontWeight: 600 }}>ETHGlobal BKK</th>
                  <th style={{ textAlign: "right", padding: "10px 12px", color: C.amber, fontWeight: 600 }}>Solana Breakpoint</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: "Total Cost", vals: ["$3.66M", "$700K", "~$400K", "~$2M"] },
                  { metric: "Duration", vals: ["4 days", "1,095 days", "3 days", "4 days"] },
                  { metric: "Developers Engaged", vals: ["200", "500+", "3,500+", "4,000+"] },
                  { metric: "Cost per Developer", vals: ["$18,300", "$1,400", "$114", "$500"] },
                  { metric: "Permanent Output", vals: ["None", "Full hub", "None", "None"] },
                  { metric: "Cost per Day", vals: ["$915K", "$639", "~$133K", "~$500K"] },
                  { metric: "Post-Event ROI Data", vals: ["None published", "Monthly reports", "Published", "Published"] },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500 }}>{row.metric}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} style={{ padding: "10px 12px", textAlign: "right", color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16, padding: 12, background: C.surfaceAlt, borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
                <strong style={{ color: C.amber }}>Warning from Polkadot:</strong> Polkadot Decoded 2024 had its final payment rejected 99.9% by the community, who described it as oversized venue, poor location, and empty seats. The community called it one of the biggest event failures in 2024.
              </p>
            </div>
          </div>
        )}

        {tab === "opportunity" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>What 14M ADA Could Be Worth</h3>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
                ADA is currently 91% below its ATH of $3.09 and about 80% below January 2025. Treasury ADA spent at near-cycle lows has dramatically higher real cost.
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={opportunityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="price" tick={{ fill: C.textMuted, fontSize: 11 }} />
                  <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} tickFormatter={v => `$${(v / 1e6).toFixed(0)}M`} />
                  <Tooltip formatter={v => [`$${v.toLocaleString()}`, "14M ADA Value"]} contentStyle={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" fill={C.accent} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>The Math</h3>
              {[
                { label: "Current proposal value", value: "$3.66M", note: "at $0.26/ADA" },
                { label: "If ADA returns to $1", value: "$14M", note: "15 months ago" },
                { label: "If ADA returns to ATH", value: "$43.3M", note: "at $3.09" },
                { label: "Bangkok hub cost (3yr)", value: "$700K", note: "2.8M ADA" },
                { label: "Years a hub could run", value: "14-18", note: "for the Summit's ADA" },
                { label: "Hubs across Asia", value: "5", note: "for 3 years each" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, color: C.text }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{item.note}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "timeline" && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>Engagement Over Time</h3>
            <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Person-days of community engagement: Summit spike vs. Hub steady-state</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={Array.from({ length: 36 }, (_, i) => ({
                month: `M${i + 1}`,
                hub: Math.min(30, 5 + i * 0.8) * 30,
                summit: i === 6 ? 2400 : 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="month" tick={{ fill: C.textMuted, fontSize: 10 }} interval={5} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} />
                <Tooltip contentStyle={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="hub" stroke={C.green} strokeWidth={2} dot={false} name="Hub (person-days/mo)" />
                <Line type="monotone" dataKey="summit" stroke={C.red} strokeWidth={2} dot={false} name="Summit spike" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Section>
    </>
  );
}

// ═══════════════════════════════════════════════
// CALCULATOR PAGE (Full version)
// ═══════════════════════════════════════════════
function CalculatorPage() {
  const [adaPrice, setAdaPrice] = useState(0.26);
  const [hubCity, setHubCity] = useState("bangkok");
  const [hubYears, setHubYears] = useState(3);

  const city = CITIES[hubCity];
  const summitCostADA = 14076539;
  const summitCostUSD = summitCostADA * adaPrice;
  const hubAnnualRent = city.rentSqm * 300 * 12;
  const hubAnnualStaff = city.devSalary * 4 * 12;
  const hubAnnualOps = hubAnnualRent * 0.3;
  const hubAnnualTotal = hubAnnualRent + hubAnnualStaff + hubAnnualOps;
  const hubTotalCost = hubAnnualTotal * hubYears + 50000;
  const hubADA = Math.round(hubTotalCost / adaPrice);
  const yearsFromSummit = Math.floor(summitCostUSD / hubAnnualTotal);
  const hubsFromSummit = Math.floor(summitCostUSD / hubTotalCost);

  return (
    <Section title="Interactive Calculator" subtitle="Adjust ADA price, city, and duration to compare the Summit proposal against a permanent hub.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* Controls */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Parameters</h3>

          <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>
            ADA Price: <span style={{ color: C.accent, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>${adaPrice.toFixed(2)}</span>
          </label>
          <input type="range" min={0.05} max={3} step={0.01} value={adaPrice}
            onChange={e => setAdaPrice(parseFloat(e.target.value))}
            style={{ width: "100%", marginBottom: 20, accentColor: C.accent }} />

          <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>Hub City</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {Object.entries(CITIES).map(([key, c]) => (
              <button key={key} onClick={() => setHubCity(key)} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12, border: "none",
                background: hubCity === key ? C.accent : C.surfaceAlt,
                color: hubCity === key ? "#fff" : C.textMuted,
                cursor: "pointer", fontWeight: 500,
              }}>{c.name}</button>
            ))}
          </div>

          <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>
            Hub Duration: <span style={{ color: C.accent, fontWeight: 700 }}>{hubYears} years</span>
          </label>
          <input type="range" min={1} max={10} step={1} value={hubYears}
            onChange={e => setHubYears(parseInt(e.target.value))}
            style={{ width: "100%", marginBottom: 20, accentColor: C.accent }} />

          <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: 16, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>City Cost Profile: {city.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><span style={{ fontSize: 11, color: C.textMuted }}>Rent/sqm/mo</span><br /><span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>${city.rentSqm}</span></div>
              <div><span style={{ fontSize: 11, color: C.textMuted }}>Dev salary/mo</span><br /><span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>${city.devSalary.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Results</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: C.redDim + "44", borderRadius: 8, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>Summit Cost</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                ${(summitCostUSD / 1e6).toFixed(2)}M
              </div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{summitCostADA.toLocaleString()} ADA</div>
            </div>
            <div style={{ background: C.greenDim + "44", borderRadius: 8, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>Hub Cost ({hubYears}yr)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.green, fontFamily: "'JetBrains Mono', monospace" }}>
                ${(hubTotalCost / 1e6).toFixed(2)}M
              </div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{hubADA.toLocaleString()} ADA</div>
            </div>
          </div>

          {[
            { label: "Summit cost per day", value: `$${Math.round(summitCostUSD / 4).toLocaleString()}`, color: C.red },
            { label: "Hub cost per day", value: `$${Math.round(hubTotalCost / (hubYears * 365)).toLocaleString()}`, color: C.green },
            { label: `Years summit ADA runs a ${city.name} hub`, value: `${yearsFromSummit} years`, color: C.accent },
            { label: "Hubs from summit ADA", value: `${hubsFromSummit} hubs`, color: C.accent },
            { label: "Hub annual operating cost", value: `$${Math.round(hubAnnualTotal).toLocaleString()}`, color: C.text },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13, color: C.textMuted }}>{item.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
            </div>
          ))}

          <div style={{ marginTop: 20, background: C.accentDim + "44", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginBottom: 4 }}>Key Insight</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
              At ${adaPrice.toFixed(2)}/ADA, the summit's 14M ADA could fund a {city.name} hub for {yearsFromSummit} years, or {hubsFromSummit} hubs across Asia for {hubYears} years each.
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════
// CASE STUDIES PAGE (with references)
// ═══════════════════════════════════════════════
function CaseStudiesPage() {
  const [activeCase, setActiveCase] = useState("superteam");
  const c = CASE_STUDIES[activeCase];

  return (
    <Section title="Case Studies" subtitle="How other blockchain ecosystems build (and sometimes fail to build) permanent spaces.">
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 24, paddingBottom: 4 }}>
        {Object.entries(CASE_STUDIES).map(([key, val]) => (
          <button key={key} onClick={() => setActiveCase(key)} style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 12, border: `1px solid ${activeCase === key ? val.statusColor : C.border}`,
            background: activeCase === key ? val.statusColor + "18" : C.surface,
            color: activeCase === key ? val.statusColor : C.textMuted,
            cursor: "pointer", whiteSpace: "nowrap", fontWeight: 500,
          }}>{val.name}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* Info Card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{c.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <MapPin size={12} color={C.textMuted} />
                <span style={{ fontSize: 12, color: C.textMuted }}>{c.location}</span>
              </div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, color: c.statusColor,
              background: c.statusColor + "18", padding: "4px 10px", borderRadius: 20,
            }}>{c.status}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Funding</div>
              <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{c.funding}</div>
            </div>
            <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Cost</div>
              <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{c.cost}</div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Operating Model</div>
            <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.7 }}>{c.model}</p>
          </div>

          {c.works && c.works.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 8 }}>What Works</div>
              {c.works.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <Check size={12} color={C.green} style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{w}</span>
                </div>
              ))}
            </div>
          )}

          {c.mistakes && c.mistakes.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 8 }}>What Went Wrong</div>
              {c.mistakes.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <AlertTriangle size={12} color={C.red} style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{m}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lessons + References + Radar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: C.accentDim + "44", border: `1px solid ${C.accent}33`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <BookOpen size={16} color={C.accent} />
              <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Lessons for Cardano</span>
            </div>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{c.lessons}</p>
          </div>

          {/* References */}
          {c.references && c.references.length > 0 && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>References & Links</div>
              {c.references.map((ref, i) => (
                <a key={i} href={ref.url} target="_blank" rel="noopener" style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
                  borderBottom: i < c.references.length - 1 ? `1px solid ${C.border}` : "none",
                  color: C.accent, textDecoration: "none", fontSize: 12,
                }}>
                  <ExternalLink size={12} /> {ref.label}
                </a>
              ))}
            </div>
          )}

          {/* Radar */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>Comparative Cost Structure</h4>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={[
                { metric: "Monthly Burn", bkk: 20, space: activeCase === "fullnode" ? 80 : activeCase === "empiredao" ? 100 : activeCase === "near" ? 90 : activeCase === "superteam" ? 30 : 15 },
                { metric: "Setup Cost", bkk: 15, space: activeCase === "fullnode" ? 100 : activeCase === "empiredao" ? 60 : activeCase === "near" ? 80 : 25 },
                { metric: "Sustainability", bkk: 70, space: activeCase === "fullnode" ? 95 : activeCase === "empiredao" ? 5 : activeCase === "near" ? 40 : 60 },
                { metric: "Community Reach", bkk: 50, space: activeCase === "fullnode" ? 80 : activeCase === "empiredao" ? 20 : activeCase === "near" ? 70 : activeCase === "superteam" ? 75 : 40 },
                { metric: "Enterprise Value", bkk: 65, space: activeCase === "fullnode" ? 50 : activeCase === "empiredao" ? 10 : 30 },
              ]}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="metric" tick={{ fill: C.textMuted, fontSize: 10 }} />
                <Radar name="Bangkok Hub" dataKey="bkk" stroke={C.green} fill={C.green} fillOpacity={0.15} />
                <Radar name={c.name} dataKey="space" stroke={c.statusColor} fill={c.statusColor} fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════
// OFFICE LISTINGS PAGE (Multi-city, curated 4 per city)
// ═══════════════════════════════════════════════
function OfficeListingsPage() {
  const [selectedCity, setSelectedCity] = useState("bangkok");

  const cityNames = {
    bangkok: "Bangkok",
    hcmc: "Ho Chi Minh City",
    dubai: "Dubai",
    singapore: "Singapore",
    tokyo: "Tokyo",
    hongkong: "Hong Kong",
  };

  const listings = OFFICE_LISTINGS[selectedCity] || [];

  return (
    <Section title="Office Listings by City" subtitle="Curated office spaces across major Asian and global cities. 4 options per city showing the range from budget to premium. All data from Q1 2026 research.">
      {/* City Selector */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 24, paddingBottom: 4 }}>
        {Object.entries(cityNames).map(([key, name]) => (
          <button key={key} onClick={() => setSelectedCity(key)} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 12, border: "none",
            background: selectedCity === key ? C.accent : C.surfaceAlt,
            color: selectedCity === key ? "#fff" : C.textMuted,
            cursor: "pointer", whiteSpace: "nowrap", fontWeight: 600,
            transition: "all 0.15s",
          }}>{name}</button>
        ))}
      </div>

      {/* Listings Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {listings.map((listing, idx) => (
          <div key={idx} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            {/* Thumbnail */}
            <div style={{
              height: 140, background: `url(${listing.thumbnail}) center/cover no-repeat`,
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 8, right: 8,
                fontSize: 10, fontWeight: 600, color: C.accent,
                background: "rgba(10,10,15,0.85)", backdropFilter: "blur(8px)",
                padding: "3px 8px", borderRadius: 4,
              }}>Grade {listing.grade}</div>
            </div>

            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{listing.name}</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textMuted, marginBottom: 12 }}>
                <MapPin size={10} /> {listing.area}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: C.surfaceAlt, borderRadius: 6, padding: 10 }}>
                  <div style={{ fontSize: 10, color: C.textMuted }}>Price/sqm/mo</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.green, fontFamily: "'JetBrains Mono', monospace" }}>
                    {listing.currency === "THB" ? "฿" : "$"}{listing.pricePerSqm.toLocaleString()}
                  </div>
                </div>
                <div style={{ background: C.surfaceAlt, borderRadius: 6, padding: 10 }}>
                  <div style={{ fontSize: 10, color: C.textMuted }}>~300 sqm/mo</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                    {listing.monthlyEst}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={10} /> {listing.transit}
              </div>

              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>{listing.size}</div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                {listing.features.map((f, i) => (
                  <span key={i} style={{
                    fontSize: 10, padding: "3px 8px", borderRadius: 4,
                    background: C.surfaceAlt, color: C.textMuted,
                  }}>{f}</span>
                ))}
              </div>

              <a href={listing.url} target="_blank" rel="noopener" style={{
                marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                background: C.surfaceAlt, border: `1px solid ${C.border}`,
                color: C.text, textDecoration: "none",
              }}>
                View on {listing.source} <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Market Context */}
      <div style={{ marginTop: 24, background: C.surfaceAlt, borderRadius: 12, padding: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>
          Market Context: {cityNames[selectedCity]}
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {selectedCity === "bangkok" && [
            { label: "CBD Grade A range", value: "THB 800-1,400/sqm", note: "Silom, Sathorn, Sukhumvit" },
            { label: "Budget options", value: "THB 350-790/sqm", note: "Ratchada, Riverside" },
            { label: "300 sqm at THB 700/sqm", value: "~$5,833/mo", note: "Well within proposal budget" },
            { label: "vs. Singapore equivalent", value: "10-40x cheaper", note: "Same regional access" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{item.note}</div>
            </div>
          ))}
          {selectedCity === "hcmc" && [
            { label: "Grade A CBD (District 1)", value: "$62/sqm/mo", note: "Premium, LEED certified" },
            { label: "CBD Fringe / D2", value: "$15-22/sqm/mo", note: "Growing tech district" },
            { label: "Coworking (per person)", value: "$135-310/mo", note: "Flexible terms available" },
            { label: "Vacancy rate (2026)", value: "~24%", note: "Tenant-favorable market" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{item.note}</div>
            </div>
          ))}
          {selectedCity === "dubai" && [
            { label: "DIFC (Premium)", value: "AED 280-380/sqft", note: "Record rents, financial hub" },
            { label: "Business Bay", value: "AED 190-260/sqft", note: "New CBD, growing area" },
            { label: "JLT (Budget)", value: "AED 130K/yr (200sqm)", note: "Free zone, most affordable" },
            { label: "Market trend", value: "Bifurcation", note: "Grade A rising, older stock flat" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{item.note}</div>
            </div>
          ))}
          {selectedCity === "singapore" && [
            { label: "Core CBD Grade A", value: "S$11.82/psf/mo", note: "Rising 2-4% in 2026" },
            { label: "Tanjong Pagar", value: "S$8.50-14.00/psf", note: "Tech companies, startups" },
            { label: "300 sqm equivalent", value: "$20K-39K/mo", note: "5-7x Bangkok pricing" },
            { label: "Supply constraint", value: "0.4M sqft in 2026", note: "Tightest in years" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{item.note}</div>
            </div>
          ))}
          {selectedCity === "tokyo" && [
            { label: "Central 5 wards Grade A", value: "~$40-55/sqm/mo", note: "Shibuya, Minato premium" },
            { label: "Outer wards", value: "~$23-30/sqm/mo", note: "Meguro, Nakameguro" },
            { label: "300 sqm Shibuya", value: "~$16,500/mo", note: "3x Bangkok pricing" },
            { label: "Market trend", value: "+8.7% YoY", note: "Rising rents in central wards" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{item.note}</div>
            </div>
          ))}
          {selectedCity === "hongkong" && [
            { label: "Central Grade A", value: "HK$133/psf/mo", note: "Rebounding after 2-yr decline" },
            { label: "Wan Chai / Causeway Bay", value: "HK$28-71/psf", note: "20-30% below Central" },
            { label: "Kwun Tong (Industrial)", value: "HK$29/psf", note: "Affordable, wide floors" },
            { label: "2026 forecast", value: "+3-5% Central", note: "Tightening vacancy in top towers" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════
// PROPOSAL PAGE
// ═══════════════════════════════════════════════
function ProposalPage() {
  const [view, setView] = useState("catalyst");

  return (
    <Section title="The Proposals" subtitle="Two complementary proposals for a permanent Cardano/Midnight hub in Bangkok: a Catalyst Phase 1 and a full 3-year treasury withdrawal.">
      <TabBar
        tabs={[
          { id: "catalyst", label: "Catalyst (200K ADA)" },
          { id: "treasury", label: "Treasury (2.8M ADA)" },
        ]}
        active={view}
        setActive={setView}
      />

      {view === "catalyst" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>Catalyst Fund 15/16</h3>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>Phase 1 validation: 200,000 ADA / 12 months</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              <StatCard value="200K" label="ADA requested" color={C.accent} />
              <StatCard value="12mo" label="project duration" color={C.accent} />
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>Budget Breakdown</h4>
            {[
              { label: "One-time setup", value: "60,000 ADA", pct: 30 },
              { label: "Rent (12 months)", value: "55,200 ADA", pct: 27.6 },
              { label: "Staff (Hub Mgr + 2 PT)", value: "64,800 ADA", pct: 32.4 },
              { label: "Utilities & ops", value: "8,400 ADA", pct: 4.2 },
              { label: "Events & marketing", value: "11,400 ADA", pct: 5.7 },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: C.textMuted }}>{item.label}</span>
                  <span style={{ color: C.text, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
                </div>
                <div style={{ height: 4, background: C.surfaceAlt, borderRadius: 2, marginTop: 4 }}>
                  <div style={{ height: "100%", background: C.accent, borderRadius: 2, width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>12-Month Targets</h4>
            {[
              { label: "Developers trained", value: "100+", icon: Users },
              { label: "Events hosted", value: "48+", icon: Calendar },
              { label: "Coworking members", value: "50 by M12", icon: Building2 },
              { label: "University partnerships", value: "3+", icon: BookOpen },
              { label: "Enterprise demos", value: "20+", icon: Globe },
              { label: "Midnight devs trained", value: "30+", icon: Zap },
              { label: "Self-sustaining target", value: "30-40%", icon: TrendingUp },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <Icon size={14} color={C.accent} />
                  <span style={{ fontSize: 13, color: C.textMuted, flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
                </div>
              );
            })}

            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>Milestones</h4>
              {[
                { month: "M1-2", title: "Legal setup & space secured" },
                { month: "M3-4", title: "Hub operational, soft launch" },
                { month: "M5-8", title: "Full operations & programming" },
                { month: "M9-12", title: "Growth & sustainability assessment" },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 48, fontSize: 10, fontWeight: 700, color: C.accent,
                    background: C.accentDim + "44", borderRadius: 4, padding: "4px 0",
                    textAlign: "center", flexShrink: 0,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{m.month}</div>
                  <span style={{ fontSize: 12, color: C.textMuted }}>{m.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "treasury" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>Treasury Withdrawal</h3>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>Full 3-year hub: 2,800,000 ADA</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              <StatCard value="Y1" label="1.15M ADA" color={C.accent} />
              <StatCard value="Y2" label="825K ADA" color={C.accent} />
              <StatCard value="Y3" label="825K ADA" color={C.accent} />
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>3-Year KPI Targets</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { metric: "Members", y1: 30, y2: 60, y3: 100 },
                { metric: "Events/mo", y1: 4, y2: 8, y3: 12 },
                { metric: "Devs Trained", y1: 50, y2: 150, y3: 300 },
                { metric: "Self-Sustain %", y1: 10, y2: 25, y3: 50 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="metric" tick={{ fill: C.textMuted, fontSize: 10 }} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} />
                <Tooltip contentStyle={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="y1" fill={C.accent + "66"} name="Year 1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="y2" fill={C.accent + "99"} name="Year 2" radius={[2, 2, 0, 0]} />
                <Bar dataKey="y3" fill={C.accent} name="Year 3" radius={[2, 2, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>Accountability</h4>
            {[
              { label: "Monthly financial statements", detail: "Published to Cardano Forum" },
              { label: "Quarterly KPI reports", detail: "Submitted to DReps & Intersect" },
              { label: "Annual independent audit", detail: "Thai-registered accounting firm" },
              { label: "5-member Advisory Board", detail: "2 community, 1 Intersect, 1 industry, 1 financial" },
              { label: "Multi-sig wallet", detail: "3-of-5 signatures required" },
              { label: "Clawback provisions", detail: "Miss KPIs by 50% x 2 quarters = pause" },
              { label: "Unused funds returned", detail: "To Cardano Treasury at project end" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{item.detail}</div>
              </div>
            ))}

            <div style={{ marginTop: 20, background: C.greenDim + "44", borderRadius: 8, padding: 16, border: `1px solid ${C.green}33` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.green, marginBottom: 4 }}>Cost Efficiency</div>
              <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
                2,800,000 ADA for 1,095 days = 2,557 ADA/day. The Singapore Summit costs 7,000,000 ADA/day. That is a 2,738x difference in daily cost.
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function App() {
  const [activePage, setActivePage] = useState("overview");

  // Scroll to top when changing pages (except overview internal scrolls)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        input[type="range"] { height: 6px; border-radius: 3px; }
        input[type="range"]::-webkit-slider-thumb { width: 16px; height: 16px; }
        .recharts-default-tooltip { background: ${C.surfaceAlt} !important; border: 1px solid ${C.border} !important; border-radius: 8px !important; }
      `}</style>

      <Nav active={activePage} setActive={setActivePage} />

      {activePage === "overview" && <OverviewPage setActivePage={setActivePage} />}
      {activePage === "analysis" && <AnalysisPage />}
      {activePage === "calculator" && <CalculatorPage />}
      {activePage === "casestudies" && <CaseStudiesPage />}
      {activePage === "offices" && <OfficeListingsPage />}
      {activePage === "proposal" && <ProposalPage />}

      <footer style={{
        borderTop: `1px solid ${C.border}`, padding: "20px 0",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <p style={{ fontSize: 12, color: C.textMuted }}>
            cardanospaces.com // Independent community research by Morgan
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
            Data from CF/EMURGO proposal, Solana Foundation, ETHGlobal, Polkadot Subsquare, ResearchGate, CBRE, DDProperty, JLL, Cushman & Wakefield, PropertyFinder, Colliers
          </p>
        </div>
      </footer>
    </div>
  );
}
