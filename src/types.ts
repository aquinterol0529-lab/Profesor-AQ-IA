export interface CourseInput {
  tema: string;
  nivel: string;
  perfil: string;
  objetivo: string;
  tiempo: string;
  formato: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Lesson {
  id?: string;
  title: string;
  keyIdea: string;
  appliedExample: string;
  practicalActivity: string;
  quickTest: Question[];
}

export interface Unit {
  id?: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface Project {
  title: string;
  description: string;
}

export interface Source {
  title: string;
  url: string;
}

export interface CourseData {
  title: string;
  description: string;
  level: string;
  duration: string;
  targetProfile: string;
  learningObjectives: string[];
  units: Unit[];
  finalEvaluation: Question[];
  finalProjects: Project[];
  sources: Source[];
}
