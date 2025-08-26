import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

// Initialize Bedrock client
const bedrockClient = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are set
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('Missing AWS credentials:', {
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });
      return NextResponse.json(
        { error: 'AWS credentials not configured' },
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

    // Prepare the input for the Bedrock agent
    const input = {
      agentId: agentId,
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID || 'TSTALIASID',
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
      name: error instanceof Error ? error.name : 'Unknown'
    });
    return NextResponse.json(
      { error: 'Failed to communicate with Bedrock agent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
