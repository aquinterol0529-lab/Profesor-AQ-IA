import React, { useState } from 'react';
import { Question, Project, Source } from '../types';
import { Award, BookMarked, Briefcase, CheckCircle, ChevronLeft, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  evaluation: Question[];
  projects: Project[];
  sources: Source[];
  onPrev: () => void;
}

export function FinalSection({ evaluation, projects, sources, onPrev }: Props) {
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (qIndex: number, oIndex: number) => {
    if (showResults) return;
    setTestAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const checkTest = () => {
    setShowResults(true);
  };

  const score = evaluation.reduce((acc, q, idx) => {
    return acc + (testAnswers[idx] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / evaluation.length) * 100);
  const isEvaluationComplete = Object.keys(testAnswers).length === evaluation.length;

  return (
    <div className="pb-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-8 shadow-2xl shadow-emerald-500/20 rotate-6 hover:rotate-0 transition-transform duration-500">
          <Award className="w-12 h-12" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          ¡Misión Cumplida!
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Has completado todas las lecciones. Es momento de validar tus conocimientos y llevarlos al mundo real.
        </p>
      </motion.div>

      <div className="space-y-12">
        {/* Evaluación Final */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-6 shadow-inner">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Evaluación Final</h2>
          </div>
          
          <div className="space-y-12">
            {evaluation.map((q, qIdx) => (
              <div key={qIdx} className="space-y-5">
                <p className="text-xl font-bold text-slate-900 dark:text-white flex items-start">
                  <span className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-sm mr-4 shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  {q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-14">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = testAnswers[qIdx] === oIdx;
                    const isCorrect = q.correctAnswerIndex === oIdx;
                    
                    let btnClass = "w-full text-left px-6 py-5 rounded-2xl border-2 transition-all duration-300 font-bold ";
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
                        btnClass += "bg-purple-50 dark:bg-purple-900/20 border-purple-600 text-purple-700 dark:text-purple-400 shadow-xl shadow-purple-600/10";
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
                        <span className="text-xs font-black uppercase tracking-widest mr-4 opacity-50">
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
                disabled={!isEvaluationComplete}
                className="mt-16 w-full sm:w-auto px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl"
              >
                Entregar Evaluación
              </motion.button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-16 p-10 rounded-[3rem] bg-slate-900 dark:bg-slate-800 text-white text-center relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-purple-600/10 pointer-events-none" />
                <p className="text-sm font-black uppercase tracking-[0.3em] text-purple-400 mb-4">Tu Resultado Final</p>
                <div className="text-8xl font-black mb-6 flex items-center justify-center">
                  {percentage}<span className="text-4xl text-purple-500 ml-2">%</span>
                </div>
                <p className="text-xl text-slate-300 max-w-md mx-auto leading-relaxed">
                  Has acertado {score} de {evaluation.length} preguntas.
                  {percentage >= 80 
                    ? ' ¡Excelente dominio del tema! Eres un experto.' 
                    : percentage >= 60 
                      ? ' Buen trabajo, tienes una base sólida.' 
                      : ' Sigue practicando, el conocimiento se construye paso a paso.'}
                </p>
                {percentage >= 80 && (
                  <div className="mt-8 flex justify-center">
                    <div className="px-6 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black uppercase tracking-widest flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Certificado de Aprovechamiento
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Proyecto Final */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-6 shadow-inner">
              <Briefcase className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Proyecto Final</h2>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">Elige una de estas propuestas para aplicar lo aprendido en un escenario real y consolidar tu conocimiento.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-purple-50 dark:bg-purple-900/10 rounded-[2.5rem] p-10 border border-purple-100 dark:border-purple-900/30 group hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-purple-600 mb-6 shadow-md">
                  <span className="font-black">{idx + 1}</span>
                </div>
                <h3 className="font-black text-purple-900 dark:text-purple-300 text-2xl mb-4 leading-tight">{project.title}</h3>
                <p className="text-purple-800/70 dark:text-purple-400/70 text-lg leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fuentes */}
        {sources && sources.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mr-6 shadow-inner">
                <BookMarked className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Fuentes y Referencias</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mr-4" />
                    <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {source.title}
                    </span>
                  </div>
                  <ExternalLink size={18} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center">
        <button
          onClick={onPrev}
          className="flex items-center px-8 py-4 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-bold transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 mr-3 group-hover:-translate-x-2 transition-transform" />
          Volver a la última lección
        </button>
      </div>
    </div>
  );
}

