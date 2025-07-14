// Production Database Setup Script
// Run this script to create the reviews table in your production database

import { neon } from '@neondatabase/serverless';

const setupDatabase = async () => {
  // Use your production DATABASE_URL here
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable not found');
    console.log('Please set your DATABASE_URL environment variable and try again.');
    process.exit(1);
  }

  console.log('🔗 Connecting to database...');
  const sql = neon(databaseUrl);

  try {
    // Create reviews table if it doesn't exist
    console.log('📋 Creating reviews table...');
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        appearance INTEGER NOT NULL,
        punctuality INTEGER NOT NULL,
        communication INTEGER NOT NULL,
        professionalism INTEGER NOT NULL,
        chemistry INTEGER NOT NULL,
        discretion INTEGER NOT NULL,
        would_book_again BOOLEAN NOT NULL,
        booking_process_smooth BOOLEAN NOT NULL,
        matched_description BOOLEAN NOT NULL,
        service_types TEXT[] NOT NULL,
        additional_comments TEXT,
        is_approved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    // Create appointments table if it doesn't exist
    console.log('📅 Creating appointments table...');
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        duration TEXT NOT NULL,
        service TEXT NOT NULL,
        location TEXT NOT NULL,
        message TEXT,
        webhook_sent BOOLEAN DEFAULT false,
        webhook_response TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    // Create users table if it doesn't exist
    console.log('👤 Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `;

    // Check if we have any reviews
    const reviewCount = await sql`SELECT COUNT(*) as count FROM reviews`;
    console.log(`📊 Current reviews in database: ${reviewCount[0].count}`);

    // Insert test review if no reviews exist
    if (reviewCount[0].count === '0') {
      console.log('➕ Adding test review...');
      await sql`
        INSERT INTO reviews (
          name, email, appearance, punctuality, communication, 
          professionalism, chemistry, discretion, would_book_again,
          booking_process_smooth, matched_description, service_types,
          additional_comments, is_approved
        ) VALUES (
          'Alex Thompson',
          'alex.thompson@email.com',
          5, 5, 5, 5, 5, 5,
          true, true, true,
          '{"Companion Services", "Social Events"}',
          'Outstanding experience. Bobby exceeded all expectations with professionalism and genuine connection.',
          true
        )
      `;
      console.log('✅ Test review added successfully');
    }

    // Verify the setup
    const finalReviewCount = await sql`SELECT COUNT(*) as count FROM reviews WHERE is_approved = true`;
    console.log(`🎉 Setup complete! Approved reviews: ${finalReviewCount[0].count}`);
    
    console.log('\n🚀 Your database is ready! The reviews should now appear on your deployed site.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('\nTroubleshooting tips:');
    console.error('1. Verify your DATABASE_URL is correct');
    console.error('2. Check that your database allows connections');
    console.error('3. Ensure you have write permissions to the database');
    process.exit(1);
  }
};

setupDatabase();