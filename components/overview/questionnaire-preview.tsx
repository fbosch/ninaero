"use client";

import { useState } from "react";
import type { PreviewProps } from "@/lib/component-overview";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/registry/ninaero/ui/questionnaire";

export default function QuestionnairePreview({ interactive }: PreviewProps) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="w-full max-w-72 space-y-2">
      <Questionnaire
        onSubmit={(event) => {
          event.preventDefault();
          if (interactive) setSubmitted(true);
        }}
      >
        <QuestionnaireProgress>Questionnaire</QuestionnaireProgress>
        <QuestionnaireItem name="format" required>
          <QuestionnaireTitle>Which format do you prefer?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="short">
              Short updates
            </QuestionnaireChoice>
            <QuestionnaireChoice value="detailed">
              Detailed updates
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireActions>
            <QuestionnaireNext>Next</QuestionnaireNext>
          </QuestionnaireActions>
        </QuestionnaireItem>
        <QuestionnaireItem name="frequency" required>
          <QuestionnaireTitle>How often?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="weekly">Weekly</QuestionnaireChoice>
            <QuestionnaireChoice value="monthly">Monthly</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireActions>
            <QuestionnairePrevious>Back</QuestionnairePrevious>
            <QuestionnaireSubmit>Finish demo</QuestionnaireSubmit>
          </QuestionnaireActions>
        </QuestionnaireItem>
      </Questionnaire>
      {submitted && (
        <output className="block text-xs text-muted-foreground">
          Demo answers complete; nothing was sent.
        </output>
      )}
    </div>
  );
}
