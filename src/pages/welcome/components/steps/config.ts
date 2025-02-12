interface FeatureCard {
  title: string;
  content: string;
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Expert Traders",
    content: "Follow and copy trades from successful traders with proven track records.",
  },
  {
    title: "Risk Management",
    content: "Set your risk levels and investment limits to trade within your comfort zone.",
  },
  {
    title: "Real-Time Updates",
    content: "Stay informed with instant notifications and performance tracking.",
  },
  {
    title: "AI-Powered Matching",
    content: "Our AI system matches you with traders who best fit your trading style and risk tolerance.",
  },
] as const;
