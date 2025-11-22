
import React from 'react';
import { RESUME_DATA } from '../../data';
import { ICONS } from '../../constants';

const SkillCategory: React.FC<{ title: string; skills: string[] }> = ({ title, skills }) => (
  <div className="mb-3">
    <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
    <div className="flex flex-wrap gap-1">
      {skills.map(skill => (
        <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const AboutMe: React.FC = () => {
  return (
    <div className="p-2 h-full text-sm text-gray-800 flex">
      <div className="w-1/3 flex flex-col items-center justify-center p-4 border-r border-gray-300">
        <div className="w-24 h-24 text-blue-600">{ICONS.computer}</div>
        <h1 className="text-xl font-bold mt-2">{RESUME_DATA.name}</h1>
        <p className="text-xs text-gray-500">System Information</p>
      </div>
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2 border-b pb-1">Technical Skills</h2>
        {Object.entries(RESUME_DATA.skills).map(([category, skills]) => (
          <SkillCategory key={category} title={category} skills={skills} />
        ))}
        
        <h2 className="text-lg font-bold mt-4 mb-2 border-b pb-1">Education</h2>
        {RESUME_DATA.education.map((edu, index) => (
            <div key={index} className="mb-2">
                <p className="font-semibold">{edu.institution}</p>
                <p className="text-xs text-gray-600">{edu.degree}</p>
                <p className="text-xs text-gray-500">{edu.duration}</p>
                <p className="text-xs text-gray-500">{edu.details}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default AboutMe;
