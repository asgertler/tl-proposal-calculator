import type { Recipe } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const recipes: Recipe[] = [
  {
    id: 'app-design',
    name: 'App Design Recipe',
    description: 'A complete recipe for designing a mobile or web application from user research to hi-fidelity mockups.',
    tasks: [
      {
        id: uuidv4(),
        name: 'Project Management',
        hours: 50
      },
      {
        id: uuidv4(),
        name: 'Conduct User Interviews',
        hours: 12
      },
      {
        id: uuidv4(),
        name: 'Develop Insights and Findings',
        hours: 10
      },
      {
        id: uuidv4(),
        name: 'Define Concepts and Wireframes',
        hours: 15
      },
      {
        id: uuidv4(),
        name: 'Conduct User Testing',
        hours: 12
      },
      {
        id: uuidv4(),
        name: 'Develop Hi-Fidelity Mockups',
        hours: 20
      },
      {
        id: uuidv4(),
        name: 'Provide Development Documentation',
        hours: 8
      }
    ]
  },
  {
    id: 'strategy-map',
    name: 'Strategy Map Recipe',
    description: 'A comprehensive recipe for developing a strategic map from research to final deliverable.',
    tasks: [
      {
        id: uuidv4(),
        name: 'Project Management',
        hours: 50
      },
      {
        id: uuidv4(),
        name: 'Kick Off',
        hours: 7
      },
      {
        id: uuidv4(),
        name: 'Develop Framing Questions',
        hours: 4
      },
      {
        id: uuidv4(),
        name: 'Review Client-provided Materials',
        hours: 40
      },
      {
        id: uuidv4(),
        name: 'Conduct Discovery Session',
        hours: 4
      },
      {
        id: uuidv4(),
        name: 'Complete Research Synthesis',
        hours: 60
      },
      {
        id: uuidv4(),
        name: 'Develop Finding Documentation',
        hours: 10
      },
      {
        id: uuidv4(),
        name: 'Present Findings',
        hours: 2
      },
      {
        id: uuidv4(),
        name: 'Develop Creative Brief',
        hours: 5
      },
      {
        id: uuidv4(),
        name: 'Develop Low-fi Map Wireframe',
        hours: 10
      },
      {
        id: uuidv4(),
        name: 'Refine Content & Vision',
        hours: 20
      },
      {
        id: uuidv4(),
        name: 'Develop Mid-fi Map Wireframe',
        hours: 40
      },
      {
        id: uuidv4(),
        name: 'Develop High-fi Map Wireframe',
        hours: 20
      },
      {
        id: uuidv4(),
        name: 'Conduct Final Client Hand-off',
        hours: 6
      }
    ]
  },
  {
    id: 'design-system',
    name: 'Design System Development',
    description: 'A comprehensive recipe for creating a design system from scratch, including documentation and component library.',
    tasks: [
      {
        id: uuidv4(),
        name: 'Project Management',
        hours: 50
      },
      {
        id: uuidv4(),
        name: 'Stakeholder Interviews',
        hours: 10
      },
      {
        id: uuidv4(),
        name: 'Competitive Analysis',
        hours: 12
      },
      {
        id: uuidv4(),
        name: 'Design System Development',
        hours: 24
      },
      {
        id: uuidv4(),
        name: 'Component Documentation',
        hours: 16
      },
      {
        id: uuidv4(),
        name: 'Accessibility Audit',
        hours: 8
      },
      {
        id: uuidv4(),
        name: 'User Testing Sessions',
        hours: 16
      }
    ]
  }
];