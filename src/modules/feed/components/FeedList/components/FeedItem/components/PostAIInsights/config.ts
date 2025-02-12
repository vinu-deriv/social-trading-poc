export type PostSentiment =
    // Suspicious
    | "pump_and_dump"
    | "spam"
    | "misleading"
    | "high_risk"
    // Legitimate
    | "conservative"
    | "consistent"
    | "verified_strategy"
    | "risk_managed"
    // Neutral
    | "educational"
    | "analysis"
    | "discussion"
    | "update";

type BadgeVariant =
    | "success"
    | "warning"
    | "neutral"
    | "brand"
    | "failed"
    | "info";

interface SentimentConfig {
    text: string;
    variant: BadgeVariant;
    icon?: string;
}

export const sentimentConfig: Record<PostSentiment, SentimentConfig> = {
    // Suspicious Activities
    pump_and_dump: {
        text: "Pump & Dump Alert",
        variant: "warning",
        icon: "⚠️",
    },
    spam: {
        text: "Spam Content",
        variant: "warning",
        icon: "🚫",
    },
    misleading: {
        text: "Misleading Info",
        variant: "warning",
        icon: "⚠️",
    },
    high_risk: {
        text: "High Risk",
        variant: "failed",
        icon: "⚡",
    },

    // Legitimate Activities
    conservative: {
        text: "Conservative Strategy",
        variant: "success",
        icon: "🛡️",
    },
    consistent: {
        text: "Consistent Performance",
        variant: "success",
        icon: "📈",
    },
    verified_strategy: {
        text: "Verified Strategy",
        variant: "success",
        icon: "✓",
    },
    risk_managed: {
        text: "Risk Managed",
        variant: "success",
        icon: "⚖️",
    },

    // Neutral Activities
    educational: {
        text: "Educational",
        variant: "info",
        icon: "📚",
    },
    analysis: {
        text: "Analysis",
        variant: "info",
        icon: "📊",
    },
    discussion: {
        text: "Discussion",
        variant: "neutral",
        icon: "💭",
    },
    update: {
        text: "Update",
        variant: "neutral",
        icon: "📝",
    },
};

export const getSentimentDetails = (
    sentiment: PostSentiment
): SentimentConfig => {
    return sentimentConfig[sentiment];
};
