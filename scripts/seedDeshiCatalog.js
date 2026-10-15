require('dotenv').config();

const { MongoClient } = require('mongodb');

const categories = [
  { name: 'আম', slug: 'mango', description: 'বাংলাদেশের সেরা বাগানের মৌসুমি আম', image: 'https://cdn.paragonfood.com.bd/images/thumbs/0000552_langra-mango-5-kg_550.webp', order: 1 },
  { name: 'খেজুরের গুড়', slug: 'khejurer-gur', description: 'খাঁটি খেজুরের রস থেকে তৈরি গুড়', image: 'https://www.abirfoodsbd.com/uploaded_files/product/b-71202616234373_wUy8X5sQiQHKk0iGaTxpY339EA1mg6M2OmPFBCGW.png', order: 2 },
  { name: 'মসলা ও রান্নার উপকরণ', slug: 'spices-cooking-essentials', description: 'প্রতিদিনের রান্নার জন্য বাছাই করা ঘরোয়া মসলা', image: 'https://ahmadfoodbd.com/wp-content/uploads/2024/09/ahmad-Combo-1-1.jpg', order: 3 },
  { name: 'মধু ও প্রাকৃতিক তেল', slug: 'honey-natural-oils', description: 'প্রাকৃতিক মধু ও ঐতিহ্যবাহী তেলের সংগ্রহ', image: 'https://ahmadfoodbd.com/wp-content/uploads/2024/09/ahmad-Combo-1-1.jpg', order: 4 },
  { name: 'ড্রাই ফ্রুটস বাদাম ও খেজুর', slug: 'dry-fruits-nuts-dates', description: 'নাশতা, অতিথি আপ্যায়ন ও উপহারের জন্য প্রিমিয়াম সংগ্রহ', image: 'https://jazzdates.in/benefits_display.png', order: 5 },
  { name: 'ঘি ও দেশি মিষ্টি', slug: 'ghee-dairy-traditional-sweets', description: 'ঐতিহ্যবাহী স্বাদের ঘি, মিষ্টি ও সেমাই', image: 'https://www.arogga.com/_next/image?q=75&url=https%3A%2F%2Fcdn2.arogga.com%2FeyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC85MTEyNVwvOTExMjUtTGFjaGNoYS1zaGVtYWktMS1jNnlkZnAud2VicCIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTAwMCwiaGVpZ2h0IjoxMDAwLCJmaXQiOiJvdXRzaWRlIn0sIm92ZXJsYXlXaXRoIjp7ImJ1Y2tldCI6Im1pc2NcL3dtLnBuZyIsImFscGhhIjo5MH19fQ%3D%3D&w=1280', order: 6 },
];

const products = [
  ['গোপালভোগ আম', 'gopalbhog-aam', 'mango', 700, 'মিষ্টি ঘ্রাণ ও নরম শাঁসের জনপ্রিয় গোপালভোগ আম।', true, true, 'https://cdn.paragonfood.com.bd/images/thumbs/0000552_langra-mango-5-kg_550.webp'],
  ['হিমসাগর আম', 'himsagor-aam', 'mango', 800, 'স্বাদে ও গন্ধে অতুলনীয় প্রিমিয়াম হিমসাগর আম।', true, true, 'https://www.thefifthorchard.com/cdn/shop/files/organic-right-img-1.webp?v=1773162976&width=1946'],
  ['ল্যাংড়া আম', 'langra-aam', 'mango', 750, 'রসালো ও সুগন্ধি ল্যাংড়া আম, সরাসরি বাগান থেকে।', true, false, 'https://mangonest.com.bd/_next/image?q=75&url=%2Fimages%2Fproducts%2Flangra.webp&w=3840'],
  ['আম্রপালি আম', 'amrapali-aam', 'mango', 650, 'ছোট আকারের, মিষ্টি ও আঁশবিহীন আম্রপালি আম।', false, true, 'https://allwellbuy.com/public/product/2022-06-04-629a794bed8d2.png'],
  ['ফজলি আম', 'fazli-aam', 'mango', 600, 'বড় আকারের, সুস্বাদু ও রসালো মৌসুমি ফজলি আম।', false, false, 'https://cdn.paragonfood.com.bd/images/thumbs/0000552_langra-mango-5-kg_550.webp'],
  ['কাটিমন আম', 'katimon-aam', 'mango', 720, 'মিষ্টি স্বাদের জনপ্রিয় কাটিমন আম, বাছাই করা বাগান থেকে।', true, false, 'https://www.thefifthorchard.com/cdn/shop/files/organic-right-img-1.webp?v=1773162976&width=1946'],
  ['বারি ৪ আম', 'bari-4-aam', 'mango', 680, 'বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউটের উন্নত জাতের বারি ৪ আম।', false, false, 'https://allwellbuy.com/public/product/2022-06-04-629a794bed8d2.png'],
  ['হাড়িভাংগা আম', 'harivanga-aam', 'mango', 780, 'ঘন শাঁস ও মিষ্টি স্বাদের বিখ্যাত হাড়িভাংগা আম।', true, true, 'https://mangonest.com.bd/_next/image?q=75&url=%2Fimages%2Fproducts%2Flangra.webp&w=3840'],
  ['গৌড়মতি আম', 'gouromoti-aam', 'mango', 700, 'মৌসুমের শেষ ভাগের মধুর স্বাদের গৌড়মতি আম।', false, false, 'https://cdn.paragonfood.com.bd/images/thumbs/0000552_langra-mango-5-kg_550.webp'],
  ['ব্যানানা ম্যাংগো', 'banana-mango', 'mango', 850, 'লম্বাটে আকৃতির সুস্বাদু ও মিষ্টি ব্যানানা ম্যাংগো।', false, false, 'https://www.thefifthorchard.com/cdn/shop/files/organic-right-img-1.webp?v=1773162976&width=1946'],
  ['খেজুরের পাটালি গুড়', 'khejurer-patali-gur', 'khejurer-gur', 500, 'শীতের খাঁটি খেজুরের রস থেকে তৈরি ঐতিহ্যবাহী পাটালি গুড়।', true, true, 'https://cdn.shopify.com/s/files/1/0554/4437/3675/products/17-Khejurer_Gur_Patali__28Date_Jaggery_29.jpg?v=1653941166'],
  ['খেজুরের ঝোলা গুড়', 'khejurer-jhola-gur', 'khejurer-gur', 550, 'পিঠা ও মিষ্টান্নের জন্য উপযুক্ত প্রাকৃতিক ঝোলা গুড়।', true, false, 'https://static.wixstatic.com/media/e5857f_b564184d65984a87bdd68cb7de5b89a2~mv2.jpg/v1/fill/w_401%2Ch_534%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/e5857f_b564184d65984a87bdd68cb7de5b89a2~mv2.jpg'],
  ['খেজুরের নরম দানাদার গুড়', 'khejurer-norom-danadar-gur', 'khejurer-gur', 480, 'ঘরে তৈরি স্বাদে নরম দানাদার খেজুরের গুড়।', false, true, 'https://www.bongmela.com/product_image/21736530640.png'],
  ['খেজুরের চকলেট গুড়', 'khejurer-chocolate-gur', 'khejurer-gur', 600, 'বিশেষ চকলেট ফ্লেভারের খেজুরের গুড়।', false, false, 'https://www.sunamganjerkhobor.com/images/news/36/35987.png?newst=1765516380'],
  ['হোমমেড হলুদের গুঁড়া', 'homemade-turmeric-powder', 'spices-cooking-essentials', 160, 'প্রতিদিনের মাছ, মাংস, ডাল ও সবজি রান্নার জন্য বাছাই করা হোমমেড হলুদের গুঁড়া।', false, false, 'https://ahmadfoodbd.com/wp-content/uploads/2024/09/ahmad-Combo-1-1.jpg', ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম']],
  ['হোমমেড মরিচের গুঁড়া', 'homemade-chili-powder', 'spices-cooking-essentials', 220, 'ঝাল ও রঙের ভারসাম্যে প্রতিদিনের রান্না, ভর্তা ও ভুনার জন্য হোমমেড মরিচের গুঁড়া।', true, false, 'https://ahmadfoodbd.com/wp-content/uploads/2024/09/ahmad-Combo-1-1.jpg', ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম']],
  ['হোমমেড ধনিয়ার গুঁড়া', 'homemade-coriander-powder', 'spices-cooking-essentials', 180, 'মাছ, মাংস, ডাল ও সবজির স্বাদ বাড়াতে সুগন্ধি হোমমেড ধনিয়ার গুঁড়া।', false, false, 'https://ahmadfoodbd.com/wp-content/uploads/2024/09/ahmad-Combo-1-1.jpg', ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম']],
  ['প্রাকৃতিক চাকের মধু', 'natural-honeycomb-honey', 'honey-natural-oils', 700, 'ফুলের উৎস ও সংগ্রহের সময়ভেদে স্বাদ ও ঘনত্বে ভিন্নতা থাকা প্রাকৃতিক চাকের মধু।', true, true, 'https://ahmadfoodbd.com/wp-content/uploads/2024/09/ahmad-Combo-1-1.jpg', ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি']],
  ['কাঠের ঘানির সরিষার তেল', 'wooden-ghani-mustard-oil', 'honey-natural-oils', 350, 'ভর্তা, আচার, ভুনা ও বাঙালি রান্নার পরিচিত স্বাদের জন্য কাঠের ঘানির সরিষার তেল।', true, false, 'https://ahmadfoodbd.com/wp-content/uploads/2024/09/ahmad-Combo-1-1.jpg', ['২৫০ মি.লি.', '৫০০ মি.লি.', '১ লিটার']],
  ['কোল্ড প্রেসড নারিকেল তেল', 'cold-pressed-coconut-oil', 'honey-natural-oils', 300, 'নির্বাচিত নারিকেল থেকে কোল্ড প্রেসড পদ্ধতিতে প্রস্তুত তেল। ব্যবহারের উপযোগিতা পণ্যের লেবেল অনুযায়ী দেখুন।', false, false, 'https://ahmadfoodbd.com/wp-content/uploads/2024/09/ahmad-Combo-1-1.jpg', ['১০০ মি.লি.', '২৫০ মি.লি.', '৫০০ মি.লি.']],
  ['মিক্সড ড্রাই ফ্রুটস', 'mixed-dry-fruits', 'dry-fruits-nuts-dates', 850, 'বাদাম ও ড্রাই ফ্রুটসের বাছাই করা মিশ্রণ, নাশতা, ভ্রমণ ও অতিথি আপ্যায়নের জন্য উপযোগী।', true, true, 'https://jazzdates.in/benefits_display.png', ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি']],
  ['কাজুবাদাম', 'cashew-nuts', 'dry-fruits-nuts-dates', 450, 'নরম গঠন ও মৃদু স্বাদের কাজুবাদাম। প্যাকের ধরন অনুযায়ী কাঁচা, ভাজা বা লবণযুক্ত তথ্য দেখুন।', false, true, 'https://jazzdates.in/benefits_display.png', ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম']],
  ['কাঠবাদাম', 'almonds', 'dry-fruits-nuts-dates', 380, 'প্রতিদিনের নাশতা, ড্রাই ফ্রুটস মিক্স ও রান্নার জন্য বাছাই করা কাঠবাদাম।', false, false, 'https://jazzdates.in/benefits_display.png', ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম']],
  ['আখরোট', 'walnuts', 'dry-fruits-nuts-dates', 520, 'কচকচে গঠন ও স্বতন্ত্র স্বাদের আখরোট, নাশতা, সালাদ ও বেকিংয়ের জন্য উপযোগী।', false, false, 'https://jazzdates.in/benefits_display.png', ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম']],
  ['মাবরুম খেজুর', 'mabroom-dates', 'dry-fruits-nuts-dates', 950, 'লম্বাটে আকৃতির প্রিমিয়াম মাবরুম খেজুর, ইফতার ও অতিথি আপ্যায়নের জন্য সুন্দর পছন্দ।', false, false, 'https://jazzdates.in/benefits_display.png', ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি']],
  ['সুক্কারি খেজুর', 'sukkari-dates', 'dry-fruits-nuts-dates', 800, 'মিষ্টি স্বাদের সুক্কারি খেজুর। প্যাকের নরম বা শুকনো ধরন অনুযায়ী প্রাপ্যতা দেখুন।', true, false, 'https://jazzdates.in/benefits_display.png', ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি']],
  ['মরিয়ম খেজুর', 'mariam-dates', 'dry-fruits-nuts-dates', 780, 'দৈনন্দিন নাশতা, ইফতার ও উপহারের জন্য বাছাই করা মরিয়ম খেজুর।', false, false, 'https://jazzdates.in/benefits_display.png', ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি']],
  ['আজওয়া খেজুর', 'ajwa-dates', 'dry-fruits-nuts-dates', 1200, 'গাঢ় রং ও স্বতন্ত্র স্বাদের প্রিমিয়াম আজওয়া খেজুর। উৎপত্তি ও গ্রেড প্যাকের তথ্য অনুযায়ী দেখুন।', true, true, 'https://jazzdates.in/benefits_display.png', ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি']],
  ['মেডজুল খেজুর', 'medjool-dates', 'dry-fruits-nuts-dates', 1100, 'বড় আকার, নরম গঠন ও সমৃদ্ধ মিষ্টি স্বাদের প্রিমিয়াম মেডজুল খেজুর।', true, false, 'https://jazzdates.in/benefits_display.png', ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি']],
  ['হানি নাটস', 'honey-nuts', 'dry-fruits-nuts-dates', 600, 'মধুতে প্রস্তুত বাদামের মিশ্রণ। উপাদান ও অ্যালার্জেন তথ্য প্যাকের লেবেল অনুযায়ী দেখুন।', false, false, 'https://jazzdates.in/benefits_display.png', ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম']],
  ['গাওয়া ঘি', 'gawa-ghee', 'ghee-dairy-traditional-sweets', 1000, 'ভাত, খিচুড়ি, পোলাও, হালুয়া ও পায়েসে ঐতিহ্যবাহী স্বাদের জন্য গাওয়া ঘি।', true, true, 'https://www.arogga.com/_next/image?q=75&url=https%3A%2F%2Fcdn2.arogga.com%2FeyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC85MTEyNVwvOTExMjUtTGFjaGNoYS1zaGVtYWktMS1jNnlkZnAud2VicCIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTAwMCwiaGVpZ2h0IjoxMDAwLCJmaXQiOiJvdXRzaWRlIn0sIm92ZXJsYXlXaXRoIjp7ImJ1Y2tldCI6Im1pc2NcL3dtLnBuZyIsImFscGhhIjo5MH19fQ%3D%3D&w=1280', ['২০০ গ্রাম', '৫০০ গ্রাম', '১ কেজি']],
  ['চাঁপাইনবাবগঞ্জের প্যাড়া পাতা সন্দেশ', 'chapainawabganj-pera-pata-sandesh', 'ghee-dairy-traditional-sweets', 450, 'অতিথি আপ্যায়ন ও পারিবারিক আয়োজনের জন্য চাঁপাইনবাবগঞ্জের ঐতিহ্যবাহী প্যাড়া পাতা সন্দেশ।', false, true, 'https://www.arogga.com/_next/image?q=75&url=https%3A%2F%2Fcdn2.arogga.com%2FeyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC85MTEyNVwvOTExMjUtTGFjaGNoYS1zaGVtYWktMS1jNnlkZnAud2VicCIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTAwMCwiaGVpZ2h0IjoxMDAwLCJmaXQiOiJvdXRzaWRlIn0sIm92ZXJsYXlXaXRoIjp7ImJ1Y2tldCI6Im1pc2NcL3dtLnBuZyIsImFscGhhIjo5MH19fQ%3D%3D&w=1280', ['৬ পিস', '১২ পিস', '১ কেজি']],
  ['চাঁপাইনবাবগঞ্জের রসকদম', 'chapainawabganj-roshkodom', 'ghee-dairy-traditional-sweets', 420, 'উৎসব, অতিথি আপ্যায়ন ও উপহারের জন্য চাঁপাইনবাবগঞ্জের পরিচিত রসকদম।', false, false, 'https://www.arogga.com/_next/image?q=75&url=https%3A%2F%2Fcdn2.arogga.com%2FeyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC85MTEyNVwvOTExMjUtTGFjaGNoYS1zaGVtYWktMS1jYnlkZnAud2VicCIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTAwMCwiaGVpZ2h0IjoxMDAwLCJmaXQiOiJvdXRzaWRlIn0sIm92ZXJsYXlXaXRoIjp7ImJ1Y2tldCI6Im1pc2NcL3dtLnBuZyIsImFscGhhIjo5MH19fQ%3D%3D&w=1280', ['৬ পিস', '১২ পিস', '১ কেজি']],
  ['ঘিয়ে ভাজা লাচ্চা সেমাই', 'ghee-fried-lachcha-semai', 'ghee-dairy-traditional-sweets', 300, 'ঈদ, উৎসব ও পারিবারিক আয়োজনের জন্য সুগন্ধি ঘিয়ে ভাজা লাচ্চা সেমাই।', true, false, 'https://www.arogga.com/_next/image?q=75&url=https%3A%2F%2Fcdn2.arogga.com%2FeyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC85MTEyNVwvOTExMjUtTGFjaGNoYS1zaGVtYWktMS1jNnlkZnAud2VicCIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTAwMCwiaGVpZ2h0IjoxMDAwLCJmaXQiOiJvdXRzaWRlIn0sIm92ZXJsYXlXaXRoIjp7ImJ1Y2tldCI6Im1pc2NcL3dtLnBuZyIsImFscGhhIjo5MH19fQ%3D%3D&w=1280', ['২০০ গ্রাম', '৪০০ গ্রাম', '৫০০ গ্রাম']],
];

const productDescriptions = {
  'gopalbhog-aam': 'গোপালভোগ আম তার মিষ্টি ঘ্রাণ, নরম শাঁস ও মোলায়েম স্বাদের জন্য গ্রীষ্মের খুবই জনপ্রিয় জাত। পরিবারের সঙ্গে খাওয়া, আমের শরবত বা ঠান্ডা ডেজার্ট তৈরির জন্য এটি দারুণ পছন্দ।',
  'himsagor-aam': 'হিমসাগর বা ক্ষীরসাপাত আম আঁশ কম, শাঁস বেশি এবং স্বাদে ঘন মিষ্টি। সরাসরি খাওয়া, মিল্কশেক বা অতিথি আপ্যায়নের ফলের প্লেটের জন্য এর সুগন্ধি স্বাদ অসাধারণ।',
  'langra-aam': 'ল্যাংড়া আমের পরিচিতি তার রসালো শাঁস, মনভোলানো ঘ্রাণ ও মিষ্টি-টক ভারসাম্যের স্বাদে। মৌসুমের তাজা ফল হিসেবে খাওয়া বা ঘরে আমের জুস তৈরির জন্য উপযোগী।',
  'amrapali-aam': 'আম্রপালি আম আকারে তুলনামূলক ছোট হলেও শাঁস ঘন, আঁশ কম এবং মিষ্টতা বেশি। লাঞ্চবক্স, পারিবারিক নাশতা বা ঠান্ডা আমের ডেজার্টে সহজে পরিবেশনের জন্য চমৎকার।',
  'fazli-aam': 'ফজলি আম বড় আকার, পুরু শাঁস ও দীর্ঘস্থায়ী সুস্বাদের জন্য পরিচিত। পরিবারের জন্য কাটাকুটি করে পরিবেশন, আমসত্ত্ব বা ঘরোয়া জ্যাম তৈরিতেও এটি ভালো কাজ করে।',
  'katimon-aam': 'কাটিমন আমের মিষ্টি স্বাদ, কম আঁশ এবং আকর্ষণীয় হলুদাভ শাঁস এটিকে বিশেষ করে তোলে। মৌসুমে টাটকা খাওয়ার পাশাপাশি শরবত, স্মুদি ও ডেজার্টের জন্যও উপযুক্ত।',
  'bari-4-aam': 'বারি ৪ আম বাংলাদেশ কৃষি গবেষণার উন্নত জাতগুলোর একটি, যার শাঁস নরম ও স্বাদ সুন্দর মিষ্টি। দৈনন্দিন পারিবারিক ফলের চাহিদা ও অতিথি আপ্যায়নের জন্য এটি নির্ভরযোগ্য পছন্দ।',
  'harivanga-aam': 'হাড়িভাংগা আমের ঘন শাঁস, কম আঁশ এবং প্রাকৃতিক মিষ্টতা উত্তরবঙ্গের মৌসুমি ফলপ্রেমীদের কাছে খুব জনপ্রিয়। ঠান্ডা করে খেলে এর স্বাদ ও গন্ধ আরও উপভোগ্য লাগে।',
  'gouromoti-aam': 'গৌড়মতি আম মৌসুমের শেষ ভাগের মিষ্টি ও রসালো একটি পছন্দের জাত। পরিবারের সঙ্গে ভাগ করে খাওয়া, ফলের সালাদ বা ঘরে তৈরি আমের পানীয়ের জন্য সুন্দর।',
  'banana-mango': 'ব্যানানা ম্যাংগো লম্বাটে গড়ন, সুগন্ধি শাঁস ও নরম মিষ্টি স্বাদের জন্য পরিচিত। সহজে কেটে পরিবেশন করা যায় এবং বাচ্চাদের নাশতা বা স্মুদির জন্যও ভালো।',
  'khejurer-patali-gur': 'খাঁটি খেজুরের রস জ্বাল দিয়ে তৈরি পাটালি গুড়ের স্বাদ গাঢ়, সুগন্ধি ও ঐতিহ্যবাহী। পিঠা, পায়েস, ক্ষীর, চা কিংবা শীতের নানান ঘরোয়া মিষ্টান্নে ব্যবহার করতে পারেন।',
  'khejurer-jhola-gur': 'খেজুরের ঝোলা গুড়ের ঘন তরল মিষ্টতা পিঠা, পুলি, পায়েস ও দুধের সঙ্গে চমৎকার মানিয়ে যায়। শীতের সকালের নাশতা বা ঘরে তৈরি ডেজার্টে দেশি স্বাদের উষ্ণতা যোগ করে।',
  'khejurer-norom-danadar-gur': 'নরম দানাদার খেজুরের গুড়ের গঠন নরম, দানাদার এবং স্বাদে গভীর ক্যারামেলি মিষ্টতা আছে। পিঠা, মুড়ি, রুটি বা গরম দুধের সঙ্গে পরিবেশনের জন্য উপযোগী।',
  'khejurer-chocolate-gur': 'খেজুরের চকলেট গুড় ঐতিহ্যবাহী গুড়ের মিষ্টতার সঙ্গে সমৃদ্ধ চকলেটি স্বাদের একটি ভিন্নধর্মী আয়োজন। নাশতা, ডেজার্ট বা উপহার হিসেবে পরিবেশন করতে পারেন।',
  'homemade-turmeric-powder': 'নির্বাচিত শুকনা হলুদ থেকে প্রস্তুত ঘরোয়া হলুদের গুঁড়া প্রতিদিনের মাছ, মাংস, ডাল ও সবজি রান্নায় রং ও উষ্ণ স্বাদ যোগ করে। শুকনা, ঠান্ডা জায়গায় বায়ুরোধী পাত্রে রাখলে গুণগত মান ভালো থাকে।',
  'homemade-chili-powder': 'বাছাই করা শুকনা মরিচ থেকে তৈরি এই গুঁড়া রান্নায় ঝাল ও রঙের সুন্দর ভারসাম্য আনে। ভর্তা, ভুনা, ঝোল কিংবা মেরিনেশনে প্রয়োজনমতো ব্যবহার করুন।',
  'homemade-coriander-powder': 'সুগন্ধি ধনিয়ার বীজ গুঁড়া করে তৈরি এই মসলা মাছ, মাংস, ডাল ও সবজি রান্নার স্বাদ বাড়ায়। রান্নার শেষ দিকে ব্যবহার করলে এর প্রাকৃতিক সুবাস আরও ভালোভাবে পাওয়া যায়।',
  'natural-honeycomb-honey': 'প্রাকৃতিক চাকের মধুতে ফুলের উৎস ও মৌসুমভেদে রং, ঘনত্ব ও স্বাদে স্বাভাবিক ভিন্নতা থাকতে পারে। রুটি, দই, ফল, চা বা দৈনন্দিন খাবারে প্রাকৃতিক মিষ্টতা যোগ করতে ব্যবহার করুন।',
  'wooden-ghani-mustard-oil': 'কাঠের ঘানিতে ভাঙানো সরিষার তেল বাঙালি রান্নার পরিচিত ঝাঁঝ ও সুগন্ধ দেয়। ভর্তা, আচার, মাছ ভাজা ও ভুনা রান্নায় ব্যবহার করে ঘরোয়া স্বাদ উপভোগ করুন।',
  'cold-pressed-coconut-oil': 'নির্বাচিত নারিকেল থেকে কোল্ড প্রেসড পদ্ধতিতে প্রস্তুত এই তেলে নারিকেলের স্বাভাবিক গন্ধ ও স্বাদ বজায় থাকে। ব্যবহার করার আগে প্যাকের নির্দেশনা দেখুন এবং ঠান্ডা, শুকনা স্থানে সংরক্ষণ করুন।',
  'mixed-dry-fruits': 'বাদাম ও ড্রাই ফ্রুটসের বাছাই করা মিশ্রণ ব্যস্ত দিনের নাশতা, ভ্রমণ বা অতিথি আপ্যায়নের জন্য উপযোগী। দই, ওটস, সালাদ বা ডেজার্টের সঙ্গে মিশিয়েও খেতে পারেন।',
  'cashew-nuts': 'মোলায়েম গঠন ও মৃদু মিষ্টি স্বাদের কাজুবাদাম নাশতা, পোলাও, কোরমা ও ডেজার্টে ব্যবহার করা যায়। পরিবেশনের আগে হালকা ভেজে নিলে এর সুগন্ধ ও কচকচে ভাব আরও বাড়ে।',
  'almonds': 'কাঠবাদাম কচকচে গঠন ও মৃদু বাদামি স্বাদের জন্য দৈনন্দিন নাশতার পরিচিত পছন্দ। সালাদ, ওটস, স্মুদি বা বেকিংয়ের টপিং হিসেবে ব্যবহার করতে পারেন।',
  'walnuts': 'আখরোটের স্বতন্ত্র স্বাদ ও কচকচে গঠন নাশতা, সালাদ ও বেকিংয়ের সঙ্গে ভালো মানায়। বায়ুরোধী পাত্রে রাখলে এর স্বাভাবিক সতেজতা দীর্ঘদিন বজায় থাকে।',
  'mabroom-dates': 'মাবরুম খেজুর লম্বাটে গড়ন, নরম চিবোনো গঠন ও পরিমিত মিষ্টতার জন্য জনপ্রিয়। ইফতার, সকালের নাশতা বা অতিথি আপ্যায়নের জন্য সুন্দর একটি প্রিমিয়াম পছন্দ।',
  'sukkari-dates': 'সুক্কারি খেজুর প্রাকৃতিক মিষ্টি স্বাদ ও নরম, মোলায়েম গঠনের জন্য পরিচিত। চা-কফির সঙ্গে, ইফতারে বা দ্রুত শক্তির নাশতা হিসেবে পরিবেশন করতে পারেন।',
  'mariam-dates': 'মরিয়ম খেজুরের স্বাদ মৃদু মিষ্টি এবং গঠন নরম ও আরামদায়ক। প্রতিদিনের নাশতা, ইফতার কিংবা ফল ও বাদামের প্ল্যাটারের সঙ্গে পরিবেশনের জন্য উপযোগী।',
  'ajwa-dates': 'আজওয়া খেজুর গাঢ় রং, স্বতন্ত্র সুগন্ধ ও সমৃদ্ধ স্বাদের জন্য প্রিমিয়াম খেজুর হিসেবে পরিচিত। ইফতার, উপহার বা দৈনন্দিন পরিমিত নাশতায় এটি বিশেষ পছন্দ।',
  'medjool-dates': 'মেডজুল খেজুর আকারে বড়, নরম ও রসালো গঠনের সঙ্গে ক্যারামেলি মিষ্টি স্বাদ দেয়। স্ন্যাকস, চিজ প্ল্যাটার, স্মুদি বা ডেজার্টে প্রাকৃতিক মিষ্টতা যোগ করতে ব্যবহার করুন।',
  'honey-nuts': 'মধুতে প্রস্তুত বাদামের এই মিশ্রণ মিষ্টি, কচকচে ও সহজে পরিবেশনযোগ্য নাশতা। চা-কফির সঙ্গে, দইয়ের টপিং হিসেবে বা ছোট উপহার হিসেবেও দারুণ।',
  'gawa-ghee': 'গাওয়া ঘি ভাত, খিচুড়ি, পোলাও, হালুয়া ও পায়েসে সমৃদ্ধ সুগন্ধ ও ঐতিহ্যবাহী স্বাদ যোগ করে। পরিষ্কার, শুকনা চামচ ব্যবহার করে ঢাকনা বন্ধ অবস্থায় সংরক্ষণ করুন।',
  'chapainawabganj-pera-pata-sandesh': 'চাঁপাইনবাবগঞ্জের প্যাড়া পাতা সন্দেশ নরম গঠন, হালকা মিষ্টতা ও ঐতিহ্যবাহী পরিবেশনের জন্য পরিচিত। অতিথি আপ্যায়ন, উৎসব বা পরিবারের সঙ্গে মিষ্টিমুখে সুন্দর পছন্দ।',
  'chapainawabganj-roshkodom': 'চাঁপাইনবাবগঞ্জের রসকদমে নরম মিষ্টির ভেতরে রসালো স্বাদের মজার অভিজ্ঞতা পাওয়া যায়। ঘরোয়া আয়োজন, অতিথি আপ্যায়ন ও উৎসবের মিষ্টির প্ল্যাটারে পরিবেশন করতে পারেন।',
  'ghee-fried-lachcha-semai': 'ঘিয়ে ভাজা লাচ্চা সেমাইয়ের সুগন্ধি স্তর ও মুচমুচে গঠন উৎসবের ডেজার্টকে আরও আনন্দময় করে। গরম দুধ, বাদাম ও কিশমিশের সঙ্গে রান্না করে পরিবেশন করুন।',
};

// Every item has a gallery of at least two online photos. The date-palm jaggery
// sources below are plain product photos without seller text in the image.
const categoryGallery = {
  mango: ['https://goamango.com/static/media/GoaMango_1.31f324cd5c29a356e6c4.jpg', 'https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D1920%2Cfit%3Dcrop/AE07NgprG1tlPwzK/10-AE07ZB7a9KIEXqBJ.jpg'],
  'khejurer-gur': ['https://www.sunamganjerkhobor.com/images/news/36/35987.png?newst=1765516380', 'https://quanly.kiot360.vn/datafiles/264/2025-06/58076232-su-khac-biet-duong-thot-not-1.png'],
  'spices-cooking-essentials': ['https://images.unsplash.com/photo-1599909533630-1b659ad4b86f?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=1200&q=85'],
  'honey-natural-oils': ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=1200&q=85'],
  'dry-fruits-nuts-dates': ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1200&q=85'],
  'ghee-dairy-traditional-sweets': ['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=1200&q=85'],
};

const galleryFor = (categorySlug, primaryImage) => {
  const gallery = categoryGallery[categorySlug] || [];
  if (categorySlug === 'khejurer-gur') return Array.from(new Set([primaryImage, ...gallery].filter(Boolean))).slice(0, 2);
  return Array.from(new Set([primaryImage, ...gallery].filter(Boolean))).slice(0, 3);
};

const weightVariationsFor = (basePrice) => [
  ['1 kg', 1], ['2 kg', 1.96], ['3 kg', 2.91], ['5 kg', 4.8], ['10 kg', 9.4],
].map(([type, multiplier]) => ({ type, price: Math.round(basePrice * multiplier), salePrice: null, isOnSale: false }));

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Copy .env.example to .env and configure it.');
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || 'deshi_buy');
  const now = new Date();
  try {
    const categoryIds = {};
    for (const category of categories) {
      const result = await db.collection('categories').findOneAndUpdate(
        { slug: category.slug },
        { $set: { ...category, isActive: true, updatedAt: now }, $setOnInsert: { createdAt: now } },
        { upsert: true, returnDocument: 'after' }
      );
      categoryIds[category.slug] = result._id.toString();
    }
    for (const [name, slug, categorySlug, price, description, isTrending, isBestSeller, image, sizes = ['১ কেজি']] of products) {
      await db.collection('products').updateOne(
        { slug },
        { $set: { name, slug, description: productDescriptions[slug] || description, shortDescription: 'খাঁটি ও প্রাকৃতিক দেশি পণ্য', price, regularPrice: price, salePrice: null, comparePrice: null, isOnSale: false, images: galleryFor(categorySlug, image), category: categoryIds[categorySlug], categories: [categoryIds[categorySlug]], subcategory: '', subcategories: [], brand: '', sizes: [], colors: [], weightVariations: weightVariationsFor(price), stock: 50, tags: [categorySlug, 'deshi-buy', 'price-review'], isTrending, isFeatured: isTrending, isBestSeller, isNew: true, isBridal: false, isActive: true, updatedAt: now }, $setOnInsert: { createdAt: now } },
        { upsert: true }
      );
    }
    console.log(`Deshi Buy catalog ready: ${products.length} products.`);
  } finally {
    await client.close();
  }
}

main().catch((error) => { console.error(error.message); process.exit(1); });
