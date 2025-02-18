import { Router } from 'express';
import { LLMService } from '../services/llm';

const router = Router();
const llmService = new LLMService();

// Product knowledge base - can be expanded
const productInfo = {
  features: [
    {
      name: 'Copy Trading',
      description: 'Automatically copy trades from successful traders in real-time',
    },
    {
      name: 'AI Insights',
      description: 'Get AI-powered analysis of trading strategies and market trends',
    },
    {
      name: 'Social Feed',
      description: 'Follow and interact with other traders, share strategies and insights',
    },
    {
      name: 'Risk Management',
      description: 'Advanced tools to manage your trading risk and exposure',
    },
  ],
  screens: {
    welcome: {
      name: 'Welcome/Initial Setup',
      features: [
        'Default Copier status for new users',
        'Interest Assessment for personalized AI recommendations',
        'Initial risk management parameters setup',
        'Get Started onboarding',
      ],
    },
    copier: {
      home: {
        name: 'Copier Home Screen',
        features: [
          'Posts and updates feed from followed traders',
          'Create Post functionality',
          'Comment and like on posts',
          'AI post summarization',
        ],
      },
      discover: {
        name: 'Copier Discover Screen',
        features: [
          'Leader search functionality',
          'Top Leaders leaderboard with filtering',
          'Follow Leaders feature',
          'Top Strategies list',
          'AI-recommended Strategies',
          'Autocopy Strategy feature',
          'Trending assets list',
        ],
      },
      reports: {
        name: 'Copier Reports Screen',
        features: [
          'Open positions list by Leader',
          'Trade details view',
          'Emergency Stop functionality',
        ],
      },
      profile: {
        name: 'Copier Profile Screen',
        features: [
          'Profile management',
          'Balance display',
          'Follow/Unfollow functionality',
          'Leader upgrade option',
          'Follower statistics',
          'Risk management settings',
          'Copied Strategies list',
        ],
      },
    },
    leader: {
      home: {
        name: 'Leader Home Screen',
        features: ['Social feed access', 'Post creation and management', 'Engagement features'],
      },
      discover: {
        name: 'Leader Discover Screen',
        features: ['Market exploration', 'Trending assets view', 'Strategy discovery'],
      },
      reports: {
        name: 'Leader Reports Screen',
        features: [
          'Personal open trades list',
          'Trade management',
          'Historical statements',
          'Copier statistics overview',
        ],
      },
      profile: {
        name: 'Leader Profile Screen',
        features: [
          'Professional profile management',
          'Performance statistics',
          'Strategy creation and management',
          'Copier tracking',
          'Follower management',
        ],
      },
    },
  },
  pricing: {
    basic: {
      name: 'Basic',
      price: 'Free',
      features: ['Limited copy trading', 'Basic AI insights', 'Social feed access'],
    },
    pro: {
      name: 'Pro',
      price: '$29.99/month',
      features: ['Unlimited copy trading', 'Advanced AI insights', 'Priority support'],
    },
  },
  support: {
    email: 'support@socialtrading.com',
    hours: '24/7',
    response_time: 'Within 24 hours',
  },
};

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `
      You are a helpful Trade support AI for a social trading platform. Use the following product information to answer user questions accurately and professionally:

      ${JSON.stringify(productInfo, null, 2)}

      User message: ${message}

      Instructions:
      1. Answer based on the product information provided
      2. When explaining features or screens:
         • Clearly explain how to navigate to the specific page/feature
         • Use bullet points for step-by-step navigation
         • Highlight key buttons or menu items to look for
      3. If you're not sure about something, be honest and suggest contacting support
      4. Keep responses clear and concise
      5. Be friendly and professional
      6. If the question is not about our product, politely redirect to product-related topics

      Example navigation format:
      To access [Feature/Screen]:
      • Click on [Button/Menu] in the navigation bar
      • Look for [Specific Element] on the page
      • Select/Click [Option/Button] to proceed

      Respond in a natural, conversational way, always including navigation steps when discussing features.
    `;

    const answer = await llmService.generateChatResponse(prompt);

    res.json({ answer });
  } catch (error) {
    console.error('[Chat] Error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;
