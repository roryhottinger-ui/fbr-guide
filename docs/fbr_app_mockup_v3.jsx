import { useState } from "react";

const G = {
  bg: "#F5F2EB",
  card: "#FFFFFF",
  green: "#1B5E38",
  greenDark: "#133F26",
  greenLight: "#EAF3EE",
  greenMid: "#27834F",
  gold: "#B8922A",
  goldLight: "#FBF6E8",
  text: "#181818",
  textMid: "#4A4A4A",
  textLight: "#8A8A8A",
  border: "#E2DDD4",
  warn: "#B84A0C",
  warnLight: "#FEF0E8",
  warnBorder: "#F0C4A0",
  block: "#A01C0E",
  blockLight: "#FDE8E6",
  blockBorder: "#EBA89E",
  done: "#1B5E38",
};

const PhoneFrame = ({ children }) => (
  <div style={{
    width: 393,
    minHeight: 852,
    background: G.bg,
    borderRadius: 48,
    overflow: "hidden",
    boxShadow: "0 40px 100px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.1), inset 0 0 0 2px rgba(255,255,255,0.5)",
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    position: "relative",
  }}>
    <div style={{ padding: "16px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, color: G.text }}>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {["▲","▲","▲"].map((s,i) => <span key={i} style={{ fontSize: 9, color: G.text, opacity: 0.6 }}>{s}</span>)}
      </div>
    </div>
    <div style={{ padding: "8px 22px 40px" }}>
      {children}
    </div>
  </div>
);

const Pill = ({ label, color = G.green }) => (
  <span style={{
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontFamily: "sans-serif",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    background: color === G.green ? G.greenLight : G.warnLight,
    color: color,
    border: `1px solid ${color === G.green ? "#C2DCCB" : G.warnBorder}`,
  }}>{label}</pill>
);

const ProgressBar = ({ step, total }) => (
  <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        flex: 1, height: 2, borderRadius: 2,
        background: i < step ? G.green : G.border,
        transition: "background 0.3s",
      }} />
    ))}
  </div>
);

// ── CHAIN VISUALISER ──────────────────────────────────────

function ChainNode({ name, type, status }) {
  const colors = {
    ok: { bg: G.greenLight, border: "#B8D9C4", dot: G.green, text: G.greenDark },
    warn: { bg: G.warnLight, border: G.warnBorder, dot: G.warn, text: G.warn },
    block: { bg: G.blockLight, border: G.blockBorder, dot: G.block, text: G.block },
    neutral: { bg: "#F0EDE7", border: G.border, dot: G.textLight, text: G.textMid },
  };
  const c = colors[status] || colors.neutral;

  return (
    <div style={{
      background: c.bg,
      border: `1.5px solid ${c.border}`,
      borderRadius: 10,
      padding: "8px 12px",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: c.dot, flexShrink: 0,
      }} />
      <div>
        <div style={{
          fontSize: 12, fontFamily: "sans-serif", fontWeight: 700,
          color: c.text, letterSpacing: "-0.01em",
        }}>{name}</div>
        <div style={{
          fontSize: 10, fontFamily: "sans-serif",
          color: c.text, opacity: 0.75, marginTop: 1,
        }}>{type}</div>
      </div>
    </div>
  );
}

function ChainArrow({ label, status }) {
  const color = status === "ok" ? G.green : status === "warn" ? G.warn : status === "block" ? G.block : G.textLight;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2px 0" }}>
      <div style={{ width: 1.5, height: 6, background: color }} />
      <div style={{
        fontSize: 9, fontFamily: "sans-serif", fontWeight: 700,
        color, letterSpacing: "0.02em", textTransform: "uppercase",
        background: color === G.green ? G.greenLight : color === G.warn ? G.warnLight : "#F8E8E6",
        border: `1px solid ${color}`,
        borderRadius: 8, padding: "2px 6px", margin: "2px 0",
        whiteSpace: "nowrap",
      }}>{label}</div>
      <div style={{ width: 1.5, height: 6, background: color }} />
      <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: `6px solid ${color}` }} />
    </div>
  );
}

function ChainVisualiser({ answers: a }) {
  const gpM = parseInt(a.gp_marriages) || 0;
  const pM = parseInt(a.parent_marriages) || 0;
  const aM = parseInt(a.applicant_marriages) || 0;

  const gpIdStatus = a.gp_alive === "NO" ? "ok" : a.gp_id_valid === "NO" ? "block" : a.gp_id_valid === "YES" ? "ok" : "neutral";
  const gpIdLabel = a.gp_alive === "NO" ? "Death certificate" : a.gp_id_valid === "NO" ? "⚠ Expired ID — renew first" : "Current photo ID ✓";
  const gpIdType = a.gp_alive === "NO" ? "Confirms death" : a.gp_id_valid === "NO" ? "Needs renewal before submitting" : "Valid & unexpired";

  const pIdStatus = a.parent_alive === "NO" ? "ok" : "ok";
  const pIdLabel = a.parent_alive === "NO" ? "Death certificate" : "Current photo ID ✓";

  const PersonChain = ({ label, marriages, nameChange, idLabel, idType, idStatus }) => (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 10, fontFamily: "sans-serif", fontWeight: 700, color: G.textLight, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <ChainNode name="Birth certificate" type="Starting name" status="neutral" />
      {nameChange === "YES_DEED" && <><ChainArrow label="Deed poll" status="ok" /><ChainNode name="New legal name" type="After deed poll" status="ok" /></>}
      {nameChange === "YES_ANGL" && <><ChainArrow label="Stat. declaration" status="warn" /><ChainNode name="Anglicised name" type="Name differs — declaration needed" status="warn" /></>}
      {marriages >= 1 && <><ChainArrow label="Marriage cert ①" status="ok" /><ChainNode name="Name after 1st marriage" type="Marriage certificate ①" status="ok" /></>}
      {marriages >= 2 && <><ChainArrow label="Marriage cert ②" status="ok" /><ChainNode name="Name after 2nd marriage" type="Marriage certificate ②" status="ok" /></>}
      {marriages >= 3 && <><ChainArrow label="Further certs" status="warn" /><ChainNode name="Final married name" type="All marriage certs required" status="warn" /></>}
      <ChainArrow label={idLabel.includes("⚠") ? "⚠ Needs renewal" : marriages === 0 && !nameChange || nameChange === "NO" ? "No name change" : "Current ID"} status={idStatus} />
      <ChainNode name={idLabel} type={idType} status={idStatus} />
    </div>
  );

  return (
    <div style={{ background: G.card, borderRadius: 16, padding: "16px", border: `1px solid ${G.border}`, marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, color: G.textLight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Document chain</div>
      <PersonChain label="Your grandparent" marriages={gpM} nameChange={a.gp_name_change} idLabel={gpIdLabel} idType={gpIdType} idStatus={gpIdStatus} />
      <div style={{ height: 1, background: G.border, margin: "12px 0" }} />
      <PersonChain label="Your parent" marriages={pM} nameChange={a.parent_name_change} idLabel={pIdLabel} idType={a.parent_alive === "NO" ? "Confirms death" : "Valid & unexpired"} idStatus={pIdStatus} />
      <div style={{ height: 1, background: G.border, margin: "12px 0" }} />
      <PersonChain label="You" marriages={aM} nameChange={a.applicant_name_change} idLabel="Current photo ID ✓" idType="Valid & unexpired" idStatus="ok" />
    </div>
  );
}

// ── BLOCKER BANNER ─────────────────────────────────────────

function BlockerBanner({ onDismiss }) {
  return (
    <div style={{
      background: G.blockLight,
      border: `1.5px solid ${G.blockBorder}`,
      borderRadius: 14,
      padding: "14px 16px",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>🚫</span>
        <div>
          <div style={{
            fontSize: 13, fontFamily: "sans-serif", fontWeight: 700,
            color: G.block, marginBottom: 5, letterSpacing: "-0.01em",
          }}>Action needed before you post</div>
          <div style={{
            fontSize: 12, fontFamily: "sans-serif", color: G.block,
            lineHeight: 1.55, opacity: 0.9,
          }}>
            Your grandparent's passport is expired. The DFA will not accept it. <strong>Arrange renewal before submitting</strong> — this is the one thing that will get your whole application returned.
          </div>
          <div style={{
            marginTop: 10,
            fontSize: 11, fontFamily: "sans-serif", color: G.block,
            opacity: 0.75,
          }}>
            💡 Alternatives: valid driving licence · national ID card (EU) · renewed passport
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CHECKLIST ITEM ─────────────────────────────────────────

function CheckItem({ id, doc, person, note, warning, type = "normal", checked, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const isBlock = type === "block";
  const isDone = checked && !isBlock;

  return (
    <div style={{
      borderRadius: 12,
      border: `1.5px solid ${isBlock ? G.blockBorder : isDone ? "#B8D9C4" : G.border}`,
      background: isBlock ? G.blockLight : isDone ? G.greenLight : G.card,
      marginBottom: 8,
      overflow: "hidden",
      transition: "all 0.2s",
    }}>
      <div
        onClick={() => !isBlock && onToggle(id)}
        style={{ padding: "12px 14px", cursor: isBlock ? "default" : "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}
      >
        {/* Checkbox */}
        <div style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
          border: `2px solid ${isBlock ? G.block : isDone ? G.green : G.border}`,
          background: isDone ? G.green : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}>
          {isDone && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
          {isBlock && <span style={{ color: G.block, fontSize: 10 }}>!</span>}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontFamily: "sans-serif", fontWeight: 600,
            color: isBlock ? G.block : isDone ? G.greenDark : G.text,
            textDecoration: isDone ? "line-through" : "none",
            opacity: isDone ? 0.6 : 1,
            letterSpacing: "-0.01em",
          }}>{doc}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            <span style={{
              fontSize: 10, fontFamily: "sans-serif",
              color: isBlock ? G.block : G.textLight,
            }}>For: {person}</span>
            {warning && (
              <span style={{
                fontSize: 10, fontFamily: "sans-serif", fontWeight: 700,
                color: G.warn, background: G.warnLight,
                padding: "1px 6px", borderRadius: 6,
              }}>⚠ {warning}</span>
            )}
          </div>

          {note && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              style={{
                marginTop: 4, background: "none", border: "none",
                cursor: "pointer", padding: 0,
                fontSize: 11, fontFamily: "sans-serif", color: G.green,
                fontWeight: 500,
              }}
            >
              {expanded ? "▲ Less" : "▼ How to get this"}
            </button>
          )}
        </div>
      </div>

      {expanded && note && (
        <div style={{
          padding: "0 14px 12px 46px",
          fontSize: 12, fontFamily: "sans-serif", color: G.textMid,
          lineHeight: 1.6, borderTop: `1px solid ${G.border}`,
          paddingTop: 10,
        }}>{note}</div>
      )}
    </div>
  );
}

// ── QUESTION SCREEN ────────────────────────────────────────

function QuestionScreen({ step, total, title, subtitle, options, selected, onSelect, onNext, onBack }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 20px" }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: G.card, border: `1px solid ${G.border}`,
            borderRadius: 10, width: 34, height: 34,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16, color: G.textMid, flexShrink: 0,
          }}>←</button>
        )}
        <div style={{ flex: 1 }}>
          <ProgressBar step={step} total={total} />
          <div style={{
            fontSize: 10, fontFamily: "sans-serif", fontWeight: 700,
            color: G.textLight, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>Step {step} of {total}</div>
        </div>
      </div>

      <div style={{
        fontSize: 21, fontFamily: "'Palatino Linotype', Palatino, serif",
        fontWeight: 700, color: G.text, lineHeight: 1.25,
        letterSpacing: "-0.02em", marginBottom: subtitle ? 8 : 20,
      }}>{title}</div>

      {subtitle && (
        <div style={{
          fontSize: 13, fontFamily: "sans-serif", color: G.textMid,
          lineHeight: 1.55, marginBottom: 20,
          background: G.goldLight, borderRadius: 10, padding: "10px 12px",
          border: `1px solid #EDD89A`,
        }}>{subtitle}</div>
      )}

      <div>
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: `1.5px solid ${selected === opt.value ? G.green : G.border}`,
              background: selected === opt.value ? G.greenLight : G.card,
              cursor: "pointer",
              marginBottom: 8,
              display: "flex", alignItems: "center", gap: 12,
              transition: "all 0.15s",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${selected === opt.value ? G.green : G.border}`,
              background: selected === opt.value ? G.green : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}>
              {selected === opt.value && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
            </div>
            <div>
              <div style={{
                fontSize: 14, fontFamily: "sans-serif", fontWeight: 600,
                color: G.text, letterSpacing: "-0.01em",
              }}>{opt.label}</div>
              {opt.sub && (
                <div style={{ fontSize: 12, fontFamily: "sans-serif", color: G.textLight, marginTop: 2 }}>{opt.sub}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={onNext}
          disabled={!selected}
          style={{
            width: "100%", padding: "15px",
            background: selected ? G.green : G.border,
            color: selected ? "#fff" : G.textLight,
            border: "none", borderRadius: 14,
            fontSize: 15, fontFamily: "sans-serif", fontWeight: 600,
            cursor: selected ? "pointer" : "not-allowed",
            letterSpacing: "-0.01em", transition: "all 0.15s",
          }}
        >Continue →</button>
      </div>
    </>
  );
}

// ── SECTION HEADER ─────────────────────────────────────────

function SectionHeader({ emoji, title, count, done }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 10, marginTop: 4,
    }}>
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 12, fontFamily: "sans-serif", fontWeight: 700,
          color: G.textMid, letterSpacing: "0.02em",
        }}>{title}</div>
      </div>
      <div style={{
        fontSize: 11, fontFamily: "sans-serif", fontWeight: 700,
        color: done === count ? G.green : G.textLight,
        background: done === count ? G.greenLight : "#F0EDE7",
        padding: "2px 8px", borderRadius: 10,
        border: `1px solid ${done === count ? "#B8D9C4" : G.border}`,
      }}>{done}/{count}</div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────

export default function App() {
  const SCREENS = { QUESTIONS: "Q", CHECKLIST: "C" };
  const [screen, setScreen] = useState(SCREENS.QUESTIONS);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showChain, setShowChain] = useState(true);

  const questions = [
    {
      key: "gp_alive",
      title: "Is your Irish-born grandparent still alive?",
      options: [
        { value: "YES", label: "Yes, they're alive" },
        { value: "NO", label: "No, they've passed away" },
      ],
    },
    {
      key: "gp_id_valid",
      title: "Is your grandparent's photo ID currently valid?",
      subtitle: "⚠️ An expired passport, driving licence, or ID card is NOT accepted by the DFA. This is one of the most common reasons applications are returned.",
      show: (a) => a.gp_alive === "YES",
      options: [
        { value: "YES", label: "Yes — valid and unexpired" },
        { value: "NO", label: "No — expired or unavailable", sub: "We'll flag this as a blocker" },
      ],
    },
    {
      key: "gp_marriages",
      title: "How many times was your grandparent married?",
      subtitle: "You need a marriage certificate for every marriage — not just the most recent. This is required even if their name didn't change.",
      options: [
        { value: "0", label: "Never married" },
        { value: "1", label: "Once" },
        { value: "2", label: "Twice", sub: "2 marriage certificates required" },
        { value: "3+", label: "Three or more times", sub: "All marriage certificates required" },
      ],
    },
    {
      key: "gp_name_change",
      title: "Did your grandparent change their name other than by marriage?",
      options: [
        { value: "NO", label: "No" },
        { value: "YES_DEED", label: "Yes — deed poll or statutory declaration" },
        { value: "YES_ANGL", label: "Yes — name was anglicised or informally changed", sub: "e.g. Máire → Mary, Ó Brien → O'Brien" },
      ],
    },
    {
      key: "parent_alive",
      title: "Is your Irish citizen parent still alive?",
      options: [
        { value: "YES", label: "Yes, they're alive" },
        { value: "NO", label: "No, they've passed away" },
      ],
    },
    {
      key: "parent_marriages",
      title: "How many times was your parent married?",
      subtitle: "Marriage certificates are required for every marriage — even if no name change occurred.",
      options: [
        { value: "0", label: "Never married" },
        { value: "1", label: "Once" },
        { value: "2", label: "Twice" },
        { value: "3+", label: "Three or more times" },
      ],
    },
    {
      key: "parent_name_change",
      title: "Did your parent change their name other than by marriage?",
      subtitle: "This includes deed polls, court orders, or any informal change where their name appears differently across documents.",
      options: [
        { value: "NO", label: "No" },
        { value: "YES_DEED", label: "Yes — deed poll or statutory declaration" },
        { value: "YES_ANGL", label: "Yes — name was anglicised or informally changed", sub: "e.g. Séamus → James, Ó Brien → O'Brien" },
      ],
    },
    {
      key: "applicant_marriages",
      title: "How many times have you been married?",
      options: [
        { value: "0", label: "Never" },
        { value: "1", label: "Once" },
        { value: "2", label: "Twice" },
        { value: "3+", label: "Three or more times" },
      ],
    },
    {
      key: "applicant_name_change",
      title: "Have you changed your name other than by marriage?",
      subtitle: "Even if the change feels minor — different spelling, anglicisation, deed poll — it will cause a discrepancy in your document chain that needs explaining.",
      options: [
        { value: "NO", label: "No" },
        { value: "YES_DEED", label: "Yes — deed poll or statutory declaration" },
        { value: "YES_ANGL", label: "Yes — name was anglicised or informally changed" },
      ],
    },
  ];

  // Filter to visible questions
  const visibleQs = questions.filter(q => !q.show || q.show(answers));
  const currentQ = visibleQs[step];
  const isLastStep = step === visibleQs.length - 1;

  const handleNext = () => {
    if (isLastStep) setScreen(SCREENS.CHECKLIST);
    else setStep(s => s + 1);
  };

  const buildChecklist = () => {
    const a = answers;
    const items = [];

    // Always: grandparent birth cert
    items.push({ id: "gp_bc", section: "gp", doc: "Long-form birth certificate", person: "Your grandparent", note: "Order from GRO Ireland (groireland.ie) or GRONI (nidirect.gov.uk) depending on where they were born." });

    // Grandparent marriages
    const gpM = parseInt(a.gp_marriages) || 0;
    if (gpM >= 1) items.push({ id: "gp_mc1", section: "gp", doc: "Marriage certificate — 1st marriage", person: "Your grandparent", warning: "Required even with no name change", note: "Order from the registry of the country/region where they married." });
    if (gpM >= 2) items.push({ id: "gp_mc2", section: "gp", doc: "Marriage certificate — 2nd marriage", person: "Your grandparent", warning: "Required even with no name change", note: "Order from the registry of the country/region where they married." });
    if (gpM >= 3) items.push({ id: "gp_mc3", section: "gp", doc: "Marriage certificate — 3rd marriage (and any further)", person: "Your grandparent", warning: "All marriages required", note: "Order from the relevant registry for each marriage." });

    // Grandparent name change
    if (a.gp_name_change === "YES_DEED") items.push({ id: "gp_nc", section: "gp", doc: "Deed poll / statutory declaration of name change", person: "Your grandparent", note: "Original document required. If lost, contact the court that issued it." });
    if (a.gp_name_change === "YES_ANGL") items.push({ id: "gp_angl", section: "gp", doc: "Statutory declaration explaining name difference", person: "Your grandparent", note: "You write and sign this yourself, sworn before a notary. Explain that the names on different documents refer to the same person and why they differ (anglicisation, fada removal, etc.)." });

    // Grandparent ID
    if (a.gp_alive === "YES" && a.gp_id_valid === "YES") {
      items.push({ id: "gp_id", section: "gp", doc: "Certified copy of current photo ID", person: "Your grandparent", note: "Must be valid and unexpired. Certified by a professional from the witness list." });
    } else if (a.gp_alive === "YES" && a.gp_id_valid === "NO") {
      items.push({ id: "gp_id_expired", section: "gp", doc: "⚠ Valid photo ID — needs to be renewed first", person: "Your grandparent", type: "block", note: "Their current ID is expired. Do NOT submit until this is resolved. Options: renew passport, use a valid driving licence, or use a national ID card (EU countries). Renew early — this can take several weeks for elderly relatives." });
    } else if (a.gp_alive === "NO") {
      items.push({ id: "gp_death", section: "gp", doc: "Death certificate", person: "Your grandparent", note: "Replaces the photo ID requirement. Order from the registry of the country/region where they died." });
    }

    // Parent docs
    items.push({ id: "p_bc", section: "parent", doc: "Long-form birth certificate", person: "Your parent", note: "Must show parental details." });

    const pM = parseInt(a.parent_marriages) || 0;
    if (pM >= 1) items.push({ id: "p_mc1", section: "parent", doc: "Marriage certificate — 1st marriage", person: "Your parent", warning: "Required even with no name change", note: "Order from the relevant registry." });
    if (pM >= 2) items.push({ id: "p_mc2", section: "parent", doc: "Marriage certificate — 2nd marriage", person: "Your parent", warning: "Required even with no name change", note: "Order from the relevant registry." });
    if (pM >= 3) items.push({ id: "p_mc3", section: "parent", doc: "All further marriage certificates", person: "Your parent", warning: "All marriages required" });

    // Parent name change
    if (a.parent_name_change === "YES_DEED") items.push({ id: "p_nc", section: "parent", doc: "Deed poll / statutory declaration of name change", person: "Your parent", note: "Original document required. If lost, contact the court or solicitor that issued it." });
    if (a.parent_name_change === "YES_ANGL") items.push({ id: "p_angl", section: "parent", doc: "Statutory declaration explaining name difference", person: "Your parent", note: "Signed by your parent before a notary, explaining that the two names refer to the same person and why they differ." });

    if (a.parent_alive === "YES") {
      items.push({ id: "p_id", section: "parent", doc: "Certified copy of current photo ID", person: "Your parent", note: "Certified by a professional from the witness list." });
    } else {
      items.push({ id: "p_death", section: "parent", doc: "Death certificate", person: "Your parent", note: "Order from the registry of the country/region where they died." });
    }

    // Your docs
    items.push({ id: "you_bc", section: "you", doc: "Long-form birth certificate", person: "You", note: "Must show parental details." });
    const aM = parseInt(a.applicant_marriages) || 0;
    if (aM >= 1) items.push({ id: "you_mc1", section: "you", doc: "Marriage certificate — 1st marriage", person: "You" });
    if (aM >= 2) items.push({ id: "you_mc2", section: "you", doc: "Marriage certificate — 2nd marriage", person: "You" });
    if (aM >= 3) items.push({ id: "you_mc3", section: "you", doc: "All further marriage certificates", person: "You" });
    // Your name change
    if (a.applicant_name_change === "YES_DEED") items.push({ id: "you_nc", section: "you", doc: "Deed poll / statutory declaration of name change", person: "You", note: "Original required. This bridges your birth certificate name to your current name in the chain." });
    if (a.applicant_name_change === "YES_ANGL") items.push({ id: "you_angl", section: "you", doc: "Statutory declaration explaining name difference", person: "You", note: "Sworn before a notary. Explain the discrepancy between your name as it appears across documents." });

    items.push({ id: "you_id", section: "you", doc: "Certified copy of current photo ID", person: "You", note: "Certified by your application form witness." });
    items.push({ id: "you_addr", section: "you", doc: "2 original proofs of address", person: "You", note: "Originals only — no photocopies. Different issuers recommended." });
    items.push({ id: "you_photos", section: "you", doc: "4 passport photos (2 witnessed)", person: "You", note: "Do not attach to the form. 2 must be signed and dated by your witness." });
    items.push({ id: "you_form", section: "you", doc: "Completed, signed & witnessed application form", person: "You", note: "Complete online at fbr.dfa.ie, print, sign in front of your witness." });

    return items;
  };

  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));

  const ChecklistView = () => {
    const items = buildChecklist();
    const sections = [
      { key: "gp", emoji: "🧓", label: "Your grandparent" },
      { key: "parent", emoji: "👤", label: "Your parent" },
      { key: "you", emoji: "🙋", label: "You" },
    ];

    const hasBlocker = items.some(i => i.type === "block");
    const totalNormal = items.filter(i => i.type !== "block").length;
    const doneCount = items.filter(i => i.type !== "block" && checked[i.id]).length;
    const pct = Math.round((doneCount / totalNormal) * 100);

    return (
      <>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 16px" }}>
          <button onClick={() => { setStep(0); setScreen(SCREENS.QUESTIONS); }} style={{
            background: G.card, border: `1px solid ${G.border}`, borderRadius: 10,
            width: 34, height: 34, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", fontSize: 16, color: G.textMid,
          }}>←</button>
          <div style={{
            fontSize: 17, fontFamily: "'Palatino Linotype', Palatino, serif",
            fontWeight: 700, color: G.text, letterSpacing: "-0.02em",
          }}>Your document checklist</div>
        </div>

        {/* Blocker banner */}
        {hasBlocker && <BlockerBanner />}

        {/* Progress */}
        <div style={{
          background: G.card, borderRadius: 14, padding: "14px 16px",
          border: `1px solid ${G.border}`, marginBottom: 14,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, color: G.textMid }}>
              {doneCount} of {totalNormal} gathered
            </span>
            <span style={{ fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, color: hasBlocker ? G.block : G.green }}>
              {hasBlocker ? "⚠ Blocker" : `${pct}%`}
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: G.border, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: hasBlocker ? G.block : G.green,
              width: `${pct}%`, transition: "width 0.3s",
            }} />
          </div>
        </div>

        {/* Chain toggle */}
        <button
          onClick={() => setShowChain(s => !s)}
          style={{
            width: "100%", background: showChain ? G.greenLight : G.card,
            border: `1.5px solid ${showChain ? "#B8D9C4" : G.border}`,
            borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <span style={{ fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, color: G.textMid }}>
              View document chain
            </span>
          </div>
          <span style={{ fontSize: 11, fontFamily: "sans-serif", color: G.textLight }}>
            {showChain ? "▲ Hide" : "▼ Show"}
          </span>
        </button>

        {showChain && <ChainVisualiser answers={answers} />}

        {/* Marriage cert warning */}
        <div style={{
          background: G.warnLight, border: `1.5px solid ${G.warnBorder}`,
          borderRadius: 12, padding: "10px 14px", marginBottom: 14,
          fontSize: 12, fontFamily: "sans-serif", color: G.warn, lineHeight: 1.55,
        }}>
          ⚠️ <strong>Marriage certificates required for every marriage</strong> — even if the person's name didn't change. Skipping any one of them is the most common cause of 3–6 month delays.
        </div>

        {/* Sections */}
        {sections.map(sec => {
          const secItems = items.filter(i => i.section === sec.key);
          const secDone = secItems.filter(i => i.type !== "block" && checked[i.id]).length;
          const secTotal = secItems.filter(i => i.type !== "block").length;
          return (
            <div key={sec.key} style={{ marginBottom: 8 }}>
              <SectionHeader emoji={sec.emoji} title={sec.label} count={secTotal} done={secDone} />
              {secItems.map(item => (
                <CheckItem
                  key={item.id}
                  {...item}
                  checked={!!checked[item.id]}
                  onToggle={toggle}
                />
              ))}
            </div>
          );
        })}

        {/* All done state */}
        {!hasBlocker && doneCount === totalNormal && totalNormal > 0 && (
          <div style={{
            marginTop: 8, background: G.green, borderRadius: 16,
            padding: "20px", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 16, fontFamily: "'Palatino Linotype', serif", fontWeight: 700, color: "#fff", marginBottom: 6 }}>
              Everything gathered!
            </div>
            <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
              Send via recorded post to the PO Box in Balbriggan, Co. Dublin. Include the Eircode K32 AE72 on the envelope.
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #2C4A35 0%, #1A2E20 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start",
      padding: "32px 16px 60px",
    }}>
      <div style={{
        fontSize: 11, fontFamily: "sans-serif", fontWeight: 700,
        color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
        textTransform: "uppercase", marginBottom: 16,
      }}>FBR Guide — Edge case mockup</div>

      <PhoneFrame>
        {screen === SCREENS.QUESTIONS ? (
          <QuestionScreen
            step={step + 1}
            total={visibleQs.length}
            title={currentQ.title}
            subtitle={currentQ.subtitle}
            options={currentQ.options}
            selected={answers[currentQ.key]}
            onSelect={(val) => setAnswers(a => ({ ...a, [currentQ.key]: val }))}
            onNext={handleNext}
            onBack={step > 0 ? () => setStep(s => s - 1) : undefined}
          />
        ) : (
          <ChecklistView />
        )}
      </PhoneFrame>

      {/* Scenario presets */}
      <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          {
            label: "Your scenario 🎯",
            a: { gp_alive: "YES", gp_id_valid: "NO", gp_marriages: "2", gp_name_change: "NO", parent_alive: "YES", parent_marriages: "1", parent_name_change: "NO", applicant_marriages: "0", applicant_name_change: "NO" },
          },
          {
            label: "Simple case",
            a: { gp_alive: "NO", gp_marriages: "1", gp_name_change: "NO", parent_alive: "YES", parent_marriages: "0", parent_name_change: "NO", applicant_marriages: "0", applicant_name_change: "NO" },
          },
          {
            label: "Complex case",
            a: { gp_alive: "YES", gp_id_valid: "NO", gp_marriages: "3+", gp_name_change: "YES_ANGL", parent_alive: "NO", parent_marriages: "2", parent_name_change: "YES_DEED", applicant_marriages: "1", applicant_name_change: "YES_ANGL" },
          },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setAnswers(preset.a);
              setScreen(SCREENS.CHECKLIST);
            }}
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20, padding: "7px 14px",
              fontSize: 12, fontFamily: "sans-serif", fontWeight: 600,
              color: "rgba(255,255,255,0.8)", cursor: "pointer",
            }}
          >{preset.label}</button>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, fontFamily: "sans-serif", color: "rgba(255,255,255,0.3)" }}>
        Tap a preset to load directly into checklist · Or tap through the questions
      </div>
    </div>
  );
}
