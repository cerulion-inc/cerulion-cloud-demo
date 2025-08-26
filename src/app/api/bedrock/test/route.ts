import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'not set',
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID || 'not set',
      nodeEnv: process.env.NODE_ENV,
    };

    console.log('Environment check:', envCheck);

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
