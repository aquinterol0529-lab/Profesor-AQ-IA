/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CourseForm } from './components/CourseForm';
import { VirtualClassroom } from './components/VirtualClassroom';
import { Auth } from './components/Auth';
import { generateCourse } from './services/gemini';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { CourseData, CourseInput } from './types';
import { GraduationCap, Loader2, Sparkles, Moon, Sun, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('profesor_aq_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Load user's last course from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists() && userDoc.data().lastCourse) {
            setCourseData(userDoc.data().lastCourse);
          }
        } catch (e) {
          console.error("Error loading user data", e);
        }
      } else {
        setCourseData(null);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('profesor_aq_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleGenerateCourse = async (input: CourseInput) => {
    if (!user) return;
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateCourse(input);
      setCourseData(data);
      
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        lastCourse: data,
        lastLoginAt: serverTimestamp()
      }, { merge: true });

      // Track event
      await addDoc(collection(db, 'events'), {
        uid: user.uid,
        type: 'COURSE_CREATED',
        payload: { topic: input.tema, level: input.nivel },
        timestamp: serverTimestamp()
      });

    } catch (err) {
      console.error(err);
      setError('Hubo un error al generar el curso. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres salir? Se perderá el progreso del curso actual.')) {
      setCourseData(null);
      if (user) {
        setDoc(doc(db, 'users', user.uid), { lastCourse: null }, { merge: true });
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-bold animate-pulse">Iniciando Aula Virtual...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform"
          title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          onClick={handleLogout}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-red-500 hover:scale-110 transition-transform"
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
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


