import { useRouter } from 'expo-router';
import { useState } from 'react';

import { QuestionScreen } from '@/components/QuestionScreen';
import { visibleChecklistQuestions } from '@/content/checklistQuestions';
import { useAppStore } from '@/store/useAppStore';

export default function ChecklistQuestions() {
  const router = useRouter();
  const route = useAppStore((s) => s.eligibilityResult?.route ?? null);
  const answers = useAppStore((s) => s.checklistAnswers);
  const setAnswer = useAppStore((s) => s.setChecklistAnswer);

  const [index, setIndex] = useState(0);

  const visible = visibleChecklistQuestions(answers, route);
  const clamped = Math.min(index, visible.length - 1);
  const question = visible[clamped];

  if (!question) {
    router.replace('/checklist');
    return null;
  }

  const isLast = clamped === visible.length - 1;

  const handleNext = () => {
    if (isLast) router.replace('/checklist');
    else setIndex(clamped + 1);
  };

  const handleBack = () => {
    if (clamped > 0) setIndex(clamped - 1);
    else if (router.canGoBack()) router.back();
  };

  return (
    <QuestionScreen
      step={clamped + 1}
      total={visible.length}
      title={question.title}
      subtitle={question.subtitle}
      help={question.help}
      options={question.options}
      selected={answers[question.key]}
      onSelect={(value) => setAnswer(question.key, value)}
      onNext={handleNext}
      onBack={handleBack}
      nextLabel={isLast ? 'See my checklist →' : 'Continue →'}
    />
  );
}
