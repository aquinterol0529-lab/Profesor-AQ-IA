import React, { useState } from 'react';
import { Lesson } from '../types';
import { Lightbulb, FlaskConical, PenTool, HelpCircle, ChevronLeft, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  unitIndex: number;
  lessonIndex: number;
  lesson: Lesson;
  unitTitle: string;
  isCompleted: boolean;
  onMarkCompleted: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function LessonContent({ unitIndex, lessonIndex, lesson, unitTitle, isCompleted, onMarkCompleted, onNext, onPrev }: Props) {
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (qIndex: number, oIndex: number) => {
    if (showResults) return;
    setTestAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const checkTest = () => {
    setShowResults(true);
  };

  const score = lesson.quickTest.reduce((acc, q, idx) => {
    return acc + (testAnswers[idx] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  const isTestComplete = Object.keys(testAnswers).length === lesson.quickTest.length;

  return (
    <div className="pb-20">
      <div className="mb-12">
        <div className="flex items-center space-x-2 text-sm font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em] mb-3">
          <Sparkles size={16} />
          <span>Unidad {unitIndex + 1}: {unitTitle}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          {unitIndex + 1}.{lessonIndex + 1} {lesson.title}
        </h1>
      </div>

      <div className="space-y-10">
        {/* Idea Clave */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-5 shadow-inner">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Idea clave</h2>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xl font-medium">
            {lesson.keyIdea}
          </p>
        </motion.div>

        {/* Ejemplo Aplicado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-5 shadow-inner">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Ejemplo aplicado</h2>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 italic text-slate-700 dark:text-slate-300 leading-relaxed">
            "{lesson.appliedExample}"
          </div>
        </motion.div>

        {/* Actividad Práctica */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-5 shadow-inner">
              <PenTool className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Actividad práctica</h2>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-900/30">
            <p className="text-purple-900 dark:text-purple-300 font-bold text-lg leading-relaxed">
              {lesson.practicalActivity}
            </p>
          </div>
        </motion.div>

        {/* Test Rápido */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-5 shadow-inner">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Test rápido</h2>
          </div>
          
          <div className="space-y-10">
            {lesson.quickTest.map((q, qIdx) => (
              <div key={qIdx} className="space-y-4">
                <p className="text-lg font-bold text-slate-900 dark:text-white flex items-start">
                  <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs mr-3 shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  {q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = testAnswers[qIdx] === oIdx;
                    const isCorrect = q.correctAnswerIndex === oIdx;
                    
                    let btnClass = "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 font-medium ";
                    if (showResults) {
                      if (isCorrect) {
                        btnClass += "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-400";
                      } else if (isSelected && !isCorrect) {
                        btnClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-400";
                      } else {
                        btnClass += "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 opacity-50";
                      }
                    } else {
                      if (isSelected) {
                        btnClass += "bg-purple-50 dark:bg-purple-900/20 border-purple-600 text-purple-700 dark:text-purple-400 shadow-lg shadow-purple-600/10";
                      } else {
                        btnClass += "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(qIdx, oIdx)}
                        disabled={showResults}
                        className={btnClass}
                      >
                        <span className="text-xs font-black uppercase tracking-widest mr-3 opacity-50">
                          {['A', 'B', 'C', 'D'][oIdx]}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {!showResults ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={checkTest}
                disabled={!isTestComplete}
                className="mt-12 w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl"
              >
                Comprobar respuestas
              </motion.button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-6 rounded-3xl bg-purple-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-purple-600/30"
              >
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] opacity-80 mb-1">Resultados del test</p>
                  <p className="text-2xl font-bold">Has acertado {score} de {lesson.quickTest.length} preguntas.</p>
                </div>
                {!isCompleted && (
                  <button
                    onClick={onMarkCompleted}
                    className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 flex items-center shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Completar lección
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onPrev}
          className="flex items-center px-6 py-3 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-bold transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" />
          Anterior
        </button>
        <button
          onClick={() => {
            if (!isCompleted && showResults) onMarkCompleted();
            onNext();
          }}
          className="flex items-center px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-600/20 group"
        >
          Siguiente
          <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

