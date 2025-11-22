
import React from 'react';
import { RESUME_DATA } from '../../data';
import { ICONS } from '../../constants';

const Contact: React.FC = () => {
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 mb-4 text-blue-600">{ICONS.internet}</div>
      <h2 className="text-lg font-bold mb-2">{RESUME_DATA.name}</h2>
      <p className="text-sm text-gray-600 mb-1">
        <a href={`mailto:${RESUME_DATA.contact.email}`} className="hover:underline">{RESUME_DATA.contact.email}</a>
      </p>
      <p className="text-sm text-gray-600 mb-4">{RESUME_DATA.contact.phone}</p>
      <div className="flex space-x-4">
        {RESUME_DATA.contact.links.map(link => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
