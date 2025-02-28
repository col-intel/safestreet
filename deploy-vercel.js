#!/usr/bin/env node

/**
 * Helper script for deploying to Vercel
 * 
 * This script helps with:
 * 1. Checking if Vercel CLI is installed
 * 2. Checking if the project is set up correctly
 * 3. Deploying to Vercel
 * 
 * Usage: node deploy-vercel.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🚀 Safe Street Vercel Deployment Helper');
  console.log('---------------------------------------');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI is installed');
  } catch (error) {
    console.log('❌ Vercel CLI is not installed');
    console.log('Please install it with: npm install -g vercel');
    process.exit(1);
  }
  
  // Check if the user is logged in to Vercel
  try {
    execSync('vercel whoami', { stdio: 'ignore' });
    console.log('✅ You are logged in to Vercel');
  } catch (error) {
    console.log('❌ You are not logged in to Vercel');
    console.log('Please log in with: vercel login');
    process.exit(1);
  }
  
  // Check if vercel.json exists
  if (fs.existsSync('vercel.json')) {
    console.log('✅ vercel.json exists');
  } else {
    console.log('❌ vercel.json does not exist');
    process.exit(1);
  }
  
  // Ask if this is a production deployment
  const isProduction = (await prompt('Is this a production deployment? (y/n): ')).toLowerCase() === 'y';
  
  // Ask if the user wants to set up a custom domain
  const setupCustomDomain = (await prompt('Do you want to set up the custom domain www.ruasegura.pt? (y/n): ')).toLowerCase() === 'y';
  
  // Deploy to Vercel
  try {
    console.log('Deploying to Vercel...');
    
    if (isProduction) {
      execSync('vercel --prod', { stdio: 'inherit' });
    } else {
      execSync('vercel', { stdio: 'inherit' });
    }
    
    console.log('✅ Deployment successful');
    
    // Set up custom domain if requested
    if (setupCustomDomain) {
      console.log('Setting up custom domain...');
      
      try {
        // Add the domain
        execSync('vercel domains add www.ruasegura.pt', { stdio: 'inherit' });
        console.log('✅ Domain www.ruasegura.pt added');
        
        // Add the apex domain and set up a redirect
        const addApexDomain = (await prompt('Do you want to add the apex domain ruasegura.pt and set up a redirect? (y/n): ')).toLowerCase() === 'y';
        
        if (addApexDomain) {
          execSync('vercel domains add ruasegura.pt', { stdio: 'inherit' });
          console.log('✅ Domain ruasegura.pt added');
          
          // Set up redirect from apex to www
          execSync('vercel domains inspect ruasegura.pt', { stdio: 'inherit' });
          console.log('\nTo set up a redirect from ruasegura.pt to www.ruasegura.pt:');
          console.log('1. Go to your domain registrar');
          console.log('2. Set up a CNAME record for www pointing to cname.vercel-dns.com');
          console.log('3. Set up an A record for @ (apex) pointing to 76.76.21.21');
        }
      } catch (error) {
        console.log('❌ Error setting up custom domain:', error.message);
        console.log('You can set it up manually in the Vercel dashboard');
      }
    }
    
    console.log('\n🎉 Deployment process completed!');
    console.log('\nNext steps:');
    console.log('1. Set up environment variables in the Vercel dashboard');
    console.log('2. Connect to a PostgreSQL database in the Vercel dashboard');
    console.log('3. Run the migration script if needed');
    
  } catch (error) {
    console.log('❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 