// Comprehensive ISO 4217 currency data with flags, names, and symbols
// Source: ISO 4217, central banks, and standard currency references

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string; // Emoji flag or country code
  country: string;
  region: string;
  decimalPlaces: number; // Standard decimal precision
  isActive: boolean;
  introduced?: string; // Year introduced
  iso4217: boolean; // Official ISO 4217 currency
}

// Comprehensive currency database - ALL major currencies worldwide
export const currencies: Currency[] = [
  // Major global currencies
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", country: "United States", region: "North America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", country: "Eurozone", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", country: "United Kingdom", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", country: "Japan", region: "Asia", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭", country: "Switzerland", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", country: "Australia", region: "Oceania", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", country: "Canada", region: "North America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", country: "China", region: "Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", country: "Hong Kong", region: "Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿", country: "New Zealand", region: "Oceania", decimalPlaces: 2, iso4217: true, isActive: true },

  // South Asian currencies
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", country: "India", region: "South Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs", flag: "🇵🇰", country: "Pakistan", region: "South Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "NPR", name: "Nepalese Rupee", symbol: "Rs", flag: "🇳🇵", country: "Nepal", region: "South Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩", country: "Bangladesh", region: "South Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰", country: "Sri Lanka", region: "South Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MVR", name: "Maldivian Rufiyaa", symbol: "Rf", flag: "🇲🇻", country: "Maldives", region: "South Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu.", flag: "🇧🇹", country: "Bhutan", region: "South Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋", flag: "🇦🇫", country: "Afghanistan", region: "South Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MNT", name: "Mongolian Tugrik", symbol: "₮", flag: "🇲🇳", country: "Mongolia", region: "East Asia", decimalPlaces: 2, iso4217: true, isActive: true },

  // Middle East & Central Asia
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", country: "United Arab Emirates", region: "Middle East", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦", country: "Saudi Arabia", region: "Middle East", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦", country: "Qatar", region: "Middle East", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼", country: "Kuwait", region: "Middle East", decimalPlaces: 3, iso4217: true, isActive: true },
  { code: "BHD", name: "Bahraini Dinar", symbol: "د.ب", flag: "🇧🇭", country: "Bahrain", region: "Middle East", decimalPlaces: 3, iso4217: true, isActive: true },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", flag: "🇴🇲", country: "Oman", region: "Middle East", decimalPlaces: 3, iso4217: true, isActive: true },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", flag: "🇯🇴", country: "Jordan", region: "Middle East", decimalPlaces: 3, iso4217: true, isActive: true },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱", country: "Israel", region: "Middle East", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷", country: "Turkey", region: "Middle East", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼", flag: "🇮🇷", country: "Iran", region: "Middle East", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬", country: "Egypt", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د", flag: "🇮🇶", country: "Iraq", region: "Middle East", decimalPlaces: 3, iso4217: true, isActive: true },

  // Southeast Asian currencies
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", country: "Thailand", region: "Southeast Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", country: "Singapore", region: "Southeast Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", country: "Malaysia", region: "Southeast Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", country: "Indonesia", region: "Southeast Asia", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭", country: "Philippines", region: "Southeast Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", country: "Vietnam", region: "Southeast Asia", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "MMK", name: "Myanmar Kyat", symbol: "Ks", flag: "🇲🇲", country: "Myanmar", region: "Southeast Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛", flag: "🇰🇭", country: "Cambodia", region: "Southeast Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "LAK", name: "Lao Kip", symbol: "₭", flag: "🇱🇦", country: "Laos", region: "Southeast Asia", decimalPlaces: 2, iso4217: true, isActive: true },

  // East Asian currencies
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", country: "South Korea", region: "East Asia", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼", country: "Taiwan", region: "East Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MOP", name: "Macanese Pataca", symbol: "MOP$", flag: "🇲🇴", country: "Macau", region: "East Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", country: "Hong Kong", region: "Asia", decimalPlaces: 2, iso4217: true, isActive: true },

  // Eastern European & Central Asian
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺", country: "Russia", region: "Eastern Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦", country: "Ukraine", region: "Eastern Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", flag: "🇰🇿", country: "Kazakhstan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "UZS", name: "Uzbekistani Som", symbol: "so'm", flag: "🇺🇿", country: "Uzbekistan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "TJS", name: "Tajikistani Somoni", symbol: "SM", flag: "🇹🇯", country: "Tajikistan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "KGS", name: "Kyrgyzstani Som", symbol: "с", flag: "🇰🇬", country: "Kyrgyzstan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "TMT", name: "Turkmenistani Manat", symbol: "m", flag: "🇹🇲", country: "Turkmenistan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼", flag: "🇦🇿", country: "Azerbaijan", region: "Caucasus", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "AMD", name: "Armenian Dram", symbol: "֏", flag: "🇦🇲", country: "Armenia", region: "Caucasus", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "GEL", name: "Georgian Lari", symbol: "₾", flag: "🇬🇪", country: "Georgia", region: "Caucasus", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br", flag: "🇧🇾", country: "Belarus", region: "Eastern Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MDL", name: "Moldovan Leu", symbol: "L", flag: "🇲🇩", country: "Moldova", region: "Eastern Europe", decimalPlaces: 2, iso4217: true, isActive: true },

  // European currencies (non-Euro)
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪", country: "Sweden", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴", country: "Norway", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰", country: "Denmark", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", flag: "🇵🇱", country: "Poland", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿", country: "Czech Republic", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺", country: "Hungary", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴", country: "Romania", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", flag: "🇧🇬", country: "Bulgaria", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", flag: "🇭🇷", country: "Croatia", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин.", flag: "🇷🇸", country: "Serbia", region: "Europe", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦", country: "Ukraine", region: "Eastern Europe", decimalPlaces: 2, iso4217: true, isActive: true },

  // African currencies
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦", country: "South Africa", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬", country: "Nigeria", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪", country: "Kenya", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬", country: "Egypt", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", flag: "🇲🇦", country: "Morocco", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", flag: "🇹🇳", country: "Tunisia", region: "Africa", decimalPlaces: 3, iso4217: true, isActive: true },
  { code: "DZD", name: "Algerian Dinar", symbol: "د.ج", flag: "🇩🇿", country: "Algeria", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭", country: "Ghana", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬", country: "Uganda", region: "Africa", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿", country: "Tanzania", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", flag: "🇪🇹", country: "Ethiopia", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA", flag: "🌍", country: "West Africa", region: "Africa", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", flag: "🌍", country: "Central Africa", region: "Africa", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", flag: "🇿🇲", country: "Zambia", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK", flag: "🇲🇼", country: "Malawi", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT", flag: "🇲🇿", country: "Mozambique", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "BWP", name: "Botswana Pula", symbol: "P", flag: "🇧🇼", country: "Botswana", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "NAD", name: "Namibian Dollar", symbol: "N$", flag: "🇳🇦", country: "Namibia", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$", flag: "🇿🇼", country: "Zimbabwe", region: "Africa", decimalPlaces: 2, iso4217: true, isActive: true },

  // Latin American & Caribbean
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", country: "Brazil", region: "South America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽", country: "Mexico", region: "North America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷", country: "Argentina", region: "South America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱", country: "Chile", region: "South America", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴", country: "Colombia", region: "South America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪", country: "Peru", region: "South America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "VES", name: "Venezuelan Bolívar", symbol: "Bs.", flag: "🇻🇪", country: "Venezuela", region: "South America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U", flag: "🇺🇾", country: "Uruguay", region: "South America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "PYG", name: "Paraguayan Guarani", symbol: "₲", flag: "🇵🇾", country: "Paraguay", region: "South America", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs.", flag: "🇧🇴", country: "Bolivia", region: "South America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡", flag: "🇨🇷", country: "Costa Rica", region: "Central America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/.", flag: "🇵🇦", country: "Panama", region: "Central America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", flag: "🇬🇹", country: "Guatemala", region: "Central America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "HNL", name: "Honduran Lempira", symbol: "L", flag: "🇭🇳", country: "Honduras", region: "Central America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$", flag: "🇳🇮", country: "Nicaragua", region: "Central America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "SVC", name: "Salvadoran Colón", symbol: "$", flag: "🇸🇻", country: "El Salvador", region: "Central America", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "JMD", name: "Jamaican Dollar", symbol: "J$", flag: "🇯🇲", country: "Jamaica", region: "Caribbean", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "TTD", name: "Trinidad & Tobago Dollar", symbol: "TT$", flag: "🇹🇹", country: "Trinidad and Tobago", region: "Caribbean", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "BBD", name: "Barbadian Dollar", symbol: "$", flag: "🇧🇧", country: "Barbados", region: "Caribbean", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "CUP", name: "Cuban Peso", symbol: "₱", flag: "🇨🇺", country: "Cuba", region: "Caribbean", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "DOP", name: "Dominican Peso", symbol: "RD$", flag: "🇩🇴", country: "Dominican Republic", region: "Caribbean", decimalPlaces: 2, iso4217: true, isActive: true },

  // Additional Asian currencies
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", flag: "🇰🇿", country: "Kazakhstan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "UZS", name: "Uzbekistani Som", symbol: "so'm", flag: "🇺🇿", country: "Uzbekistan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "KGS", name: "Kyrgyzstani Som", symbol: "с", flag: "🇰🇬", country: "Kyrgyzstan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "TJS", name: "Tajikistani Somoni", symbol: "SM", flag: "🇹🇯", country: "Tajikistan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "TMM", name: "Turkmenistani Manat", symbol: "m", flag: "🇹🇲", country: "Turkmenistan", region: "Central Asia", decimalPlaces: 2, iso4217: true, isActive: true },

  // Pacific & Oceania
  { code: "FJD", name: "Fijian Dollar", symbol: "FJ$", flag: "🇫🇯", country: "Fiji", region: "Oceania", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K", flag: "🇵🇬", country: "Papua New Guinea", region: "Oceania", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "SI$", flag: "🇸🇧", country: "Solomon Islands", region: "Oceania", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "VUV", name: "Vanuatu Vatu", symbol: "VT", flag: "🇻🇺", country: "Vanuatu", region: "Oceania", decimalPlaces: 0, iso4217: true, isActive: true },
  { code: "WST", name: "Samoan Tala", symbol: "WS$", flag: "🇼🇸", country: "Samoa", region: "Oceania", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "TOP", name: "Tongan Paʻanga", symbol: "T$", flag: "🇹🇴", country: "Tonga", region: "Oceania", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "XPF", name: "CFP Franc", symbol: "₣", flag: "🇵🇫", country: "French Polynesia", region: "Oceania", decimalPlaces: 0, iso4217: true, isActive: true },

  // Special drawing rights & reserve currencies
  { code: "XDR", name: "IMF Special Drawing Rights", symbol: "SDR", flag: "🏛️", country: "International", region: "Global", decimalPlaces: 2, iso4217: true, isActive: true },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", country: "United States", region: "Global Reserve", decimalPlaces: 2, iso4217: true, isActive: true },

  // Crypto & digital (if supported by API)
  { code: "BTC", name: "Bitcoin", symbol: "₿", flag: "🔶", country: "Cryptocurrency", region: "Digital", decimalPlaces: 8, iso4217: false, isActive: true },
  { code: "ETH", name: "Ethereum", symbol: "Ξ", flag: "🔷", country: "Cryptocurrency", region: "Digital", decimalPlaces: 18, iso4217: false, isActive: true },
  { code: "USDT", name: "Tether", symbol: "₮", flag: "🔵", country: "Cryptocurrency", region: "Digital", decimalPlaces: 6, iso4217: false, isActive: true },
  { code: "USDC", name: "USD Coin", symbol: "Ⓢ", flag: "🟢", country: "Cryptocurrency", region: "Digital", decimalPlaces: 6, iso4217: false, isActive: true },
];

// Helper function to get currency by code
export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find(c => c.code === code.toUpperCase());
}

// Helper function to search currencies
export function searchCurrencies(query: string): Currency[] {
  const q = query.toLowerCase().trim();
  if (!q) return currencies;

  return currencies.filter(currency =>
    currency.code.toLowerCase().includes(q) ||
    currency.name.toLowerCase().includes(q) ||
    currency.country.toLowerCase().includes(q) ||
    currency.symbol.toLowerCase().includes(q)
  ).slice(0, 50); // Limit results for performance
}

// Get popular currencies (most traded)
export function getPopularCurrencies(): Currency[] {
  const popularCodes = [
    "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY",
    "INR", "PKR", "NPR", "SAR", "AED", "THB", "TRY", "RUB"
  ];
  return currencies.filter(c => popularCodes.includes(c.code));
}

// Get currencies by region
export function getCurrenciesByRegion(region: string): Currency[] {
  return currencies.filter(c => 
    c.region.toLowerCase() === region.toLowerCase() || 
    c.country.toLowerCase() === region.toLowerCase()
  );
}

// Get all regions
export function getAllRegions(): string[] {
  return [...new Set(currencies.map(c => c.region))].sort();
}

// Format currency amount with proper decimal places
export function formatCurrencyAmount(
  amount: number, 
  currencyCode: string,
  options?: Intl.NumberFormatOptions
): string {
  const currency = getCurrencyByCode(currencyCode);
  const decimalPlaces = currency?.decimalPlaces ?? 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: Math.max(decimalPlaces, 2),
    ...options,
  }).format(amount);
}

// Get currency flag emoji from country code
export function getCurrencyFlag(currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode);
  return currency?.flag || "🌐";
}
