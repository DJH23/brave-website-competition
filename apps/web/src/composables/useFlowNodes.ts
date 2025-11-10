import { reactive, readonly } from "vue";

export interface NodeCTA {
  label: string;
  route?: string;
  href?: string; // For external links
  variant?: "primary" | "secondary" | "ghost"; // Button styling
}

export interface FlowNode {
  id: string;
  label: string;
  level: "setup" | "users" | "creators";
  icon?: string;
  summary: string;
  whyMatters: string;
  bullets: string[];
  viewRoute: string;
  ctas: NodeCTA[];
  imageUrl?: string;
  videoUrl?: string;
  subGraph?: FlowNode[];
  connectedTo?: string[]; // IDs of connected nodes for keyboard navigation
}

const nodeRegistry = reactive<Record<string, FlowNode>>({
  // Setup nodes
  n0: {
    id: "n0",
    label: "Set up Brave + BAT",
    level: "setup",
    icon: "bi-rocket-takeoff",
    summary: "Get started with Brave Browser and Basic Attention Token",
    whyMatters:
      "Setting up Brave and BAT is essential to take advantage of Brave's privacy features and BAT earnings, or tipping.",
    bullets: [
      "Download and install Brave Browser",
      "Enable Shields (ad/tracker blocking) in Settings",
      "Set up a BAT wallet for Rewards (Brave Wallet or custodial)",
    ],
    viewRoute: "/wallet",
    ctas: [
      {
        label: "Download Brave",
        href: "https://brave.com/download/",
        variant: "primary",
      },
      {
        label: "Learn about BAT",
        href: "https://basicattentiontoken.org/",
        variant: "secondary",
      },
      {
        label: "Privacy Shields help",
        href: "https://support.brave.com/hc/en-us/articles/360022973471-Brave-Shields",
        variant: "ghost",
      },
    ],
    connectedTo: ["n1"],
  },
  n1: {
    id: "n1",
    label: "Enable Brave Rewards",
    level: "setup",
    icon: "bi-lightning-charge-fill",
    summary: "Activate the Brave Rewards system to start earning BAT",
    whyMatters:
      "Start earning BAT by viewing privacy-respecting ads and supporting your favorite creators.",
    bullets: [
      "Open Settings → Brave Rewards → Enable Rewards",
      "Choose your monthly ad frequency (1-10 ads/hour)",
      "Earn 70% of ad revenue directly in BAT",
    ],
    viewRoute: "/wallet",
    ctas: [
      {
        label: "Rewards FAQ",
        href: "https://brave.com/brave-rewards/",
        variant: "primary",
      },
    ],
    connectedTo: ["n0", "n2"],
  },
  n2: {
    id: "n2",
    label: "Choose payout: Custodial or Self‑custody",
    level: "setup",
    icon: "bi-shield-lock-fill",
    summary: "Select how you want to manage your BAT wallet",
    whyMatters:
      "Control your funds: custodial for ease (Uphold/Gemini), self-custody for full ownership.",
    bullets: [
      "Custodial: Easy KYC setup with Uphold, Gemini, or bitFlyer",
      "Self-custody: Use Brave Wallet (ETH/SOL) for full control",
      "Custodial required for tipping; self-custody for ads-only",
    ],
    viewRoute: "/wallet",
    ctas: [
      {
        label: "Compare wallet options",
        href: "https://support.brave.com/hc/en-us/articles/360034841711-What-is-a-verified-wallet-",
        variant: "primary",
      },
    ],
    connectedTo: ["n1", "n3"],
  },
  n3: {
    id: "n3",
    label: "Get BAT: Earn via ads or add funds",
    level: "setup",
    icon: "bi-coin",
    summary: "Acquire BAT tokens to tip creators and use in the ecosystem",
    whyMatters:
      "Fund your creator tips through passive ad earnings or direct purchase—privacy preserved either way.",
    bullets: [
      "Earn BAT: View ads → get 70% of revenue monthly",
      "Buy BAT: Purchase on exchanges (Coinbase, Binance, etc.)",
      "Transfer BAT: Import from external Web3 wallets",
    ],
    viewRoute: "/wallet",
    ctas: [
      {
        label: "Where to buy BAT",
        href: "https://coincodex.com/how-to-buy-basic-attention-token/",
        variant: "primary",
      },
    ],
    connectedTo: ["n2"],
  },

  // Users nodes
  u1: {
    id: "u1",
    label: "Find verified creators",
    level: "users",
    icon: "bi-patch-check-fill",
    summary: "Discover creators with blue verification checkmarks",
    whyMatters:
      "Support authentic creators across YouTube, Twitch, Twitter, Reddit, and 1M+ sites—no personal data leaked.",
    bullets: [
      "Look for blue checkmark in address bar or Rewards icon",
      "Browse verified creators at brave.com/creators/",
      "Supports major platforms: YouTube, Twitch, Twitter, GitHub",
    ],
    viewRoute: "/privacy-demo",
    ctas: [
      { label: "Try Tipping Demo", route: "/privacy-demo", variant: "primary" },
      {
        label: "Search verified creators",
        href: "https://brave.com/creators/",
        variant: "secondary",
      },
    ],
    connectedTo: ["u2", "u3", "u4"],
  },
  u2: {
    id: "u2",
    label: "Tip on‑demand",
    level: "users",
    icon: "bi-cash-coin",
    summary: "Send one-time tips to creators you love",
    whyMatters:
      "Instantly reward great content—100% goes to creator, zero tracking, your identity stays private.",
    bullets: [
      "Click the BAT triangle icon in address bar",
      "Choose tip amount (e.g., 1 BAT = ~$0.20 USD)",
      "Creator receives 100%—no platform cut",
    ],
    viewRoute: "/privacy-demo",
    ctas: [
      { label: "Try Tipping Demo", route: "/privacy-demo", variant: "primary" },
    ],
    connectedTo: ["u1", "u5"],
  },
  u3: {
    id: "u3",
    label: "Set recurring tip",
    level: "users",
    icon: "bi-arrow-repeat",
    summary: "Schedule automatic monthly tips to your favorites",
    whyMatters:
      "Become a consistent patron—set‑and‑forget support for creators you visit regularly.",
    bullets: [
      "Set monthly tip amount (e.g., 5 BAT/month to one creator)",
      "Auto-renews from your Rewards balance",
      "Cancel or adjust anytime—no vendor lock-in",
    ],
    viewRoute: "/privacy-demo",
    ctas: [
      {
        label: "Setup Recurring Tip",
        route: "/privacy-demo",
        variant: "primary",
      },
    ],
    connectedTo: ["u1", "u5"],
  },
  u4: {
    id: "u4",
    label: "Auto‑contribute",
    level: "users",
    icon: "bi-bullseye",
    summary: "Automatically distribute tips based on attention",
    whyMatters:
      "Fairly reward all creators proportionally to time spent—passive support that reflects your actual interests.",
    bullets: [
      "Set monthly budget (e.g., 10 BAT/month)",
      "Brave splits based on attention time across all verified sites",
      "Transparent local algorithm—no server tracking",
    ],
    viewRoute: "/privacy-demo",
    ctas: [
      {
        label: "Enable Auto-contribute",
        route: "/privacy-demo",
        variant: "primary",
      },
      {
        label: "How attention is measured",
        href: "https://support.brave.com/hc/en-us/articles/360021123971",
        variant: "ghost",
      },
    ],
    connectedTo: ["u1", "u5"],
  },
  u5: {
    id: "u5",
    label: "Privacy‑preserving ads",
    level: "users",
    icon: "bi-shield-fill-check",
    summary: "Earn BAT without compromising your privacy",
    whyMatters:
      "View ads matched locally in your browser—no trackers, no data sent to servers, earn 70% of revenue.",
    bullets: [
      "Ads matched client-side using ML models (no cloud)",
      "No personal data leaves your device—anonymous confirmations only",
      "Earn ~5 BAT/month (varies by region and frequency)",
    ],
    viewRoute: "/privacy-demo",
    ctas: [
      { label: "See Privacy Demo", route: "/privacy-demo", variant: "primary" },
      {
        label: "How private ads work",
        href: "https://brave.com/brave-ads/",
        variant: "ghost",
      },
    ],
    connectedTo: ["u2", "u3", "u4"],
  },

  // Creators nodes
  c1: {
    id: "c1",
    label: "Verify channel",
    level: "creators",
    icon: "bi-check-circle-fill",
    summary: "Get verified to receive tips from users",
    whyMatters:
      "Prove authenticity to fans and unlock BAT tips—keep 100% ownership, reduce platform dependency.",
    bullets: [
      "Sign up at creators.brave.com (free, 5 min)",
      "Verify your YouTube, Twitch, Twitter, GitHub, or website",
      "Get blue checkmark badge visible to all Brave users",
    ],
    viewRoute: "/creator-hub",
    ctas: [
      {
        label: "Creator Dashboard Demo",
        route: "/creator-hub",
        variant: "primary",
      },
      {
        label: "Start creator onboarding",
        href: "https://creators.brave.com/",
        variant: "secondary",
      },
    ],
    connectedTo: ["c2"],
  },
  c2: {
    id: "c2",
    label: "Connect payout",
    level: "creators",
    icon: "bi-link-45deg",
    summary: "Link your wallet to receive BAT payments",
    whyMatters:
      "Choose custodial (Uphold/Gemini) for fiat withdrawal or self-custody (Brave Wallet) for full control.",
    bullets: [
      "Connect Uphold, Gemini, or bitFlyer for KYC payouts",
      "Or link Brave Wallet (self-custody, crypto-only)",
      "Secure OAuth—never share seed phrases",
    ],
    viewRoute: "/wallet",
    ctas: [
      { label: "Connect Wallet", route: "/wallet", variant: "primary" },
      {
        label: "Creator payout FAQ",
        href: "https://support.brave.com/hc/en-us/categories/360001053012-Brave-Rewards-for-Creators",
        variant: "ghost",
      },
    ],
    connectedTo: ["c1", "c3"],
  },
  c3: {
    id: "c3",
    label: "Receive tips",
    level: "creators",
    icon: "bi-gift-fill",
    summary: "Start receiving BAT from your supporters",
    whyMatters:
      "Direct fan support—no 30% platform cuts, no ads required, full transparency on every contribution.",
    bullets: [
      "Receive one-time tips (any amount)",
      "Monthly recurring support from patrons",
      "Auto-contribute from passive users (based on attention)",
    ],
    viewRoute: "/creator-hub",
    ctas: [
      {
        label: "View Creator Dashboard",
        route: "/creator-hub",
        variant: "primary",
      },
    ],
    connectedTo: ["c2", "c4"],
  },
  c4: {
    id: "c4",
    label: "Withdraw earnings",
    level: "creators",
    icon: "bi-cash-stack",
    summary: "Cash out or hold your BAT",
    whyMatters:
      "Full control—withdraw to bank (custodial) or swap to ETH/SOL (self-custody). Low fees, no middleman.",
    bullets: [
      "Monthly payout: 8th of each month (min ~5 BAT)",
      "Custodial: Withdraw to bank via Uphold/Gemini",
      "Self-custody: Swap BAT using DEX in Brave Wallet",
    ],
    viewRoute: "/wallet",
    ctas: [
      { label: "Manage Earnings", route: "/wallet", variant: "primary" },
      {
        label: "Payout schedule details",
        href: "https://support.brave.com/hc/en-us/articles/360026952311",
        variant: "ghost",
      },
    ],
    connectedTo: ["c3"],
  },
});

export function useFlowNodes() {
  function getNode(id: string): FlowNode | undefined {
    return nodeRegistry[id];
  }

  function getNodesByLevel(level: "setup" | "users" | "creators"): FlowNode[] {
    return Object.values(nodeRegistry).filter((node) => node.level === level);
  }

  function getConnectedNodes(nodeId: string): FlowNode[] {
    const node = getNode(nodeId);
    if (!node || !node.connectedTo) return [];
    return node.connectedTo
      .map((id) => getNode(id))
      .filter(Boolean) as FlowNode[];
  }

  return {
    nodes: readonly(nodeRegistry),
    getNode,
    getNodesByLevel,
    getConnectedNodes,
  };
}
