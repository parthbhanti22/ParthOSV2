

import { useState, useCallback } from 'react';
import { RESUME_DATA } from '../data';

export interface FileSystemNode {
  type: 'file' | 'dir';
  content?: string;
  children?: { [key: string]: FileSystemNode };
}

const initialFileSystem: FileSystemNode = {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        parth: {
          type: 'dir',
          children: {
            Projects: {
              type: 'dir',
              children: {
                'exovate.txt': { type: 'file', content: `ExoVate: An interactive web platform that brings the science of exoplanet discovery to your fingertips. Link: ${RESUME_DATA.projects[0].link}` },
                'autoscaling-demo.txt': { type: 'file', content: `A demonstration of auto-scaling AWS EC2 instances under a simulated high-traffic (DDoS) load. Link: ${RESUME_DATA.projects[1].link}` },
              },
            },
            Documents: {
              type: 'dir',
              children: {
                'resume-summary.txt': {
                  type: 'file',
                  content: `Name: ${RESUME_DATA.name}\nEmail: ${RESUME_DATA.contact.email}\nSummary: A driven Computer Science student with a passion for Machine Learning, Cloud Computing, and Full-Stack Development.`
                },
              },
            },
            'welcome.txt': {
              type: 'file',
              content: "Welcome to Parth OS Terminal!\n\nThis is a simulated Linux-like terminal. You can navigate the file system, view files, and even interact with an AI.\n\nTo get started, type 'parth --help' to see a list of available commands.\n"
            }
          },
        },
      },
    },
  },
};

const resolvePath = (path: string, currentPath: string): string => {
  if (path.startsWith('/')) {
    return path;
  }
  const parts = path.split('/').filter(p => p);
  let currentParts = currentPath.split('/').filter(p => p);

  if (currentPath === '/') {
    currentParts = [];
  }

  for (const part of parts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      if (currentParts.length > 0) {
        currentParts.pop();
      }
    } else {
      currentParts.push(part);
    }
  }
  return '/' + currentParts.join('/');
};


export const useFileSystem = () => {
  const [fs, setFs] = useState<FileSystemNode>(initialFileSystem);
  const [currentPath, setCurrentPath] = useState('/home/parth');

  const getNode = useCallback((path: string): FileSystemNode | null => {
    const parts = path.split('/').filter(p => p);
    if(path === '/') return fs;
    let currentNode = fs;
    for (const part of parts) {
      if (currentNode.type === 'dir' && currentNode.children && currentNode.children[part]) {
        currentNode = currentNode.children[part];
      } else {
        return null;
      }
    }
    return currentNode;
  }, [fs]);
  
  const getParentNode = useCallback((path: string): { parent: FileSystemNode | null, itemName: string } => {
      const parts = path.split('/').filter(p => p);
      if(parts.length === 0) return { parent: null, itemName: '' };
      const itemName = parts.pop()!;
      const parentPath = '/' + parts.join('/');
      return { parent: getNode(parentPath), itemName };
  }, [getNode]);

  const ls = useCallback((path: string = '.'): string[] => {
    const resolved = resolvePath(path, currentPath);
    const node = getNode(resolved);
    if (node && node.type === 'dir' && node.children) {
      return Object.entries(node.children).map(([name, childNode]) => 
        childNode.type === 'dir' ? `${name}/` : name
      );
    }
    return [`ls: cannot access '${path}': No such file or directory`];
  }, [currentPath, getNode]);

  const cd = useCallback((path: string): string => {
    const homeResolvedPath = path === '~' ? '/home/parth' : path;
    const resolved = resolvePath(homeResolvedPath, currentPath);
    const node = getNode(resolved);
    if (node && node.type === 'dir') {
      setCurrentPath(resolved);
      return '';
    }
    return `cd: no such file or directory: ${path}`;
  }, [currentPath, getNode]);
  
  const cat = useCallback((path: string): string => {
      const resolved = resolvePath(path, currentPath);
      const node = getNode(resolved);
      if(node && node.type === 'file') {
          return node.content || '';
      }
      if(node && node.type === 'dir') {
        return `cat: ${path}: Is a directory`;
      }
      return `cat: ${path}: No such file or directory`;
  }, [currentPath, getNode]);
  
  const mkdir = useCallback((path: string): string => {
      const resolved = resolvePath(path, currentPath);
      const { parent, itemName } = getParentNode(resolved);
      if(parent && parent.type === 'dir' && parent.children && !parent.children[itemName]) {
          parent.children[itemName] = { type: 'dir', children: {} };
          setFs({...fs});
          return '';
      }
      if (parent?.children?.[itemName]) {
          return `mkdir: cannot create directory ‘${path}’: File exists`;
      }
      return `mkdir: cannot create directory ‘${path}’: No such file or directory`;
  }, [currentPath, fs, getParentNode]);

  const rm = useCallback((path: string, recursive: boolean = false): string => {
    const resolved = resolvePath(path, currentPath);
    if (['/', '/home', '/home/parth'].includes(resolved)) {
        return `rm: cannot remove '${path}': Permission denied`;
    }
    const { parent, itemName } = getParentNode(resolved);
    if (!parent || !parent.children || !parent.children[itemName]) {
        return `rm: cannot remove '${path}': No such file or directory`;
    }
    const nodeToRemove = parent.children[itemName];
    if (nodeToRemove.type === 'dir' && Object.keys(nodeToRemove.children || {}).length > 0 && !recursive) {
        return `rm: cannot remove '${path}': is a directory`;
    }
    delete parent.children[itemName];
    setFs({ ...fs });
    return '';
  }, [currentPath, fs, getParentNode]);

  const writeFile = useCallback((path: string, content: string): string => {
    const resolved = resolvePath(path, currentPath);
    const { parent, itemName } = getParentNode(resolved);
    const existingNode = getNode(resolved);

    if (existingNode && existingNode.type === 'dir') {
        return `Error: Cannot write to '${path}'. It is a directory.`;
    }

    if (parent && parent.type === 'dir' && parent.children) {
        parent.children[itemName] = { type: 'file', content };
        setFs({ ...fs });
        return ''; // Success
    }
    return `Error: Cannot create file in '${path}'. Invalid path.`;
  }, [currentPath, fs, getParentNode, getNode]);

  return { fs, currentPath, ls, cd, cat, mkdir, rm, writeFile, getNode };
};
