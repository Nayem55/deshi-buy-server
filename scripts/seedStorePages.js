require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { MongoClient } = require('mongodb');

const pages = [
  {
    title: 'About Us',
    slug: 'about-us',
    metaDescription: 'Learn about Deshi Buy and our promise of pure, seasonal Bangladeshi food.',
    content: `
      <h2>দেশি স্বাদের বিশ্বাসযোগ্য ঠিকানা</h2>
      <p>Deshi Buy ঘরে পৌঁছে দেয় বাংলাদেশের মৌসুমি, খাঁটি ও পরিচিত স্বাদের খাবার। বাছাই করা আম, খেজুরের গুড় এবং অন্যান্য দেশি পণ্য আমরা যত্নের সঙ্গে সংগ্রহ করি, যাতে আপনার পরিবারের টেবিলে পৌঁছায় নির্ভরযোগ্য স্বাদ।</p>
      <p>আমাদের লক্ষ্য সহজ—ভালো পণ্য, পরিষ্কার তথ্য এবং আন্তরিক সেবা। প্রতিটি অর্ডারে মান, সতেজতা ও প্যাকেজিংয়ের দিকে গুরুত্ব দেওয়া হয়।</p>
      <h3>আমাদের প্রতিশ্রুতি</h3>
      <ul><li>মৌসুমি ও বাছাই করা দেশি পণ্য</li><li>পণ্যের ওজন ও মূল্যের স্বচ্ছতা</li><li>যত্নশীল প্যাকেজিং ও সহায়ক কাস্টমার সাপোর্ট</li></ul>
    `,
  },
  {
    title: 'Shipping & Delivery',
    slug: 'shipping-delivery',
    metaDescription: 'Deshi Buy shipping and delivery information.',
    content: `
      <h2>Shipping &amp; Delivery</h2>
      <p>অর্ডার নিশ্চিত হওয়ার পর আমরা পণ্য প্রস্তুত ও পাঠানোর ব্যবস্থা করি। ডেলিভারির সময় আপনার অবস্থান, পণ্যের ধরন এবং কুরিয়ার সার্ভিসের সময়সূচির ওপর নির্ভর করতে পারে।</p>
      <h3>যা জানা জরুরি</h3>
      <ul><li>চেকআউটের সময় দেওয়া মোবাইল নম্বর ও ঠিকানা সঠিক রাখুন।</li><li>ডেলিভারি চার্জ ও প্রযোজ্য তথ্য অর্ডার দেওয়ার সময় দেখানো হবে।</li><li>মৌসুমি বা দ্রুত নষ্ট হতে পারে এমন পণ্যের ক্ষেত্রে ডেলিভারির তারিখে সামান্য পরিবর্তন হতে পারে।</li></ul>
      <p>অর্ডার সংক্রান্ত সাহায্যের জন্য আমাদের কাস্টমার কেয়ারের সঙ্গে যোগাযোগ করুন।</p>
    `,
  },
  {
    title: 'Returns & Exchanges',
    slug: 'returns-exchanges',
    metaDescription: 'Deshi Buy returns and exchanges policy.',
    content: `
      <h2>Returns &amp; Exchanges</h2>
      <p>আপনার অর্ডারে ভুল পণ্য, ক্ষতিগ্রস্ত প্যাকেট বা স্পষ্ট মানগত সমস্যা থাকলে ডেলিভারির পর যত দ্রুত সম্ভব আমাদের জানান। যাচাইয়ের পর প্রয়োজন হলে আমরা সমাধানের ব্যবস্থা করব।</p>
      <h3>রিটার্নের শর্ত</h3>
      <ul><li>পণ্যের প্যাকেট, লেবেল ও প্রমাণ হিসেবে প্রয়োজনীয় ছবি সংরক্ষণ করুন।</li><li>খোলা, ব্যবহৃত বা আংশিক খাওয়া খাদ্যপণ্য সাধারণত ফেরত বা বদলযোগ্য নয়।</li><li>পণ্যের প্রাকৃতিক রং, আকার বা স্বাদে সামান্য ভিন্নতা মৌসুমি পণ্যের স্বাভাবিক বৈশিষ্ট্য হতে পারে।</li></ul>
      <p>প্রতিটি অনুরোধ পণ্যের ধরন ও পরিস্থিতি বিবেচনা করে দেখা হয়।</p>
    `,
  },
  {
    title: 'Track Your Order',
    slug: 'track-your-order',
    metaDescription: 'Track your Deshi Buy order.',
    content: `
      <h2>আপনার অর্ডার ট্র্যাক করুন</h2>
      <p>অর্ডার দেওয়ার সময় পাওয়া অর্ডার নম্বর ও আপনার মোবাইল নম্বর ব্যবহার করে অর্ডারের বর্তমান অবস্থা দেখুন।</p>
      <p><a href="/track-order">অর্ডার ট্র্যাক করতে এখানে ক্লিক করুন</a></p>
      <p>অর্ডার নম্বর খুঁজে না পেলে বা স্ট্যাটাস নিয়ে কোনো প্রশ্ন থাকলে আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।</p>
    `,
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms-conditions',
    metaDescription: 'Terms and conditions for shopping with Deshi Buy.',
    content: `
      <h2>Terms &amp; Conditions</h2>
      <p>Deshi Buy থেকে অর্ডার করার মাধ্যমে আপনি এই শর্তগুলো মেনে নিচ্ছেন। পণ্যের প্রাপ্যতা, মৌসুমি সরবরাহ এবং ডেলিভারির এলাকার ভিত্তিতে অর্ডার গ্রহণের বিষয়টি পরিবর্তিত হতে পারে।</p>
      <ul><li>চেকআউটে দেখানো মূল্য, ওজনের ভ্যারিয়েশন এবং ডেলিভারি তথ্য অর্ডারের আগে যাচাই করুন।</li><li>সঠিক নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা দেওয়া গ্রাহকের দায়িত্ব।</li><li>প্রয়োজনে অর্ডার নিশ্চিত করতে আমাদের টিম যোগাযোগ করতে পারে।</li><li>পণ্যের ছবি উপস্থাপনার জন্য; প্রাকৃতিক বা মৌসুমি পণ্যের চেহারায় সামান্য পার্থক্য থাকতে পারে।</li></ul>
      <p>আমরা প্রয়োজন হলে এই শর্তগুলো হালনাগাদ করতে পারি।</p>
    `,
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    metaDescription: 'Deshi Buy privacy policy.',
    content: `
      <h2>Privacy Policy</h2>
      <p>আপনার গোপনীয়তা Deshi Buy-এর কাছে গুরুত্বপূর্ণ। অর্ডার সম্পন্ন করা, ডেলিভারি সমন্বয় করা এবং কাস্টমার সাপোর্ট দেওয়ার জন্য আমরা আপনার দেওয়া নাম, ফোন নম্বর, ইমেইল ও ঠিকানা ব্যবহার করি।</p>
      <h3>তথ্য কীভাবে ব্যবহার করি</h3>
      <ul><li>অর্ডার নিশ্চিতকরণ, ডেলিভারি ও সেবাসংক্রান্ত যোগাযোগে</li><li>আপনার অনুরোধ বা সমস্যার সমাধানে</li><li>আপনি সম্মতি দিলে অফার ও আপডেট পাঠাতে</li></ul>
      <p>আপনার ব্যক্তিগত তথ্য বিক্রি করা হয় না। আইনগত প্রয়োজন, নিরাপত্তা বা অর্ডার ডেলিভারির জন্য প্রয়োজনীয় সেবা অংশীদার ছাড়া আমরা তথ্য শেয়ার করি না।</p>
    `,
  },
];

async function seedPages() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const collection = client.db(process.env.MONGO_DB_NAME || 'deshi_buy').collection('pages');
  const now = new Date();

  for (const page of pages) {
    await collection.updateOne(
      { slug: page.slug },
      { $set: { ...page, isPublished: true, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
  }

  await client.close();
  console.log(`Seeded ${pages.length} store pages.`);
}

seedPages().catch((error) => {
  console.error(error);
  process.exit(1);
});
