
import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_SUBJECTS, DEFAULT_INCIDENCE_DATA } from './constants';
import { Subject, Task, DifficultyLevel, Stats } from './types';
import { getMentorshipAdvice } from './services/geminiService';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Settings, 
  CheckCircle2, 
  Timer, 
  TrendingUp,
  Plus,
  Trash2,
  ChevronRight,
  BrainCircuit,
  ArrowRight,
  Target,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// --- Sub-components ---

const Onboarding = ({ onComplete }: { onComplete: (hours: number, subs: Subject[]) => void }) => {
  const [hours, setHours] = useState(4);
  const [subs, setSubs] = useState<Subject[]>([]);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(3);
  const [diff, setDiff] = useState(DifficultyLevel.MEDIUM);

  const addSub = () => {
    if (!name) return;
    const incidence = DEFAULT_INCIDENCE_DATA[name] || 5.0;
    setSubs([...subs, {
      id: Math.random().toString(36).substr(2, 9),
      name, weight, difficulty: diff, incidence
    }]);
    setName('');
  };

  const removeSub = (id: string) => setSubs(subs.filter(s => s.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-5 gap-0 bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-100">
        
        {/* Left Side: Branding & Welcome */}
        <div className="md:col-span-2 bg-indigo-600 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <BrainCircuit size={28} />
            </div>
            <h1 className="text-3xl font-bold mb-4 leading-tight">Bem-vindo à sua nova jornada.</h1>
            <p className="text-indigo-100 leading-relaxed">
              Vamos configurar sua mentoria personalizada. Precisamos entender seu tempo e seus desafios para criar o plano perfeito.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm bg-white/10 p-4 rounded-2xl">
              <Target size={18} className="text-indigo-300" />
              <span>Baseado em incidência real de provas</span>
            </div>
            <div className="flex items-center gap-3 text-sm bg-white/10 p-4 rounded-2xl">
              <Clock size={18} className="text-indigo-300" />
              <span>Blocos de 30-45min otimizados</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-3 p-10 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Configuração Inicial</h2>
          
          <div className="space-y-10">
            {/* Step 1: Hours */}
            <section>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Tempo Disponível</label>
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                  <Clock size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-medium">Quantas horas por dia?</p>
                  <input 
                    type="range" min="1" max="12" value={hours} 
                    onChange={e => setHours(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
                  />
                </div>
                <span className="text-2xl font-black text-indigo-600 w-12 text-center">{hours}h</span>
              </div>
            </section>

            {/* Step 2: Subjects */}
            <section>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Suas Matérias</label>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <input 
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Nome da matéria (ex: Português)"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    value={weight} onChange={e => setWeight(Number(e.target.value))}
                    className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value={1}>Peso 1 (Baixo)</option>
                    <option value={3}>Peso 3 (Médio)</option>
                    <option value={5}>Peso 5 (Máximo)</option>
                  </select>
                  <select 
                    value={diff} onChange={e => setDiff(Number(e.target.value))}
                    className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value={DifficultyLevel.EASY}>Fácil</option>
                    <option value={DifficultyLevel.MEDIUM}>Médio</option>
                    <option value={DifficultyLevel.HARD}>Difícil</option>
                  </select>
                </div>
                <button 
                  onClick={addSub}
                  className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-bold shadow-lg"
                >
                  <Plus size={20} /> Adicionar à Lista
                </button>
              </div>

              {/* Added Subjects List */}
              <div className="space-y-3 mt-4">
                {subs.length > 0 ? subs.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <div>
                        <span className="font-bold text-slate-700">{s.name}</span>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full font-bold uppercase">PESO {s.weight}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-bold uppercase">{s.difficulty === 1 ? 'Fácil' : s.difficulty === 2 ? 'Médio' : 'Difícil'}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeSub(s.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-3xl">
                    <p className="text-slate-400 text-sm italic">Nenhuma matéria adicionada ainda</p>
                  </div>
                )}
              </div>
            </section>

            {/* Action */}
            <div className="pt-4 border-t border-slate-50">
              <button 
                disabled={subs.length === 0}
                onClick={() => onComplete(hours, subs)}
                className={`w-full py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all ${
                  subs.length > 0 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:scale-[1.02] hover:bg-indigo-700' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Iniciar Mentoria <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tarefas de Hoje', icon: Timer },
    { id: 'subjects', label: 'Matérias', icon: BookOpen },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <BrainCircuit size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">MentorAI</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <tab.icon size={20} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Plano Atual</p>
          <p className="font-semibold">Foco em Aprovação</p>
          <div className="w-full bg-slate-700 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full w-[65%]" />
          </div>
        </div>
      </div>
    </aside>
  );
};

const SubjectManager = ({ subjects, setSubjects }: { subjects: Subject[], setSubjects: React.Dispatch<React.SetStateAction<Subject[]>> }) => {
  const [newName, setNewName] = useState('');
  const [newWeight, setNewWeight] = useState(3);
  const [newDifficulty, setNewDifficulty] = useState(DifficultyLevel.MEDIUM);

  const addSubject = () => {
    if (!newName) return;
    const incidence = DEFAULT_INCIDENCE_DATA[newName] || 5.0;
    const newSub: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      weight: newWeight,
      difficulty: newDifficulty,
      incidence
    };
    setSubjects([...subjects, newSub]);
    setNewName('');
  };

  const removeSubject = (id: string) => setSubjects(subjects.filter(s => s.id !== id));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus size={20} className="text-indigo-600" /> Adicionar Matéria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-500 mb-1">Nome da Matéria</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Direito Penal" 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Peso (1-5)</label>
            <input 
              type="number" 
              min="1" max="5" 
              value={newWeight}
              onChange={(e) => setNewWeight(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            />
          </div>
          <button 
            onClick={addSubject}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(sub => (
          <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-slate-800">{sub.name}</h3>
              <button onClick={() => removeSubject(sub.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Peso</span>
                <span className="font-semibold">{sub.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dificuldade</span>
                <span className="font-semibold">{sub.difficulty === 1 ? 'Fácil' : sub.difficulty === 2 ? 'Média' : 'Difícil'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Incidência em Prova</span>
                <span className="text-indigo-600 font-bold">{sub.incidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyTasks = ({ tasks, updateTask }: { tasks: Task[], updateTask: (id: string, updates: Partial<Task>) => void }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === today);

  if (todayTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
        <Calendar size={48} className="text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium text-lg">Nenhuma tarefa para hoje. Gere um novo plano!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todayTasks.map((task, idx) => (
        <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-6 shadow-sm">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
            {idx + 1}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800">{task.subjectName}</h4>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Timer size={14} /> {task.durationMinutes} min</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                task.status === 'SKIPPED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {task.status === 'COMPLETED' ? 'Concluído' : task.status === 'SKIPPED' ? 'Pulado' : 'Pendente'}
              </span>
            </div>
          </div>
          {task.status === 'PENDING' ? (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const acc = prompt("Qual foi seu percentual de acertos (0-100)?", "0");
                  updateTask(task.id, { status: 'COMPLETED', accuracy: Number(acc) || 0 });
                }}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <CheckCircle2 size={20} />
              </button>
              <button 
                onClick={() => updateTask(task.id, { status: 'SKIPPED' })}
                className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="text-right">
              {task.accuracy !== undefined && (
                <p className="text-xs font-medium text-slate-400">Aproveitamento: <span className="text-indigo-600 font-bold">{task.accuracy}%</span></p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Dashboard = ({ stats, advice, subjects, tasks }: { stats: Stats, advice: string, subjects: Subject[], tasks: Task[] }) => {
  const chartData = useMemo(() => {
    return subjects.map(s => {
      const subTasks = tasks.filter(t => t.subjectId === s.id);
      const completed = subTasks.filter(t => t.status === 'COMPLETED').length;
      return {
        name: s.name,
        total: subTasks.length,
        concluido: completed
      };
    });
  }, [subjects, tasks]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Execução Total</p>
          <p className="text-3xl font-extrabold text-slate-900">{stats.executionRate.toFixed(1)}%</p>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full" style={{ width: `${stats.executionRate}%` }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Aproveitamento Médio</p>
          <p className="text-3xl font-extrabold text-slate-900">{stats.accuracyRate.toFixed(1)}%</p>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${stats.accuracyRate}%` }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Cumprimento de Metas</p>
          <p className="text-3xl font-extrabold text-slate-900">{stats.goalFulfillment.toFixed(1)}%</p>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${stats.goalFulfillment}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" /> Tarefas por Matéria
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="concluido" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Concluído" />
                <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BrainCircuit size={24} className="text-indigo-400" /> Insight da Mentoria
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {advice || "Gerando novos insights baseados no seu histórico..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dailyHours, setDailyHours] = useState(4);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [advice, setAdvice] = useState('');

  const stats = useMemo((): Stats => {
    if (tasks.length === 0) return { executionRate: 0, accuracyRate: 0, goalFulfillment: 0 };
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
    const executionRate = (completedTasks.length / tasks.length) * 100;
    const totalAccuracy = completedTasks.reduce((acc, t) => acc + (t.accuracy || 0), 0);
    const accuracyRate = completedTasks.length > 0 ? totalAccuracy / completedTasks.length : 0;
    const goalFulfillment = Math.min(100, (executionRate * 0.7) + (accuracyRate * 0.3));
    return { executionRate, accuracyRate, goalFulfillment };
  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      getMentorshipAdvice(stats, subjects, tasks).then(text => setAdvice(text));
    }
  }, [tasks.length, stats, subjects]);

  const generatePlan = (hoursToUse: number = dailyHours, subsToUse: Subject[] = subjects) => {
    if (subsToUse.length === 0) return;

    const newTasks: Task[] = [];
    const blockDuration = 45;
    const blocksPerDay = Math.floor((hoursToUse * 60) / blockDuration);
    
    const subjectScores = subsToUse.map(s => ({
      id: s.id,
      name: s.name,
      score: (s.weight * s.difficulty * s.incidence)
    }));

    const totalScore = subjectScores.reduce((acc, s) => acc + s.score, 0);
    const startDate = new Date();

    for (let d = 0; d < 7; d++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + d);
      const dayStr = currentDay.toISOString().split('T')[0];

      for (let b = 0; b < blocksPerDay; b++) {
        let random = Math.random() * totalScore;
        let selectedSubject = subjectScores[0];
        
        for (const s of subjectScores) {
          random -= s.score;
          if (random <= 0) {
            selectedSubject = s;
            break;
          }
        }

        newTasks.push({
          id: Math.random().toString(36).substr(2, 9),
          subjectId: selectedSubject.id,
          subjectName: selectedSubject.name,
          durationMinutes: blockDuration,
          status: 'PENDING',
          date: dayStr
        });
      }
    }

    setTasks(newTasks);
    setActiveTab('tasks');
  };

  const handleOnboardingComplete = (hours: number, subs: Subject[]) => {
    setDailyHours(hours);
    setSubjects(subs);
    generatePlan(hours, subs);
    setIsSetupComplete(true);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  if (!isSetupComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 max-w-6xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 capitalize">
              {activeTab === 'dashboard' ? 'Visão Geral' : 
               activeTab === 'tasks' ? 'Ciclo de Hoje' : 
               activeTab === 'subjects' ? 'Minhas Matérias' : 'Calendário Semanal'}
            </h2>
            <p className="text-slate-500 font-medium">Mentorando seu caminho até a aprovação.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
               <span className="text-sm text-slate-500">Horas Diárias:</span>
               <input 
                type="number" 
                value={dailyHours} 
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-12 font-bold text-indigo-600 outline-none"
               />
             </div>
             <button 
              onClick={() => generatePlan()}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all font-bold shadow-lg flex items-center gap-2"
             >
              Gerar Novo Ciclo
             </button>
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard stats={stats} advice={advice} subjects={subjects} tasks={tasks} />}
        {activeTab === 'subjects' && <SubjectManager subjects={subjects} setSubjects={setSubjects} />}
        {activeTab === 'tasks' && <DailyTasks tasks={tasks} updateTask={updateTask} />}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
             <Calendar size={64} className="text-slate-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-800">Visualização de Calendário</h3>
             <p className="text-slate-500 mb-6">Visualização semanal de produtividade.</p>
             <div className="grid grid-cols-7 gap-2">
               {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                 <div key={i} className="aspect-square rounded-lg bg-slate-50 flex items-center justify-center font-bold text-slate-400 uppercase text-xs">
                   {day}
                 </div>
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
