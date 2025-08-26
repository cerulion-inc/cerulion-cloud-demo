# AWS Bedrock Integration Setup

This project now includes AWS Bedrock agent integration for the chat functionality. Follow these steps to set up your environment:

## Prerequisites

1. AWS Account with access to Bedrock
2. Bedrock Agent created and configured
3. AWS credentials with appropriate permissions

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Bedrock Agent ID (optional - can be set in the component)
NEXT_PUBLIC_BEDROCK_AGENT_ID=your_bedrock_agent_id_here
```

## Required AWS Permissions

Your AWS user/role needs the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeAgent",
                "bedrock:InvokeModel"
            ],
            "Resource": "*"
        }
    ]
}
```

## Configuration Steps

1. **Create a Bedrock Agent**:
   - Go to AWS Bedrock console
   - Create a new agent or use an existing one
   - Note down the Agent ID

2. **Set Environment Variables**:
   - Copy the `.env.local.example` to `.env.local`
   - Fill in your AWS credentials and agent ID

3. **Update Agent ID**:
   - In `src/components/simulator/chat.tsx`, replace `'your-agent-id'` with your actual agent ID
   - Or set it via the `NEXT_PUBLIC_BEDROCK_AGENT_ID` environment variable

## Testing

1. Start your development server: `npm run dev`
2. Navigate to the simulator page
3. Try sending a message to test the Bedrock integration

## Troubleshooting

- **403 Forbidden**: Check your AWS credentials and permissions
- **Agent not found**: Verify your agent ID is correct
- **Region issues**: Ensure your agent is in the same region as specified in AWS_REGION

## Security Notes

- Never commit `.env.local` to version control
- Use IAM roles with minimal required permissions
- Consider using AWS Secrets Manager for production deployments
