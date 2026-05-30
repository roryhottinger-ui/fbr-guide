import { useLocalSearchParams, useRouter } from 'expo-router';

import { QuestionScreen } from '@/components/QuestionScreen';
import { eligibilityQuestions } from '@/content/eligibilityFlow';
import { traverse } from '@/engine/eligibility';
import { useAppStore } from '@/store/useAppStore';
import type { EligibilityAnswerKey, EligibilityAnswers } from '@/types';

/** Walk the active path of answered questions to estimate soft progress. */
function activePath(answers: EligibilityAnswers): EligibilityAnswerKey[] {
  const path: EligibilityAnswerKey[] = [];
  const a: EligibilityAnswers = {};
  // Bound the loop defensively.
  for (let i = 0; i < 12; i++) {
    const t = traverse(a);
    if (t.type === 'result') break;
    path.push(t.id);
    if (answers[t.id] === undefined) break;
    a[t.id] = answers[t.id];
  }
  return path;
}

export default function EligibilityStep() {
  const router = useRouter();
  const { step } = useLocalSearchParams<{ step: string }>();
  const id = step as EligibilityAnswerKey;
  const question = eligibilityQuestions[id];

  const answers = useAppStore((s) => s.eligibilityAnswers);
  const setAnswer = useAppStore((s) => s.setEligibilityAnswer);
  const setResult = useAppStore((s) => s.setEligibilityResult);

  if (!question) {
    // Unknown step id — send the user back to the start.
    router.replace('/eligibility/born_ireland');
    return null;
  }

  const path = activePath(answers);
  const idx = path.indexOf(id);
  const stepNum = (idx === -1 ? path.length : idx + 1) || 1;
  const total = Math.max(path.length + 1, 4);

  // If answering this question doesn't advance the traversal, the user picked
  // an "I'm not sure" option — keep them here and surface the help text.
  const t = traverse(answers);
  const stuck = t.type === 'question' && t.id === id && answers[id] !== undefined;

  const handleNext = () => {
    if (t.type === 'result') {
      setResult(t.result);
      router.replace('/eligibility/result');
    } else if (t.id !== id) {
      router.push(`/eligibility/${t.id}`);
    }
  };

  return (
    <QuestionScreen
      step={stepNum}
      total={total}
      title={question.title}
      subtitle={question.subtitle}
      help={question.help}
      options={question.options}
      selected={answers[id]}
      onSelect={(value) => setAnswer(id, value)}
      onNext={handleNext}
      onBack={router.canGoBack() ? () => router.back() : undefined}
      nextDisabled={stuck}
      forceHelpOpen={stuck}
    />
  );
}
