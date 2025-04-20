# OpenRouter Integration Guide

This guide explains how to use OpenRouter with the Mood Journey API to access Claude and other AI models.

## What is OpenRouter?

[OpenRouter](https://openrouter.ai/) is a unified API gateway that provides access to various AI models, including:

- Anthropic's Claude models
- OpenAI's GPT models
- Meta's Llama models
- And many others

Using OpenRouter instead of connecting directly to Claude offers several advantages:
- Simplified API (uses the OpenAI API format)
- Potentially lower costs
- Ability to easily switch between different models
- Fallback options if one model is unavailable

## Setup Instructions

### 1. Create an OpenRouter Account

1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Navigate to the API Keys section
3. Create a new API key with appropriate permissions

### 2. Update Environment Variables

In your `.env` file, add:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_REFERRER=https://yourdomain.com
```

The `OPENROUTER_REFERRER` should be set to your application's domain. For local development, you can use `http://localhost:8000`.

### 3. Using OpenRouter in Your Code

The Mood Journey API is already configured to use OpenRouter. The implementation can be found in `api/services/ai_service.py`:

```python
# Initialize OpenAI client with OpenRouter base URL and API key
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
    default_headers={
        "HTTP-Referer": settings.OPENROUTER_REFERRER
    }
)

# Call OpenRouter API with Claude model
response = client.chat.completions.create(
    model="anthropic/claude-3-opus-20240229",  # OpenRouter model identifier
    messages=[
        {"role": "system", "content": "System message here"},
        {"role": "user", "content": "User message here"}
    ],
    max_tokens=4000
)
```

## Available Models

OpenRouter provides access to many models. For the Mood Journey API, we recommend:

| Model | OpenRouter Identifier | Best For |
|-------|------------------------|----------|
| Claude 3 Opus | `anthropic/claude-3-opus-20240229` | Highest quality responses, complex reasoning |
| Claude 3 Sonnet | `anthropic/claude-3-sonnet-20240229` | Good balance of quality and speed |
| Claude 3 Haiku | `anthropic/claude-3-haiku-20240307` | Fastest responses, lower cost |
| GPT-4 | `openai/gpt-4-turbo` | Alternative to Claude |

To change the model, modify the `model` parameter in the OpenRouter API call in `api/services/ai_service.py`.

## Monitoring Usage

OpenRouter provides a dashboard where you can:
- Monitor your API usage
- Track costs
- View request history
- Set spending limits

Visit your [OpenRouter dashboard](https://openrouter.ai/dashboard) to access these features.

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Ensure your API key is correct
   - Check that your API key has the necessary permissions

2. **Model Not Available**:
   - Some models may be temporarily unavailable
   - Try using a different model as a fallback

3. **Rate Limiting**:
   - OpenRouter may impose rate limits
   - Implement exponential backoff for retries

4. **Response Format Issues**:
   - Different models may return slightly different formats
   - Ensure your parsing logic is robust

### Debugging Tips

Add logging to track API requests and responses:

```python
import logging
logger = logging.getLogger(__name__)

try:
    # Log the request
    logger.info(f"Sending request to OpenRouter: {prompt[:100]}...")
    
    # Make the API call
    response = client.chat.completions.create(...)
    
    # Log the response
    logger.info(f"Received response from OpenRouter: {response.choices[0].message.content[:100]}...")
    
except Exception as e:
    logger.error(f"Error calling OpenRouter API: {str(e)}")
```

## Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference) (OpenRouter uses the same format)
- [Claude Documentation](https://docs.anthropic.com/claude/docs)
