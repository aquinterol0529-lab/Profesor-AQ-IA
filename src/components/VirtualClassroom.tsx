import React, { useState, useEffect } from 'react';
import { CourseData } from '../types';
import { 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  GraduationCap, 
  LayoutDashboard, 
  Target, 
  PlayCircle, 
  Clock, 
  BarChart3,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { LessonContent } from './LessonContent';
import { FinalSection } from './FinalSection';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  course: CourseData;
  onReset: () => void;
}

type ViewState = 
  | { type: 'overview' }
  | { type: 'lesson'; unitIndex: number; lessonIndex: number }
  | { type: 'final' };

export function VirtualClassroom({ course, onReset }: Props) {
  const [view, setView] = useState<ViewState>({ type: 'overview' });
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('profesor_aq_progress');
    if (savedProgress) {
      try {
        setCompletedLessons(new Set(JSON.parse(savedProgress)));
      } catch (e) {
        console.error("Error loading progress", e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('profesor_aq_progress', JSON.stringify(Array.from(completedLessons)));
  }, [completedLessons]);

  const totalLessons = course.units.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

  const handleMarkCompleted = (lessonId: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      next.add(lessonId);
      return next;
    });
  };

  const navigateToLesson = (unitIndex: number, lessonIndex: number) => {
    setView({ type: 'lesson', unitIndex, lessonIndex });
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getNextPendingLesson = () => {
    for (let u = 0; u < course.units.length; u++) {
      for (let l = 0; l < course.units[u].lessons.length; l++) {
        const id = course.units[u].lessons[l].id || `${u}-${l}`;
        if (!completedLessons.has(id)) {
          return { unitIndex: u, lessonIndex: l };
        }
      }
    }
    return null;
  };

  const handleContinue = () => {
    const next = getNextPendingLesson();
    if (next) {
      navigateToLesson(next.unitIndex, next.lessonIndex);
    } else {
      setView({ type: 'final' });
    }
  };

  const navigateNext = () => {
    if (view.type === 'lesson') {
      const { unitIndex, lessonIndex } = view;
      const currentUnit = course.units[unitIndex];
      
      if (lessonIndex < currentUnit.lessons.length - 1) {
        navigateToLesson(unitIndex, lessonIndex + 1);
      } else if (unitIndex < course.units.length - 1) {
        navigateToLesson(unitIndex + 1, 0);
      } else {
        setView({ type: 'final' });
      }
    } else if (view.type === 'overview') {
      handleContinue();
    }
  };

  const navigatePrev = () => {
    if (view.type === 'lesson') {
      const { unitIndex, lessonIndex } = view;
      
      if (lessonIndex > 0) {
        navigateToLesson(unitIndex, lessonIndex - 1);
      } else if (unitIndex > 0) {
        const prevUnit = course.units[unitIndex - 1];
        navigateToLesson(unitIndex - 1, prevUnit.lessons.length - 1);
      } else {
        setView({ type: 'overview' });
      }
    } else if (view.type === 'final') {
      const lastUnitIndex = course.units.length - 1;
      const lastUnit = course.units[lastUnitIndex];
      navigateToLesson(lastUnitIndex, lastUnit.lessons.length - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 md:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button 
              onClick={() => setView({ type: 'overview' })}
              className="flex items-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20 mr-3 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:inline">Profesor AQ IA</span>
            </button>
          </div>
          
          <div className="flex-1 max-w-xl mx-8 hidden lg:block">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
              <span>Progreso General</span>
              <span>{completedLessons.size} de {totalLessons} lecciones • {progressPercentage}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onReset}
              className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] mx-auto w-full flex relative">
        {/* Sidebar Overlay for Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-20 z-40 h-[calc(100vh-5rem)] w-72 lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto transition-all duration-300
          ${isSidebarOpen ? 'left-0' : '-left-full md:left-0'}
        `}>
          <div className="p-6">
            <div className="mb-8 md:hidden">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                <span>Progreso</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">Plan de Estudios</h3>
            <div className="space-y-8">
              {course.units.map((unit, uIdx) => (
                <div key={unit.id || uIdx} className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-start text-sm leading-tight">
                    <span className="text-purple-600 mr-2 shrink-0">{uIdx + 1}.</span>
                    {unit.title}
                  </h4>
                  <div className="space-y-1">
                    {unit.lessons.map((lesson, lIdx) => {
                      const id = lesson.id || `${uIdx}-${lIdx}`;
                      const isActive = view.type === 'lesson' && view.unitIndex === uIdx && view.lessonIndex === lIdx;
                      const isCompleted = completedLessons.has(id);
                      
                      return (
                        <button
                          key={id}
                          onClick={() => navigateToLesson(uIdx, lIdx)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center group relative ${
                            isActive 
                              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-bold' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="activeIndicator"
                              className="absolute left-0 w-1 h-6 bg-purple-600 rounded-r-full"
                            />
                          )}
                          <div className="mr-3 shrink-0">
                            {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <CheckCircle size={14} />
                              </div>
                            ) : (
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isActive ? 'border-purple-600 text-purple-600' : 'border-slate-300 dark:border-slate-700 text-slate-400'
                              }`}>
                                <PlayCircle size={12} />
                              </div>
                            )}
                          </div>
                          <span className="truncate">{uIdx + 1}.{lIdx + 1} {lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setView({ type: 'final' });
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center ${
                    view.type === 'final'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className={`w-5 h-5 mr-3 ${view.type === 'final' ? 'text-white' : 'text-purple-600'}`} />
                  Evaluación Final
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 lg:p-16 overflow-y-auto">
          <AnimatePresence mode="wait">
            {view.type === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                {/* Course Hero Header */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 mb-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-3 mb-8">
                      <span className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-black uppercase tracking-widest">
                        {course.level}
                      </span>
                      <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-black uppercase tracking-widest flex items-center">
                        <Clock size={14} className="mr-2" />
                        {course.duration}
                      </span>
                      <span className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest">
                        {course.targetProfile}
                      </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{course.title}</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-3xl">{course.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-slate-100 dark:border-slate-800 mb-10">
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Unidades</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{course.units.length}</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Lecciones</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalLessons}</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Completado</div>
                        <div className="text-2xl font-bold text-purple-600">{progressPercentage}%</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Estado</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {progressPercentage === 100 ? 'Finalizado' : progressPercentage > 0 ? 'En curso' : 'Sin empezar'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleContinue}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-10 rounded-2xl transition-all shadow-xl shadow-purple-600/30 flex items-center text-xl group"
                    >
                      {progressPercentage === 0 ? 'Comenzar curso' : 'Continuar donde lo dejé'}
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-lg border border-slate-100 dark:border-slate-800">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                        <Target className="w-8 h-8 text-purple-600 mr-3" />
                        Objetivos de aprendizaje
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        {course.learningObjectives.map((obj, idx) => (
                          <div key={idx} className="flex items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                              <CheckCircle size={14} />
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center px-2">
                        <LayoutDashboard className="w-8 h-8 text-purple-600 mr-3" />
                        Mapa del curso
                      </h2>
                      {course.units.map((unit, idx) => (
                        <div key={unit.id || idx} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-lg border border-slate-100 dark:border-slate-800 group hover:border-purple-200 dark:hover:border-purple-900/30 transition-all">
                          <div className="flex items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center font-black text-xl mr-5 shrink-0 group-hover:scale-110 transition-transform">
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{unit.title}</h3>
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{unit.summary}</p>
                            </div>
                          </div>
                          <div className="pl-0 sm:pl-16 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {unit.lessons.map((lesson, lIdx) => (
                              <div key={lesson.id || lIdx} className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                                <BookOpen className="w-4 h-4 text-purple-400 mr-3 shrink-0" />
                                <span className="truncate">{idx + 1}.{lIdx + 1} {lesson.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-purple-600 rounded-[2rem] p-8 text-white shadow-xl shadow-purple-600/20">
                      <h3 className="text-xl font-bold mb-4">Tu progreso</h3>
                      <div className="text-5xl font-black mb-4">{progressPercentage}%</div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-white" style={{ width: `${progressPercentage}%` }} />
                      </div>
                      <p className="text-purple-100 text-sm leading-relaxed mb-8">
                        {progressPercentage === 100 
                          ? '¡Increíble! Has completado todo el curso. Puedes realizar la evaluación final.' 
                          : 'Sigue así. Cada lección te acerca más a tu objetivo.'}
                      </p>
                      <button 
                        onClick={handleContinue}
                        className="w-full py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors"
                      >
                        {progressPercentage === 0 ? 'Empezar ahora' : 'Continuar'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view.type === 'lesson' && (
              <motion.div 
                key={`lesson-${view.unitIndex}-${view.lessonIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <LessonContent 
                  unitIndex={view.unitIndex}
                  lessonIndex={view.lessonIndex}
                  lesson={course.units[view.unitIndex].lessons[view.lessonIndex]}
                  unitTitle={course.units[view.unitIndex].title}
                  isCompleted={completedLessons.has(course.units[view.unitIndex].lessons[view.lessonIndex].id || `${view.unitIndex}-${view.lessonIndex}`)}
                  onMarkCompleted={() => handleMarkCompleted(course.units[view.unitIndex].lessons[view.lessonIndex].id || `${view.unitIndex}-${view.lessonIndex}`)}
                  onNext={navigateNext}
                  onPrev={navigatePrev}
                />
              </motion.div>
            )}

            {view.type === 'final' && (
              <motion.div 
                key="final"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-4xl mx-auto"
              >
                <FinalSection 
                  evaluation={course.finalEvaluation}
                  projects={course.finalProjects}
                  sources={course.sources}
                  onPrev={navigatePrev}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

