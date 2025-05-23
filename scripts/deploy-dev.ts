// Deploy to Dev Branch Script
import { createVercelService } from '../lib/services/vercel-service';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function deployToDev() {
  try {
    console.log('Starting deployment to dev branch...');
    
    // Create the Vercel service instance
    const vercelService = createVercelService();
    
    // Get the project ID from environment variables
    const projectId = process.env.VERCEL_PROJECT_ID || process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID;
    
    if (!projectId) {
      throw new Error('No Vercel project ID found in environment variables');
    }
    
    console.log(`Using project ID: ${projectId}`);
    
    // Trigger deployment to the dev branch
    const deployment = await vercelService.triggerDeployment(projectId, 'dev');
    
    console.log('Deployment triggered successfully!');
    console.log(`Deployment ID: ${deployment.id}`);
    console.log(`Deployment URL: ${deployment.url}`);
    
    // Check deployment status
    console.log('Checking deployment status...');
    const status = await vercelService.getDeploymentStatus(deployment.id);
    console.log(`Current status: ${status.readyState}`);
    console.log('Deployment in progress. Check the Vercel dashboard for updates.');
    
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

// Run the deployment
deployToDev();
