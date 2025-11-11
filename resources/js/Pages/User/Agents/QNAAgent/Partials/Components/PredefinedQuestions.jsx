import React from 'react';
import { useTrans } from '@/Hooks/useTrans';

export default function PredefinedQuestions({ onQuestionClick, currentConversation }) {
  const { t } = useTrans();

  // Show predefined questions if there's a current conversation
  if (!currentConversation) {
    return null;
  }

  const predefinedQuestions = [
    t('predefined_question_1'),
    t('predefined_question_2'),
    t('predefined_question_3'),
    t('predefined_question_4')
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {predefinedQuestions.map((question, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick(question)}
          className="group inline-flex items-center px-5 py-3 rounded-2xl bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-700/90 text-green-700 dark:text-green-300 text-sm font-medium border-2 border-green-200/60 dark:border-green-600/30 hover:border-green-300 dark:hover:border-green-500 shadow-lg hover:shadow-xl hover:shadow-green-500/20 dark:hover:shadow-green-500/10 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 backdrop-blur-sm "
        >
          <i className="fa-solid fa-magic-wand-sparkles text-sm mx-3 text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors duration-200"></i>
          <span className="truncate leading-relaxed">{question}</span>
        </button>
      ))}
    </div>
  );
}
