/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CourseForm } from './components/CourseForm';
import { VirtualClassroom } from './components/VirtualClassroom';
import { generateCourse } from './services/gemini';
import { CourseData, CourseInput } from './types';
import { GraduationCap, Loader2, Sparkles, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved course and theme from localStorage
  useEffect(() => {
    const savedCourse = localStorage.getItem('profesor_aq_course');
    if (savedCourse) {
      try {
        setCourseData(JSON.parse(savedCourse));
      } catch (e) {
        localStorage.removeItem('profesor_aq_course');
      }
    }
    const savedTheme = localStorage.getItem('profesor_aq_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('profesor_aq_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleGenerateCourse = async (input: CourseInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateCourse(input);
      setCourseData(data);
      localStorage.setItem('profesor_aq_course', JSON.stringify(data));
    } catch (err) {
      console.error(err);
      setError('Hubo un error al generar el curso. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres salir? Se perderá el progreso del curso actual.')) {
      setCourseData(null);
      localStorage.removeItem('profesor_aq_course');
      localStorage.removeItem('profesor_aq_progress');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform"
          title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 animate-ping rounded-full bg-purple-400/20" />
              <div className="relative bg-purple-600 p-8 rounded-[2rem] shadow-2xl shadow-purple-600/30">
                <GraduationCap className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center">
                Diseñando tu aula virtual
                <Loader2 className="w-8 h-8 ml-4 animate-spin text-purple-600" />
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                El Profesor AQ IA está consultando fuentes actualizadas y estructurando las mejores lecciones para tu perfil...
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Personalizando objetivos de aprendizaje',
                  'Generando actividades prácticas reales',
                  'Preparando evaluaciones dinámicas',
                  'Conectando con fuentes externas'
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800"
                  >
                    <Sparkles className="w-4 h-4 mr-3 text-purple-500" />
                    {text}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : !courseData ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CourseForm onSubmit={handleGenerateCourse} error={error} />
          </motion.div>
        ) : (
          <motion.div
            key="classroom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <VirtualClassroom course={courseData} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


