"use client";

import CopyButton from './CopyButton';
import { motion } from 'framer-motion';
import { Palette, Type, AlignHorizontalJustifyCenter, MousePointerSquareDashed, Check, AlertTriangle, Lightbulb } from 'lucide-react';

interface ReportViewProps {
  analysis: any;
  scoreColor: string;
}

const issueIcons: { [key: string]: React.ReactNode } = {
  'Typography': <Type size={20} className="text-indigo-400" />,
  'Element Alignment': <AlignHorizontalJustifyCenter size={20} className="text-sky-400" />,
  'Color Scheme': <Palette size={20} className="text-rose-400" />,
  'Whitespace Usage': <MousePointerSquareDashed size={20} className="text-teal-400" />,
  'Image Quality': <AlertTriangle size={20} className="text-amber-400" />,
  'default': <AlertTriangle size={20} className="text-slate-500" />
};

const ReportView = ({ analysis, scoreColor }: ReportViewProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="mt-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-slate-800/50 border border-slate-700/50 shadow-2xl shadow-slate-950/50 rounded-2xl p-8"
        variants={itemVariants}
      >
        <h2 className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Overall Design Score</h2>
        <div className="text-center mb-8">
          <div className={`text-7xl font-bold ${scoreColor}`}>{analysis.score}</div>
          <div className="w-full bg-slate-700 rounded-full h-3 mt-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${analysis.score}%` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-3">
              <AlertTriangle className="text-amber-400" />
              Detected Issues
            </h3>
            <div className="space-y-3">
              {analysis.issues?.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-start gap-4 transition-all hover:border-slate-600 hover:bg-slate-800/80"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 mt-1">{issueIcons[item.type] || issueIcons['default']}</div>
                  <div>
                    <h4 className="font-semibold text-slate-200">{item.type}</h4>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-3">
              <Lightbulb className="text-emerald-400" />
              Actionable Recommendations
            </h3>
            <div className="space-y-3">
              {analysis.recommendations?.map((rec: any, index: number) => (
                <motion.div
                  key={index}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-start gap-4 transition-all hover:border-slate-600 hover:bg-slate-800/80"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Check size={20} className="text-emerald-400" />
                  </div>
                  <p className="flex-grow text-slate-300 text-sm">{rec.recommendation}</p>
                  <CopyButton textToCopy={rec.recommendation} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportView;
