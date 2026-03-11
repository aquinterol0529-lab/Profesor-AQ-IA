import React, { useState } from 'react';
import { BookOpen, Target, Clock, User, Layout, GraduationCap, Sparkles } from 'lucide-react';
import { CourseInput } from '../types';
import { motion } from 'motion/react';

interface Props {
  onSubmit: (input: CourseInput) => void;
  error: string | null;
}

export function CourseForm({ onSubmit, error }: Props) {
  const [formData, setFormData] = useState<CourseInput>({
    tema: '',
    nivel: 'Principiante',
    perfil: '',
    objetivo: '',
    tiempo: '',
    formato: 'Mixto'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-purple-600 text-white mb-8 shadow-2xl shadow-purple-600/30 rotate-3 hover:rotate-0 transition-transform duration-500">
          <GraduationCap size={40} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Tu Aula Virtual <span className="text-purple-600">Inteligente</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Diseña un plan de estudio completo y personalizado en segundos. La IA del Profesor AQ crea lecciones, actividades y evaluaciones adaptadas a ti.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 overflow-hidden"
      >
        <div className="p-8 sm:p-12">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <BookOpen size={16} className="mr-2 text-purple-600" />
                  Tema del curso
                </label>
                <input
                  required
                  type="text"
                  name="tema"
                  value={formData.tema}
                  onChange={handleChange}
                  placeholder="Ej. Química Orgánica Avanzada"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Target size={16} className="mr-2 text-purple-600" />
                  Nivel del alumno
                </label>
                <select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all outline-none appearance-none"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <User size={16} className="mr-2 text-purple-600" />
                  Perfil del alumno
                </label>
                <input
                  required
                  type="text"
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleChange}
                  placeholder="Ej. Estudiante de Ingeniería"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Sparkles size={16} className="mr-2 text-purple-600" />
                  Objetivo principal
                </label>
                <input
                  required
                  type="text"
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleChange}
                  placeholder="Ej. Dominar las reacciones de síntesis"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Clock size={16} className="mr-2 text-purple-600" />
                  Tiempo disponible
                </label>
                <input
                  required
                  type="text"
                  name="tiempo"
                  value={formData.tiempo}
                  onChange={handleChange}
                  placeholder="Ej. 2 semanas, 1 hora diaria"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Layout size={16} className="mr-2 text-purple-600" />
                  Formato preferido
                </label>
                <select
                  name="formato"
                  value={formData.formato}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all outline-none appearance-none"
                >
                  <option value="Lecturas breves">Lecturas breves</option>
                  <option value="Lecturas + ejercicios">Lecturas + ejercicios</option>
                  <option value="Esquemas + problemas">Esquemas + problemas</option>
                  <option value="Mixto">Mixto</option>
                </select>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-10 rounded-2xl transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center text-xl group"
              >
                Diseñar curso ahora
                <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

