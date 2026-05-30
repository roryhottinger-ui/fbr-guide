import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/theme';
import type { ChecklistAnswers, MarriageCount, NameChange, Route } from '@/types';

type Status = 'ok' | 'warn' | 'block' | 'neutral';

const STATUS_COLORS: Record<Status, { bg: string; border: string; dot: string; text: string }> = {
  ok: { bg: colors.greenLight, border: '#B8D9C4', dot: colors.green, text: colors.greenDark },
  warn: { bg: colors.warnLight, border: colors.warnBorder, dot: colors.warn, text: colors.warn },
  block: { bg: colors.blockLight, border: colors.blockBorder, dot: colors.block, text: colors.block },
  neutral: { bg: '#F0EDE7', border: colors.border, dot: colors.textLight, text: colors.textMid },
};

function ChainNode({ name, type, status }: { name: string; type: string; status: Status }) {
  const c = STATUS_COLORS[status];
  return (
    <View style={[styles.node, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <View style={styles.flex}>
        <Text style={[styles.nodeName, { color: c.text }]}>{name}</Text>
        <Text style={[styles.nodeType, { color: c.text }]}>{type}</Text>
      </View>
    </View>
  );
}

function ChainArrow({ label, status }: { label: string; status: Status }) {
  const c = STATUS_COLORS[status];
  return (
    <View style={styles.arrowWrap}>
      <View style={[styles.arrowLine, { backgroundColor: c.dot }]} />
      <View style={[styles.arrowLabel, { borderColor: c.dot, backgroundColor: c.bg }]}>
        <Text style={[styles.arrowText, { color: c.text }]}>{label}</Text>
      </View>
      <View style={[styles.arrowLine, { backgroundColor: c.dot }]} />
    </View>
  );
}

function marriages(m: MarriageCount | undefined): number {
  return m === '3+' ? 3 : parseInt(m ?? '0', 10) || 0;
}

interface PersonChainProps {
  label: string;
  m: number;
  nameChange?: NameChange;
  idLabel: string;
  idType: string;
  idStatus: Status;
}

function PersonChain({ label, m, nameChange, idLabel, idType, idStatus }: PersonChainProps) {
  const noBridges = m === 0 && (!nameChange || nameChange === 'NO');
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.personLabel}>{label}</Text>
      <ChainNode name="Birth certificate" type="Starting name" status="neutral" />
      {nameChange === 'YES_DEED' ? (
        <>
          <ChainArrow label="Deed poll" status="ok" />
          <ChainNode name="New legal name" type="After deed poll" status="ok" />
        </>
      ) : null}
      {nameChange === 'YES_ANGL' ? (
        <>
          <ChainArrow label="Stat. declaration" status="warn" />
          <ChainNode name="Anglicised name" type="Declaration needed" status="warn" />
        </>
      ) : null}
      {m >= 1 ? (
        <>
          <ChainArrow label="Marriage cert ①" status="ok" />
          <ChainNode name="Name after 1st marriage" type="Marriage certificate ①" status="ok" />
        </>
      ) : null}
      {m >= 2 ? (
        <>
          <ChainArrow label="Marriage cert ②" status="ok" />
          <ChainNode name="Name after 2nd marriage" type="Marriage certificate ②" status="ok" />
        </>
      ) : null}
      {m >= 3 ? (
        <>
          <ChainArrow label="Further certs" status="warn" />
          <ChainNode name="Final married name" type="All marriage certs required" status="warn" />
        </>
      ) : null}
      <ChainArrow
        label={idStatus === 'block' ? '⚠ Needs renewal' : noBridges ? 'No name change' : 'Current ID'}
        status={idStatus}
      />
      <ChainNode name={idLabel} type={idType} status={idStatus} />
    </View>
  );
}

export function ChainVisualiser({ answers: a, route }: { answers: ChecklistAnswers; route: Route | null }) {
  const isRouteA = route === 'ROUTE_A';

  const gpIdStatus: Status =
    a.gp_alive === 'NO' ? 'ok' : a.gp_id_valid === 'NO' ? 'block' : a.gp_id_valid === 'YES' ? 'ok' : 'neutral';
  const gpIdLabel =
    a.gp_alive === 'NO' ? 'Death certificate' : a.gp_id_valid === 'NO' ? '⚠ Expired ID — renew first' : 'Current photo ID ✓';
  const gpIdType =
    a.gp_alive === 'NO' ? 'Confirms death' : a.gp_id_valid === 'NO' ? 'Needs renewal before submitting' : 'Valid & unexpired';

  const parentDeceased = a.parent_alive === 'NO';

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Document chain</Text>
      {isRouteA ? (
        <>
          <PersonChain
            label="Your grandparent"
            m={marriages(a.gp_marriages)}
            nameChange={a.gp_name_change}
            idLabel={gpIdLabel}
            idType={gpIdType}
            idStatus={gpIdStatus}
          />
          <View style={styles.divider} />
        </>
      ) : null}
      <PersonChain
        label="Your parent"
        m={marriages(a.parent_marriages)}
        nameChange={a.parent_name_change}
        idLabel={parentDeceased ? 'Death certificate' : 'Current photo ID ✓'}
        idType={parentDeceased ? 'Confirms death' : 'Valid & unexpired'}
        idStatus="ok"
      />
      <View style={styles.divider} />
      <PersonChain
        label="You"
        m={marriages(a.applicant_marriages)}
        nameChange={a.applicant_name_change}
        idLabel="Current photo ID ✓"
        idType="Valid & unexpired"
        idStatus="ok"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  personLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  node: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  nodeName: { fontSize: 12, fontWeight: '700', letterSpacing: -0.1 },
  nodeType: { fontSize: 10, opacity: 0.75, marginTop: 1 },
  arrowWrap: { alignItems: 'center', paddingVertical: 2 },
  arrowLine: { width: 1.5, height: 6 },
  arrowLabel: { borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6, marginVertical: 2 },
  arrowText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.2, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
});

export default ChainVisualiser;
