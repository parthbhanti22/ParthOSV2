
import React from 'react';
import { RESUME_DATA } from '../../data';

const Projects: React.FC = () => {
  return (
    <div className="p-1 h-full flex flex-col bg-white">
        <div className="p-2 border-b text-gray-600 text-sm">File &gt; Edit &gt; View &gt; Favorites &gt; Tools &gt; Help</div>
        <div className="flex-grow overflow-y-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Projects & Responsibilities</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-blue-700 mb-2">Projects</h3>
                    {RESUME_DATA.projects.map((project, index) => (
                        <div key={index} className="mb-4 p-3 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-800">{project.title}</h4>
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                    Link
                                </a>
                            </div>
                            <p className="text-sm text-gray-600 my-1">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-blue-700 mb-2">Roles & Responsibilities</h3>
                    {RESUME_DATA.roles.map((role, index) => (
                        <div key={index} className="mb-4 p-3 border rounded-lg">
                            <h4 className="font-bold text-gray-800">{role.title} at {role.company}</h4>
                            <p className="text-xs text-gray-500 mb-2">{role.duration}</p>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {role.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Projects;
