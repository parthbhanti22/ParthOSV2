export const RESUME_DATA = {
  name: "Parth Bhanti",
  contact: {
    email: "parth.bhanti@email.com",
    phone: "+91 6375237016",
    location: "Sikar, Rajasthan",
    links: [
      { name: "LinkedIn", url: "https://linkedin.com/in/parth-bhanti" },
      { name: "GitHub", url: "https://github.com/Parth-Bhanti" },
      { name: "Portfolio", url: "#" },
    ],
  },
  education: [
    {
      institution: "VIT Bhopal University",
      degree: "Bachelor of Technology, Computer Science",
      duration: "Sept 2023 - Present",
      details: "Cumulative GPA: 9.28",
    },
    {
      institution: "Goenka Public School",
      degree: "High School & Intermediate",
      duration: "Apr 2011 - June 2023",
      details: "Intermediate (12th): 93.6%, High School (10th): 96.4%",
    },
  ],
  projects: [
    {
      title: "ExoVate - An Interactive Exoplanet Explorer",
      description: "An interactive web platform that brings the science of exoplanet discovery to your fingertips. Leverages a machine learning model to classify exoplanet candidates from NASA's Kepler mission data.",
      link: "https://exovate-exoexplorer.vercel.app/",
      tags: ["Next.js", "TypeScript", "Machine Learning", "Scikit-learn", "Vercel"],
    },
    {
      title: "Auto Scaling EC2 Demo",
      description: "A demonstration of auto-scaling AWS EC2 instances under a simulated high-traffic (DDoS) load, featuring interactive live monitoring of the results.",
      link: "https://auto-scaling-demo.vercel.app/",
      tags: ["AWS", "EC2", "Auto Scaling", "DDoS Simulation", "Monitoring"],
    },
    {
        title: "Hydra - Phishing Defense + Autoscaling Demo",
        description: "A local demo showcasing phishing defense strategies combined with a Kubernetes Horizontal Pod Autoscaler (HPA) demo using a controlled load test with k6.",
        link: "https://github.com/parthbhanti22/hydra-demo",
        tags: ["Kubernetes", "HPA", "k6", "Docker", "Load Testing"],
    },
    {
      title: "Household Energy Efficiency Prediction Model",
      description: "Developed a machine learning model to forecast household energy efficiency, contributing to sustainable technology solutions with Mean Squared Error of 62.490.",
      link: "#",
      tags: ["Machine Learning", "Python", "Scikit-learn"],
    },
    {
      title: "Gravity Physics Simulation",
      description: "Engineered an interactive simulation to represent Gravity and Collision in Physics using OpenGL in C++. Working on interactively integrating non-Newtonian gravity using space time fabric.",
      link: "#",
      tags: ["C++", "OpenGL", "Physics Simulation"],
    },
    {
      title: "Celestia Dynamics: Physics Simulation Library",
      description: "A live and functional Physics Simulation Library for Students. Stack: Node.js, Express.js, MongoDB, HTML, CSS, JavaScript.",
      link: "https://celestia-dynamics.vercel.app/",
      tags: ["Node.js", "Express", "MongoDB", "Full Stack"],
    },
    {
      title: "Micro Small and Medium Enterprise Development",
      description: "Contributed in a 5-member team to build a full-stack application to support MSMEs. Consists of a website, a mobile app and 4 fully functional Machine Learning Models to allow users to analyze their sales and products using AI.",
      link: "#",
      tags: ["Full Stack", "Machine Learning", "Team Project"],
    },
    {
      title: "Multi Agent Rescue Simulation",
      description: "Full Stack Project as a 5-member team with website and mobile app to Aid and Rescue in survival operations using Reinforcement Learning in a multiple agent system. Uses React.js, Node.js, Flutter, Google Cloud Platform.",
      link: "#",
      tags: ["React.js", "Node.js", "Flutter", "Reinforcement Learning"],
    },
  ],
  roles: [
    {
      company: "Google Developer Groups – On Campus",
      title: "Co-Lead for all the Non-Technical Domains",
      duration: "Dec 2023 - July 2025",
      points: [
        "Managed 4 major domains of the GDG Community.",
        "Conducted several informative webinars for web and android development.",
        "Organized a college fest event called Google Olympics, managing 35 teams (140 participants).",
      ],
    },
    {
      company: "IBM",
      title: "Project Based Experiential Learning Intern",
      duration: "July 2025 - Sept 2025",
      points: [
        "Received training for technical knowledge in Artificial Intelligence by IBM.",
        "Working on Recommendation Language Models using IBM's Watson Assistant (Cloud Service).",
      ],
      link: "#",
    },
  ],
  skills: {
    Programming: ["C/C++", "Go", "Java"],
    Frontend: ["HTML5", "CSS", "JavaScript", "Flutter", "React.js"],
    Backend: ["MongoDB", "MariaDB", "MySQL", "Docker", "Debian CLI", "Express.js", "Node.js"],
    "Hosting and Cloud": ["Amazon Web Services", "IBM Watson", "Debian"],
    Libraries: ["Keras", "TensorFlow", "NumPy", "Matplotlib", "Scikit Learn", "Pygame", "OpenGL"],
  },
  certifications: [
    { title: "Introduction to Machine Learning", institution: "Indian Institute of Technology, Madras", link: "#" },
    { title: "IBM Machine Learning with Python", institution: "IBM", link: "#" },
    { title: "IBM Deep Learning and Artificial Neural Networks Using Keras", institution: "IBM", link: "#" },
  ],
};
