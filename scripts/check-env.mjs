#!/usr/bin/env node

/* global process, console */

/**
 * Simple script to check that all required environment variables are set
 * before running tests. This helps identify configuration issues early.
 */

// Define required variables and their friendly names
const requiredVars = {
  SUPABASE_URL: "Supabase URL",
  SUPABASE_KEY: "Supabase Anon Key",
  E2E_USERNAME: "E2E Test Username",
  E2E_PASSWORD: "E2E Test Password",
};

// Define optional but helpful variables
const optionalVars = {
  VITE_SUPABASE_URL: "Vite Supabase URL",
  VITE_SUPABASE_KEY: "Vite Supabase Anon Key",
  E2E_USERNAME_ID: "E2E Test Username ID",
};

console.log("Checking environment variables for E2E tests...");

// Check required variables
let missingRequired = false;
for (const [varName, friendlyName] of Object.entries(requiredVars)) {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName} (${friendlyName})`);
    missingRequired = true;
  } else {
    console.log(`✅ Found ${friendlyName}`);
  }
}

// Check optional variables
for (const [varName, friendlyName] of Object.entries(optionalVars)) {
  if (!process.env[varName]) {
    console.warn(`⚠️ Missing optional environment variable: ${varName} (${friendlyName})`);
  } else {
    console.log(`✅ Found ${friendlyName}`);
  }
}

// Check URL formatting
if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.startsWith("https://")) {
  console.warn(`⚠️ SUPABASE_URL should start with https:// (${process.env.SUPABASE_URL.slice(0, 10)}...)`);
}

// Check if vite variables match the regular ones
if (
  process.env.SUPABASE_URL &&
  process.env.VITE_SUPABASE_URL &&
  process.env.SUPABASE_URL !== process.env.VITE_SUPABASE_URL
) {
  console.warn("⚠️ SUPABASE_URL and VITE_SUPABASE_URL have different values");
}

if (
  process.env.SUPABASE_KEY &&
  process.env.VITE_SUPABASE_KEY &&
  process.env.SUPABASE_KEY !== process.env.VITE_SUPABASE_KEY
) {
  console.warn("⚠️ SUPABASE_KEY and VITE_SUPABASE_KEY have different values");
}

// Exit with error if required variables are missing
if (missingRequired) {
  console.error("❌ Missing required environment variables. Tests may fail.");
  process.exit(1);
} else {
  console.log("✅ All required environment variables are set!");
  process.exit(0);
}
