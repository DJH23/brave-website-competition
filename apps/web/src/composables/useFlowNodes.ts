import { reactive, readonly } from "vue";

export interface NodeCTA {
  label: string;
  route: string;
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
      "Earn and use BAT with privacy intact; start here to activate Rewards and choose custody.",
    bullets: [
      "Download and install Brave Browser",
      "Enable privacy shields and ad blocking",
      "Set up your BAT wallet for rewards",
    ],
    viewRoute: "/wallet",
    ctas: [
      { label: "Open Wallet View", route: "/wallet" },
      { label: "Learn More", route: "/" },
    ],
    connectedTo: ["n1"],
  },
  n1: {
    id: "n1",
    label: "Enable Brave Rewards",
    level: "setup",
    icon: "bi-lightning-charge-fill",
    summary: "Activate the Brave Rewards system to earn BAT",
    whyMatters:
      "Start earning BAT by viewing privacy-respecting ads and supporting your favorite creators.",
    bullets: [
      "Turn on Brave Rewards in settings",
      "Choose your monthly ad frequency",
      "Start earning BAT automatically",
    ],
    viewRoute: "/wallet",
    ctas: [{ label: "Enable Rewards", route: "/wallet" }],
    connectedTo: ["n0", "n2"],
  },
  n2: {
    id: "n2",
    label: "Choose payout: Custodial or Self‑custody",
    level: "setup",
    icon: "bi-shield-lock-fill",
    summary: "Select how you want to manage your BAT",
    whyMatters:
      "Control your funds: custodial for ease, self-custody for full ownership.",
    bullets: [
      "Custodial: Easy setup with trusted partners",
      "Self-custody: Full control with your own wallet",
      "Change your choice anytime",
    ],
    viewRoute: "/wallet",
    ctas: [{ label: "Setup Wallet", route: "/wallet" }],
    connectedTo: ["n1", "n3"],
  },
  n3: {
    id: "n3",
    label: "Get BAT: Earn via ads or add funds",
    level: "setup",
    icon: "bi-coin",
    summary: "Acquire BAT tokens to use in the ecosystem",
    whyMatters:
      "Fund your creator tips through passive ad earnings or direct purchase.",
    bullets: [
      "Earn BAT by viewing privacy-respecting ads",
      "Purchase BAT on supported exchanges",
      "Transfer BAT from external wallets",
    ],
    viewRoute: "/wallet",
    ctas: [{ label: "View Wallet", route: "/wallet" }],
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
      "Support creators directly with on‑demand tips, recurring support, or auto‑contribute without leaking personal data.",
    bullets: [
      "Look for blue checkmark in URL bar",
      "Verified creators are authentic",
      "Browse supported platforms",
    ],
    viewRoute: "/privacy-demo",
    ctas: [{ label: "Try Tipping Demo", route: "/privacy-demo" }],
    connectedTo: ["u2", "u3", "u4"],
  },
  u2: {
    id: "u2",
    label: "Tip on‑demand",
    level: "users",
    icon: "bi-cash-coin",
    summary: "Send one-time tips to creators you love",
    whyMatters:
      "Instantly reward great content while maintaining complete privacy.",
    bullets: [
      "Click the Brave Rewards icon",
      "Choose your tip amount",
      "Send instantly with no middleman",
    ],
    viewRoute: "/privacy-demo",
    ctas: [{ label: "Try Tipping", route: "/privacy-demo" }],
    connectedTo: ["u1", "u5"],
  },
  u3: {
    id: "u3",
    label: "Set recurring tip",
    level: "users",
    icon: "bi-arrow-repeat",
    summary: "Schedule automatic monthly tips to your favorites",
    whyMatters:
      "Become a consistent supporter without remembering to tip manually.",
    bullets: [
      "Set monthly tip amount",
      "Automatic distribution",
      "Adjust or cancel anytime",
    ],
    viewRoute: "/privacy-demo",
    ctas: [{ label: "Setup Recurring", route: "/privacy-demo" }],
    connectedTo: ["u1", "u5"],
  },
  u4: {
    id: "u4",
    label: "Auto‑contribute",
    level: "users",
    icon: "bi-bullseye",
    summary: "Automatically distribute tips based on attention",
    whyMatters:
      "Fairly reward all creators based on your actual engagement time.",
    bullets: [
      "Set monthly budget",
      "Automatically splits based on time spent",
      "Transparent and private distribution",
    ],
    viewRoute: "/privacy-demo",
    ctas: [{ label: "Enable Auto-contribute", route: "/privacy-demo" }],
    connectedTo: ["u1", "u5"],
  },
  u5: {
    id: "u5",
    label: "Privacy‑preserving ads",
    level: "users",
    icon: "bi-shield-fill-check",
    summary: "Earn BAT without compromising your privacy",
    whyMatters:
      "View ads that respect your privacy—no tracking, no data leaks.",
    bullets: [
      "Ads matched locally in your browser",
      "No personal data leaves your device",
      "Earn 70% of ad revenue in BAT",
    ],
    viewRoute: "/privacy-demo",
    ctas: [{ label: "Learn About Privacy", route: "/privacy-demo" }],
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
      "Verify your channel, connect payout, and receive BAT; keep ownership and reduce platform fees.",
    bullets: [
      "Sign up at creators.brave.com",
      "Verify your website, YouTube, Twitch, or social media",
      "Get the blue checkmark badge",
    ],
    viewRoute: "/music-hub",
    ctas: [{ label: "Go to Creator Onboarding", route: "/music-hub" }],
    connectedTo: ["c2"],
  },
  c2: {
    id: "c2",
    label: "Connect payout",
    level: "creators",
    icon: "bi-link-45deg",
    summary: "Link your wallet to receive BAT payments",
    whyMatters:
      "Choose how you want to receive your earnings—custodial or self-custody.",
    bullets: [
      "Connect to Uphold, Gemini, or self-custody wallet",
      "Secure and encrypted connection",
      "Change payout method anytime",
    ],
    viewRoute: "/wallet",
    ctas: [{ label: "Connect Wallet", route: "/wallet" }],
    connectedTo: ["c1", "c3"],
  },
  c3: {
    id: "c3",
    label: "Receive tips",
    level: "creators",
    icon: "bi-gift-fill",
    summary: "Start receiving BAT from your supporters",
    whyMatters:
      "Direct support from fans without intermediaries taking a large cut.",
    bullets: [
      "Receive one-time tips",
      "Monthly recurring support",
      "Auto-contribute from engaged users",
    ],
    viewRoute: "/music-hub",
    ctas: [{ label: "View Creator Dashboard", route: "/music-hub" }],
    connectedTo: ["c2", "c4"],
  },
  c4: {
    id: "c4",
    label: "Withdraw earnings",
    level: "creators",
    icon: "bi-cash-stack",
    summary: "Cash out or hold your BAT",
    whyMatters:
      "Full control of your earnings—withdraw to fiat or hold as crypto.",
    bullets: [
      "Monthly payout processing",
      "Convert to fiat or hold as BAT",
      "Low fees, no platform cuts",
    ],
    viewRoute: "/wallet",
    ctas: [{ label: "Manage Earnings", route: "/wallet" }],
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
