// Demo data only. Addresses and coordinates are approximate and NOT verified; the real app would use the
// Government Address Lookup Service. Fares use the official 2024 tariff, to be re-checked against the
// Transport Department fare table before any real use.

window.KAIFONG_PLACES = [
  { id: "ifc", en: "IFC Mall", zh: "國際金融中心商場", addrEn: "8 Finance Street, Central", addrZh: "中環金融街8號", district: "中環 Central", area: "island", lat: 22.2849, lng: 114.1588, aliases: ["ifc", "central", "中環", "國金"] },
  { id: "pp", en: "Pacific Place", zh: "太古廣場", addrEn: "88 Queensway, Admiralty", addrZh: "金鐘道88號", district: "金鐘 Admiralty", area: "island", lat: 22.2776, lng: 114.1655, aliases: ["pacific place", "admiralty", "金鐘"] },
  { id: "ts", en: "Times Square", zh: "時代廣場", addrEn: "1 Matheson Street, Causeway Bay", addrZh: "銅鑼灣勿地臣街1號", district: "銅鑼灣 Causeway Bay", area: "island", lat: 22.2783, lng: 114.1820, aliases: ["times square", "cwb", "causeway bay", "銅鑼灣"] },
  { id: "qmh", en: "Queen Mary Hospital", zh: "瑪麗醫院", addrEn: "102 Pok Fu Lam Road", addrZh: "薄扶林道102號", district: "薄扶林 Pok Fu Lam", area: "island", lat: 22.2700, lng: 114.1310, aliases: ["qmh", "queen mary", "瑪麗"] },
  { id: "hku", en: "The University of Hong Kong", zh: "香港大學", addrEn: "Pok Fu Lam Road", addrZh: "薄扶林道", district: "薄扶林 Pok Fu Lam", area: "island", lat: 22.2830, lng: 114.1371, aliases: ["hku", "港大"] },
  { id: "op", en: "Ocean Park", zh: "海洋公園", addrEn: "180 Wong Chuk Hang Road, Aberdeen", addrZh: "香港仔黃竹坑道180號", district: "黃竹坑 Wong Chuk Hang", area: "island", lat: 22.2467, lng: 114.1757, aliases: ["ocean park", "海洋"] },
  { id: "cp", en: "Cityplaza", zh: "太古城中心", addrEn: "18 Taikoo Shing Road, Quarry Bay", addrZh: "鰂魚涌太古城道18號", district: "太古 Taikoo", area: "island", lat: 22.2867, lng: 114.2170, aliases: ["cityplaza", "taikoo", "太古"] },
  { id: "hc", en: "Harbour City", zh: "海港城", addrEn: "Canton Road, Tsim Sha Tsui", addrZh: "尖沙咀廣東道", district: "尖沙咀 Tsim Sha Tsui", area: "kowloon", lat: 22.2965, lng: 114.1680, aliases: ["harbour city", "tst", "tsim sha tsui", "尖咀", "尖沙咀"] },
  { id: "lp", en: "Langham Place", zh: "朗豪坊", addrEn: "8 Argyle Street, Mong Kok", addrZh: "旺角亞皆老街8號", district: "旺角 Mong Kok", area: "kowloon", lat: 22.3185, lng: 114.1686, aliases: ["langham", "mk", "mong kok", "旺角"] },
  { id: "polyu", en: "PolyU", zh: "香港理工大學", addrEn: "11 Yuk Choi Road, Hung Hom", addrZh: "紅磡育才道11號", district: "紅磡 Hung Hom", area: "kowloon", lat: 22.3045, lng: 114.1797, aliases: ["polyu", "poly", "理大", "hung hom", "紅磡"] },
  { id: "fw", en: "Festival Walk", zh: "又一城", addrEn: "80 Tat Chee Avenue, Kowloon Tong", addrZh: "九龍塘達之路80號", district: "九龍塘 Kowloon Tong", area: "kowloon", lat: 22.3373, lng: 114.1747, aliases: ["festival walk", "kowloon tong", "九龍塘"] },
  { id: "kt", en: "Kai Tak Sports Park", zh: "啟德體育園", addrEn: "Shing Fung Road, Kai Tak", addrZh: "啟德承豐道", district: "啟德 Kai Tak", area: "kowloon", lat: 22.3210, lng: 114.1990, aliases: ["kai tak", "啟德"] },
  { id: "pwh", en: "Prince of Wales Hospital", zh: "威爾斯親王醫院", addrEn: "30-32 Ngan Shing Street, Sha Tin", addrZh: "沙田銀城街30-32號", district: "沙田 Sha Tin", area: "nt", lat: 22.3797, lng: 114.2016, aliases: ["pwh", "prince of wales", "威院", "沙田"] },
  { id: "ntp", en: "New Town Plaza", zh: "新城市廣場", addrEn: "18 Sha Tin Centre Street, Sha Tin", addrZh: "沙田正街18號", district: "沙田 Sha Tin", area: "nt", lat: 22.3818, lng: 114.1890, aliases: ["new town plaza", "ntp", "新城市"] },
  { id: "air", en: "Airport Terminal 1", zh: "香港國際機場一號客運大樓", addrEn: "Chek Lap Kok", addrZh: "赤鱲角", district: "機場 Airport", area: "lantau", lat: 22.3135, lng: 113.9140, aliases: ["airport", "hkia", "t1", "機場"] }
];

// Official taxi tariff (in force from 14 July 2024). Verify before real use.
window.KAIFONG_TARIFF = {
  red:   { flag: 29,   step: 2.1, until: 102.5, after: 1.4 },
  green: { flag: 25.5, step: 1.9, until: 82.5,  after: 1.4 },
  blue:  { flag: 24,   step: 1.9, until: 195,   after: 1.6 }
};
window.KAIFONG_SURCHARGE = { harbourTunnel: 25, returnToll: 25, booking: 5, luggage: 6, pet: 5 };

// Discount offer rules (editable). Chosen by the product owner, 13 Nov 2026: a flat HK$90 minimum, like the
// phone-booking 85%-off fleets (FlyTaxi itself charged full meter under $90 and 85-90% above):
//   meter below the floor            -> pay the meter (no discount)
//   floor <= meter < floor / 0.85    -> pay a flat amount equal to the floor
//   above that                       -> 85% of the meter, with at most maxOff taken off
// Tolls and surcharges are never discounted.
window.KAIFONG_DISCOUNT = {
  rate: 0.85,
  maxOff: 60,
  floor: { red: 90, green: 80, blue: 80 }   // blue (Lantau) floor not yet verified
};

// Feature switches. Fare offers (discounts / waived surcharges) and fixed prices are OFF:
// under Cap. 374D reg 40 (soliciting) and reg 47 (fares) they are high-risk for taxis (legal review, 13 Nov 2026).
window.KAIFONG_FEATURES = { offers: false, fixedPrice: false };
