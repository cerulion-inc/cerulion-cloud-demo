import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

// Initialize Bedrock client
const bedrockClient = new BedrockAgentRuntimeClient({
  region: process.env.AMAZON_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Enhanced environment variable checking with detailed logging
    const envVars = {
      AMAZON_ACCESS_KEY_ID: process.env.AMAZON_ACCESS_KEY_ID ? 'SET' : 'MISSING',
      AMAZON_SECRET_ACCESS_KEY: process.env.AMAZON_SECRET_ACCESS_KEY ? 'SET' : 'MISSING',
      AMAZON_REGION: process.env.AMAZON_REGION ? 'SET' : 'MISSING',
      BEDROCK_AGENT_ALIAS_ID: process.env.BEDROCK_AGENT_ALIAS_ID ? 'SET' : 'MISSING',
    };
    
    console.log('Environment variables status:', envVars);
    
    const missingVars = [];
    if (!process.env.AMAZON_ACCESS_KEY_ID) missingVars.push('AMAZON_ACCESS_KEY_ID');
    if (!process.env.AMAZON_SECRET_ACCESS_KEY) missingVars.push('AMAZON_SECRET_ACCESS_KEY');
    if (!process.env.AMAZON_REGION) missingVars.push('AMAZON_REGION');
    if (!process.env.BEDROCK_AGENT_ALIAS_ID) missingVars.push('BEDROCK_AGENT_ALIAS_ID');
    
    if (missingVars.length > 0) {
      console.error('Missing required environment variables:', missingVars);
      console.error('Environment variables status:', envVars);
      return NextResponse.json(
        { 
          error: 'AWS credentials not configured', 
          missing: missingVars,
          envStatus: envVars,
          message: 'Please check your environment variables in the Amplify console',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    const { message, agentId, sessionId } = await request.json();

    if (!message || !agentId) {
      return NextResponse.json(
        { error: 'Message and agentId are required' },
        { status: 400 }
      );
    }

    // Log the request for debugging
    console.log('Bedrock API request:', {
      agentId,
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
      sessionId: sessionId || `session-${Date.now()}`,
      messageLength: message.length,
      region: process.env.AMAZON_REGION,
      hasCredentials: !!(process.env.AMAZON_ACCESS_KEY_ID && process.env.AMAZON_SECRET_ACCESS_KEY)
    });

    // Prepare the input for the Bedrock agent
    const input = {
      agentId: agentId,
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID!,
      sessionId: sessionId || `session-${Date.now()}`,
      inputText: message,
    };

    const command = new InvokeAgentCommand(input);
    const response = await bedrockClient.send(command);

    // Handle streaming response
    let responseText = '';
    if (response.completion) {
      // Handle streaming response by iterating through chunks
      for await (const chunk of response.completion) {
        if (chunk.chunk?.bytes) {
          const decoder = new TextDecoder();
          responseText += decoder.decode(chunk.chunk.bytes);
        }
      }
    }

    console.log('Bedrock API response received:', {
      responseLength: responseText.length,
      sessionId: input.sessionId
    });

    return NextResponse.json({
      response: responseText,
      sessionId: input.sessionId,
      agentId: agentId,
    });

  } catch (error) {
    console.error('Bedrock API error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
      timestamp: new Date().toISOString(),
      envVars: {
        hasAccessKey: !!process.env.AMAZON_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AMAZON_SECRET_ACCESS_KEY,
        hasRegion: !!process.env.AMAZON_REGION,
        hasAgentAlias: !!process.env.BEDROCK_AGENT_ALIAS_ID
      }
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to communicate with Bedrock agent';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('credentials')) {
        errorMessage = 'AWS credentials are invalid or expired';
        statusCode = 401;
      } else if (error.message.includes('region')) {
        errorMessage = 'Invalid AWS region specified';
        statusCode = 400;
      } else if (error.message.includes('agent')) {
        errorMessage = 'Invalid Bedrock agent ID or alias';
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        envVars: {
          hasAccessKey: !!process.env.AMAZON_ACCESS_KEY_ID,
          hasSecretKey: !!process.env.AMAZON_SECRET_ACCESS_KEY,
          hasRegion: !!process.env.AMAZON_REGION,
          hasAgentAlias: !!process.env.BEDROCK_AGENT_ALIAS_ID
        }
      },
      { status: statusCode }
    );
  }
}
