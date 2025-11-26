import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ScoreData {
  questionId: number;
  questionTheme: string;
  indexName: string;
  scoreType: string;
  scoreMeasure: string;
  userScore: number;
  maxScore: number;
  percentageScore: number;
  selectedOption: string;
  insight: string;
  recommendation: string;
  archetype: string;
  microActions: {
    hours24: string;
    days7: string;
    days30: string;
  };
}

interface DigitalTwinResultsProps {
  assessmentId: string;
  onClose?: () => void;
}

const DigitalTwinResults: React.FC<DigitalTwinResultsProps> = ({ assessmentId, onClose }) => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const API_URL = `${process.env.REACT_APP_API_URL}/api`;

  useEffect(() => {
    fetchResults();
  }, [assessmentId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/digitaltwin/individual/${assessmentId}/scores`);
      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load assessment results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-purple-500"></div>
          <p className="mt-6 text-slate-300 font-semibold text-lg">Generating your Digital Twin Career Report...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-400 font-semibold text-lg">Unable to load results. Please try again.</p>
        </div>
      </div>
    );
  }

  const { scores, summaryMetrics, actionPlan } = results;
  const avgScore = summaryMetrics.averageScore;

  // Color coding based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 60) return { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' };
    if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' };
    return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-200' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Developing';
    return 'Focus Area';
  };

  // Unique color palette for each of the 10 questions
  const questionColors: Record<number, { bg: string; text: string; light: string; border: string; accent: string }> = {
    1: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-300', accent: 'from-purple-500 to-purple-600' },
    2: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-300', accent: 'from-blue-500 to-blue-600' },
    3: { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-300', accent: 'from-indigo-500 to-indigo-600' },
    4: { bg: 'bg-pink-600', text: 'text-pink-600', light: 'bg-pink-50', border: 'border-pink-300', accent: 'from-pink-500 to-pink-600' },
    5: { bg: 'bg-rose-600', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-300', accent: 'from-rose-500 to-rose-600' },
    6: { bg: 'bg-cyan-600', text: 'text-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-300', accent: 'from-cyan-500 to-cyan-600' },
    7: { bg: 'bg-teal-600', text: 'text-teal-600', light: 'bg-teal-50', border: 'border-teal-300', accent: 'from-teal-500 to-teal-600' },
    8: { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-300', accent: 'from-emerald-500 to-emerald-600' },
    9: { bg: 'bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-300', accent: 'from-amber-500 to-amber-600' },
    10: { bg: 'bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-300', accent: 'from-orange-500 to-orange-600' },
  };

  const getQuestionColor = (questionId: number) => questionColors[questionId] || questionColors[1];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-8">
      <div className="w-full">
        {/* Professional Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Digital Twin Career Assessment</h1>
          <p className="text-xl text-slate-300 mb-8">Your Comprehensive Career Readiness Report</p>

          {/* Overall Score Badge */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-slate-800 rounded-full p-8 border border-slate-700">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {avgScore}
                </div>
                <div className="text-slate-300 text-sm font-semibold mt-2">Overall Career Readiness</div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4"
            >
              <div className="text-slate-400 text-sm font-semibold mb-1">PRIMARY ARCHETYPE</div>
              <div className="text-2xl font-bold text-purple-400">{summaryMetrics.primaryArchetype}</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4"
            >
              <div className="text-slate-400 text-sm font-semibold mb-1">ASSESSMENT DATE</div>
              <div className="text-2xl font-bold text-blue-400">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </motion.div>
          </div>

          {/* Career Insight */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-16">
            <p className="text-slate-100 text-lg leading-relaxed">{summaryMetrics.overallInsight}</p>
          </div>
        </motion.div>

        {/* Bar Chart - Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Score Overview - Visual Report</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mb-8"></div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={scores.map((score: ScoreData) => ({
                  name: `Q${score.questionId}`,
                  score: score.userScore,
                  theme: score.questionTheme,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                  label={{ value: 'Score (0-100)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value}/100`,
                    props.payload.theme,
                  ]}
                  labelFormatter={(label: any) => `Question ${label.slice(1)}`}
                  cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                />
                <Bar dataKey="score" fill="#a855f7" radius={[8, 8, 0, 0]} animationDuration={1000}>
                  {scores.map((score: ScoreData, index: number) => {
                    let color = '#10b981'; // emerald
                    if (score.userScore < 80) color = '#06b6d4'; // cyan
                    if (score.userScore < 60) color = '#f59e0b'; // amber
                    if (score.userScore < 40) color = '#ef4444'; // red
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-3">
              <div className="w-4 h-4 bg-emerald-500 rounded"></div>
              <span className="text-sm text-slate-300">80+ Excellent</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-3">
              <div className="w-4 h-4 bg-cyan-500 rounded"></div>
              <span className="text-sm text-slate-300">60-79 Strong</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-3">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span className="text-sm text-slate-300">40-59 Developing</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-slate-300">&lt;40 Focus Area</span>
            </div>
          </div>
        </motion.div>

        {/* Score Summary Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Score Summary Table</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mb-8"></div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 bg-slate-900 p-4 border-b border-slate-700 font-bold text-slate-300 text-sm">
              <div className="col-span-1 text-center">Q#</div>
              <div className="col-span-3">Theme & Index</div>
              <div className="col-span-2">Score Type</div>
              <div className="col-span-4 text-xs">What It Measures</div>
              <div className="col-span-1">Score</div>
              <div className="col-span-1">Status</div>
            </div>

            {/* Table Rows */}
            {scores.map((score: ScoreData) => {
              const colors = getScoreColor(score.userScore);
              return (
                <motion.div
                  key={score.questionId}
                  whileHover={{ backgroundColor: '#334155' }}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700 hover:bg-slate-700 transition-colors items-center"
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {score.questionId}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="font-semibold text-white text-sm">{score.questionTheme}</p>
                    <p className="text-xs text-slate-400 truncate">{score.indexName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-300 truncate">{score.scoreType}</p>
                  </div>
                  <div className="col-span-4">
                    <p className="text-xs text-slate-400 line-clamp-2">{score.scoreMeasure}</p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-white text-lg">{score.userScore}</span>
                      <span className="text-slate-400 text-xs">/100</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${colors.light} ${colors.text}`}>
                      {getScoreLabel(score.userScore)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Question Scores Report */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-2">Question-by-Question Score Analysis</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mb-8"></div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {scores.map((score: ScoreData, index: number) => {
              const colors = getScoreColor(score.userScore);
              const qColors = getQuestionColor(score.questionId);
              const isExpanded = expandedQuestion === score.questionId;

              return (
                <motion.div key={score.questionId} variants={item}>
                  <motion.div
                    onClick={() =>
                      setExpandedQuestion(isExpanded ? null : score.questionId)
                    }
                    className="cursor-pointer group"
                    whileHover={{ scale: 1.01 }}
                  >
                    {/* Score Card - Main Row */}
                    <div className={`relative bg-slate-800 border border-slate-700 hover:border-purple-500 rounded-lg p-6 transition-all duration-300 border-t-4 ${qColors.border}`}>
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${qColors.accent} rounded-t-lg`}></div>
                      <div className="flex items-center justify-between">
                        {/* Left: Question Number and Theme */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${qColors.accent} flex items-center justify-center`}>
                              <span className="text-white font-bold text-lg">Q{score.questionId}</span>
                            </div>
                            <div className="text-left">
                              <h3 className="text-xl font-bold text-white">{score.questionTheme}</h3>
                              <p className="text-sm text-slate-400">{score.indexName}</p>
                            </div>
                          </div>

                          {/* Measure */}
                          <p className="text-sm text-slate-300 italic ml-16">{score.scoreMeasure}</p>
                        </div>

                        {/* Right: Score and Badge */}
                        <div className="flex flex-col items-end gap-3 ml-4">
                          {/* Large Score Display */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">{score.userScore}</span>
                            <span className="text-slate-400 text-sm">/100</span>
                          </div>

                          {/* Score Type and Label */}
                          <div className="text-right">
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors.light} ${colors.text}`}>
                              {getScoreLabel(score.userScore)}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{score.scoreType}</p>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score.percentageScore}%` }}
                              transition={{ duration: 0.8, delay: index * 0.05 }}
                              className={`h-full ${colors.bg} rounded-full`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expand Indicator */}
                      <div className="mt-4 flex justify-center">
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-slate-400"
                        >
                          ▼
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: isExpanded ? 1 : 0,
                        height: isExpanded ? 'auto' : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-900 border border-t-0 border-slate-700 rounded-b-lg p-6 space-y-6">
                        {/* Archetype */}
                        <div>
                          <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wide mb-2">
                            Your Archetype
                          </h4>
                          <p className="text-slate-100 font-semibold text-lg">{score.archetype}</p>
                        </div>

                        {/* Insight */}
                        <div>
                          <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wide mb-2">
                            Key Insight
                          </h4>
                          <p className="text-slate-300 leading-relaxed">{score.insight}</p>
                        </div>

                        {/* Recommendation */}
                        <div>
                          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wide mb-2">
                            Recommendation
                          </h4>
                          <p className="text-slate-300 leading-relaxed">{score.recommendation}</p>
                        </div>

                        {/* Micro-Actions */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                          <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wide mb-4">
                            30-Day Action Plan
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-1">⚡ NEXT 24 HOURS</p>
                              <p className="text-slate-300 text-sm">{score.microActions.hours24}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-1">📅 NEXT 7 DAYS</p>
                              <p className="text-slate-300 text-sm">{score.microActions.days7}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-1">🎯 NEXT 30 DAYS</p>
                              <p className="text-slate-300 text-sm">{score.microActions.days30}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Personalized Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Your Personalized Action Plan</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Immediate */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">⚡ Immediate (24H)</h3>
              <ul className="space-y-2">
                {actionPlan.immediate.map((action: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-purple-400 flex-shrink-0">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Short-term */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">📅 Short-term (7D)</h3>
              <ul className="space-y-2">
                {actionPlan.shortTerm.map((action: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-blue-400 flex-shrink-0">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Long-term */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">🎯 Long-term (30D)</h3>
              <ul className="space-y-2">
                {actionPlan.longTerm.map((action: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-emerald-400 flex-shrink-0">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Score Distribution Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Score Distribution</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-emerald-900 bg-opacity-30 border border-emerald-700 rounded-lg p-4">
              <div className="text-emerald-400 font-bold text-2xl">
                {scores.filter((s: ScoreData) => s.userScore >= 80).length}
              </div>
              <p className="text-slate-300 text-sm mt-1">Excellent (80+)</p>
            </div>
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
              <div className="text-blue-400 font-bold text-2xl">
                {scores.filter((s: ScoreData) => s.userScore >= 60 && s.userScore < 80).length}
              </div>
              <p className="text-slate-300 text-sm mt-1">Strong (60-79)</p>
            </div>
            <div className="bg-amber-900 bg-opacity-30 border border-amber-700 rounded-lg p-4">
              <div className="text-amber-400 font-bold text-2xl">
                {scores.filter((s: ScoreData) => s.userScore >= 40 && s.userScore < 60).length}
              </div>
              <p className="text-slate-300 text-sm mt-1">Developing (40-59)</p>
            </div>
            <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4">
              <div className="text-red-400 font-bold text-2xl">
                {scores.filter((s: ScoreData) => s.userScore < 40).length}
              </div>
              <p className="text-slate-300 text-sm mt-1">Focus Area (&lt;40)</p>
            </div>
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center py-12 border-t border-slate-700"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              📥 Export Report
            </button>
            <button
              onClick={() => onClose?.()}
              className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-200"
            >
              ← Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalTwinResults;
