import React, { useState } from 'react';
import './SecurityScoreCalculator.css';  // We'll create this CSS file next

const SecurityScoreCalculator = () => {
  const [scores, setScores] = useState({
    communication: {
      base: 1,
      useOSSMessenger: false,
      selfHostMessenger: false,
      encryptFirstEmail: false,
    },
    contentSharing: {
      base: 1,
      useThirdPartyCloud: false,
      selfHostRepo: false,
    },
    development: {
      base: 1,
      useOSSIDE: false,
      selfHostDev: false,
    },
    runtime: {
      base: 1,
      useThirdPartyCloudRuntime: false,
      selfHostRuntime: false,
    },
    hardware: {
      base: 1,
      buildOwnHardware: false,
      useOSSHardware: false,
    }
  });

  const calculateScore = (category) => {
    let score = scores[category].base;
    switch(category) {
      case 'communication':
        if (!scores[category].useOSSMessenger) score -= 0.5;
        if (!scores[category].selfHostMessenger) score -= 0.1;
        if (!scores[category].encryptFirstEmail) score -= 0.5;
        break;
      case 'contentSharing':
        if (scores[category].useThirdPartyCloud) score -= 0.5;
        if (!scores[category].selfHostRepo) score -= 0.5;
        break;
      case 'development':
        if (!scores[category].useOSSIDE) score -= 0.25;
        if (!scores[category].selfHostDev) score -= 0.5;
        break;
      case 'runtime':
        if (scores[category].useThirdPartyCloudRuntime) score -= 0.5;
        if (!scores[category].selfHostRuntime) score -= 0.5;
        break;
      case 'hardware':
        if (!scores[category].buildOwnHardware) score -= 0.5;
        if (!scores[category].useOSSHardware) score -= 0.5;
        break;
      default:
        break;
    }
    return Math.max(0, score);
  };

  const totalScore = () => {
    return (
      calculateScore('communication') +
      calculateScore('contentSharing') +
      calculateScore('development') +
      calculateScore('runtime') +
      calculateScore('hardware')
    );
  };

  const getScoreColor = (score) => {
    if (score <= 1) return '#ff4444';  // red
    if (score <= 2) return '#ffa500';  // orange
    if (score <= 3) return '#ffdd00';  // yellow
    return '#4CAF50';  // green
  };

  const handleCheckboxChange = (category, field) => {
    setScores(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const ScoreCategory = ({ title, category, checks }) => (
    <div className="score-category">
      <h3 className="category-title">{title}</h3>
      <div className="checks">
        {checks.map(({ label, field }) => (
          <div key={field} className="check-item">
            <input
              type="checkbox"
              id={`${category}-${field}`}
              checked={scores[category][field]}
              onChange={() => handleCheckboxChange(category, field)}
            />
            <label htmlFor={`${category}-${field}`}>
              {label}
            </label>
          </div>
        ))}
      </div>
      <div className="category-score">
        Score: <span style={{ color: getScoreColor(calculateScore(category)) }}>
          {calculateScore(category).toFixed(2)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">IP Security Score Calculator</h2>
      <div className="categories">
        <ScoreCategory
          title="Communication Security"
          category="communication"
          checks={[
            { label: "Using OSS Messenger App", field: "useOSSMessenger" },
            { label: "Self-hosting OSS Messenger", field: "selfHostMessenger" },
            { label: "Using Encrypt-first Email", field: "encryptFirstEmail" }
          ]}
        />
        
        <ScoreCategory
          title="Content Sharing Security"
          category="contentSharing"
          checks={[
            { label: "Using 3rd Party Cloud Provider", field: "useThirdPartyCloud" },
            { label: "Self-hosting Code Repository", field: "selfHostRepo" }
          ]}
        />
        
        <ScoreCategory
          title="Development Systems Security"
          category="development"
          checks={[
            { label: "Using OSS IDE/Tools", field: "useOSSIDE" },
            { label: "Self-hosting Development Environment", field: "selfHostDev" }
          ]}
        />
        
        <ScoreCategory
          title="Runtime Systems Security"
          category="runtime"
          checks={[
            { label: "Using 3rd Party Cloud Provider", field: "useThirdPartyCloudRuntime" },
            { label: "Self-hosting Runtime Environment", field: "selfHostRuntime" }
          ]}
        />
        
        <ScoreCategory
          title="Hardware Security"
          category="hardware"
          checks={[
            { label: "Building Own Hardware", field: "buildOwnHardware" },
            { label: "Using OSS Hardware/OS", field: "useOSSHardware" }
          ]}
        />

        <div className="total-score">
          <h3>
            Total Security Score: {' '}
            <span style={{ color: getScoreColor(totalScore()) }}>
              {totalScore().toFixed(2)}
            </span>
            {' '} / 5.00
          </h3>
          <div className="score-legend">
            Score ranges: 
            <span style={{ color: '#ff4444' }}> ≤ 1: High Risk</span>
            <span style={{ color: '#ffa500' }}> ≤ 2: Moderate Risk</span>
            <span style={{ color: '#ffdd00' }}> ≤ 3: Low Risk</span>
            <span style={{ color: '#4CAF50' }}> ≥ 3: Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreCalculator;