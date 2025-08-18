"use client";

import CopyButton from './CopyButton';
import { motion } from 'framer-motion';
import { Palette, Type, AlignHorizontalJustifyCenter, MousePointerSquareDashed, Check, AlertTriangle, Lightbulb } from 'lucide-react';

const issueIcons = {
  'Typography': <Type size={20} className="icon-typography" />,
  'Element Alignment': <AlignHorizontalJustifyCenter size={20} className="icon-alignment" />,
  'Color Scheme': <Palette size={20} className="icon-color-scheme" />,
  'Whitespace Usage': <MousePointerSquareDashed size={20} className="icon-whitespace" />,
  'Image Quality': <AlertTriangle size={20} className="icon-alert" />,
  'default': <AlertTriangle size={20} className="icon-default" />
};

const ReportView = ({ analysis, scoreColor }) => {
  // First normalize score to be out of 100
  const normalizedScore = analysis?.score ? Math.min(Math.max(analysis.score, 0), 100) : 0;

  // Then generate recommendations based on issues
  const recommendations = analysis?.issues?.map((issue) => {
    return {
      recommendation: getRecommendation(issue.type, issue.description)
    };
  }) || [];

  // Function to generate recommendations from issues
  function getRecommendation(type, description) {
    switch(type) {
      case 'Typography':
        return `Consider using a more legible font with better contrast against the background. ${description}`;
      case 'Element Alignment':
        return `Improve alignment of elements using a grid system or flexbox. ${description}`;
      case 'Color Scheme':
        return `Adjust color combinations to improve accessibility and visual harmony. ${description}`;
      case 'Whitespace Usage':
        return `Increase whitespace between elements to improve readability. ${description}`;
      case 'Image Quality':
        return `Use higher resolution images for better visual quality. ${description}`;
      default:
        return `Improve this aspect of your design: ${description}`;
    }
  }

  // Define proper TypeScript types for the variants
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
        className="report-container glass-effect"
        variants={itemVariants}
      >
        <h2 className="text-center score-heading mb-2">Overall Design Score</h2>
        <div className="text-center mb-8">
          <div className={`overall-score ${scoreColor}`}>{normalizedScore}/100</div>
          <div className="score-bar-background mt-4">
            <motion.div
              className="score-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${normalizedScore}%` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="section-heading">
              <AlertTriangle className="icon-alert" />
              Detected Issues ({analysis?.issues?.length || 0})
            </h3>
            <div className="space-y-3">
              {analysis?.issues?.map((item, index) => (
                <motion.div
                  key={index}
                  className="issue-item"
                  variants={itemVariants}
                >
                  <div className="issue-icon mt-1">{issueIcons[item.type] || issueIcons['default']}</div>
                  <div>
                    <h4 className="issue-title">{item.type}</h4>
                    <p className="issue-description">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="section-heading">
              <Lightbulb className="icon-lightbulb" />
              Actionable Recommendations ({recommendations.length})
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  className="recommendation-item"
                  variants={itemVariants}
                >
                  <div className="recommendation-icon mt-1">
                    <Check size={20} className="icon-check" />
                  </div>
                  <p className="flex-grow recommendation-text">{rec.recommendation}</p>
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
