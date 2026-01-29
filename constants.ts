
import { Subject, DifficultyLevel } from './types';

// Mock data based on common exam incidence
export const DEFAULT_INCIDENCE_DATA: Record<string, number> = {
  'Português': 15.5,
  'Matemática': 8.2,
  'Raciocínio Lógico': 7.5,
  'Direito Constitucional': 12.0,
  'Direito Administrativo': 11.5,
  'Informática': 6.0,
  'Contabilidade': 5.0,
  'Inglês': 4.0,
  'Direito Penal': 9.0,
  'Direito Processual Penal': 8.5
};

export const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Português', weight: 3, difficulty: DifficultyLevel.MEDIUM, incidence: 15.5 },
  { id: '2', name: 'Direito Constitucional', weight: 4, difficulty: DifficultyLevel.HARD, incidence: 12.0 },
  { id: '3', name: 'Direito Administrativo', weight: 4, difficulty: DifficultyLevel.MEDIUM, incidence: 11.5 }
];
