// ─────────────────────────────────────────────────────────────
// Legal / disclaimer text. Single source of truth — OTA-updatable.
// Used by the first-run modal, footers, and the Privacy & Terms screen.
// Not legal advice; wording should be reviewed by a qualified solicitor
// in the target market before launch.
// ─────────────────────────────────────────────────────────────

/** The date the FBR rules, fees, and timelines were last checked. */
export const lastVerified = 'May 2026';

/** Short one-liners for footers. */
export const footer = {
  notAdvice: 'Not legal advice · Independent, not affiliated with the Irish Government · Verify at ireland.ie',
  verified: `Information last verified ${lastVerified}`,
};

/** Short notice shown in the first-run modal (kept concise). */
export const onboardingDisclaimer = [
  'FBR Guide is an independent, unofficial guide. It is not affiliated with, endorsed by, or connected to the Irish Government, the Department of Foreign Affairs (DFA), or any official body.',
  'It is provided for general information only and is not legal or immigration advice. Eligibility results are guidance, not decisions — only the DFA can confirm whether you qualify.',
  'FBR rules, fees, and processing times change. Always verify current requirements at ireland.ie. Your answers are stored only on this device — nothing is collected or sent anywhere.',
];

/** Full sections for the Privacy & Terms screen. */
export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export const legalSections: LegalSection[] = [
  {
    heading: 'Not affiliated with any government',
    paragraphs: [
      'FBR Guide is an independent, unofficial application. It is not affiliated with, endorsed by, sponsored by, or connected to the Irish Government, the Department of Foreign Affairs (DFA), Citizens Information, or any official or governmental body.',
      'All official trademarks, names, and links referenced belong to their respective owners and are provided only to help you reach the correct official sources.',
    ],
  },
  {
    heading: 'Not legal advice',
    paragraphs: [
      'The content of this app is provided for general informational purposes only and does not constitute legal advice, immigration advice, or professional advice of any kind, and should not be relied upon as such.',
      'Eligibility results and document checklists are automated guidance based on the answers you provide. They are not a determination of your citizenship status or your eligibility. Only the DFA can decide whether you qualify and what documents your specific application requires.',
      'For advice on your individual circumstances, consult a qualified solicitor or a regulated immigration adviser in your jurisdiction.',
    ],
  },
  {
    heading: 'Accuracy and changes',
    paragraphs: [
      `This app is compiled from official DFA guidance, Citizens Information, and community experience, last verified ${lastVerified}. FBR rules, fees, processing times, and document requirements change over time and may be out of date.`,
      'Always verify current requirements at ireland.ie before acting. We make no warranty that the information is accurate, complete, or current.',
    ],
  },
  {
    heading: 'No liability',
    paragraphs: [
      'To the fullest extent permitted by law, the makers of this app accept no liability for any loss, cost, delay, rejected application, fee, or damage of any kind arising from your use of, or reliance on, this app or its content. You use it entirely at your own risk.',
      'Application fees paid to the DFA are non-refundable if an application is rejected or withdrawn. This app cannot recover such fees or any other costs.',
    ],
  },
  {
    heading: 'Privacy',
    paragraphs: [
      'FBR Guide does not collect, transmit, or store any personal data off your device. All answers and checklist progress are saved locally on your device and never leave it.',
      'There is no account, no analytics, no advertising, and no backend server. Deleting the app deletes all stored data. External links open in your own browser; the app itself requires no network connection to function.',
    ],
  },
];
