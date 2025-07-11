import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import VivaQuestionsClient from './VivaQuestionsClient';
import branchSubjectsData from '@/data/branch-subjects.json';
import PageTracker from '@/components/PageTracker';
import SecurityProtection from '@/components/SecurityProtection';

interface VivaQuestionsPageProps {
  params: Promise<{
    year: string;
    semester: string;
    branch: string;
    subjectName: string;
  }>;
}

// Fetch viva questions content from MongoDB based on URL parameters
async function fetchVivaQuestionsContent(year: string, semester: string, branch: string, subject: string) {
  try {
    // For FE (First Year Engineering), use 'FE' as branch regardless of URL branch parameter
    const actualBranch = year === 'FE' ? 'FE' : branch;
    
    // Import MongoDB client for direct database access during SSR
    const clientPromise = (await import('@/lib/mongodb')).default;
    const client = await clientPromise;
    const db = client.db('ziora');
    const collection = db.collection('academic_content');

    // Create the query path
    const queryPath = `${year}.sem-${semester}.${actualBranch}.${subject}.viva-questions`;
    
    // Find the document and get the specific content
    const result = await collection.findOne({}, { projection: { [queryPath]: 1 } });
    
    // Extract the nested content
    const content = result && getNestedValue(result, queryPath.split('.'));
    
         return content || {
       questions: [
         {
           id: "v1",
           question: "What are the fundamental concepts of this subject?",
           answer: "The fundamental concepts include basic principles and theoretical foundations that form the core of this subject.",
           category: "Fundamentals",
           difficulty: "Basic"
         },
         {
           id: "v2",
           question: "Explain the practical applications of the concepts.",
           answer: "The concepts find applications in various real-world scenarios and industry practices.",
           category: "Applications",
           difficulty: "Intermediate"
         }
       ],
       categories: ["Fundamentals", "Applications", "Theory", "Practical"]
     };
  } catch (error) {
    console.error('Error fetching viva questions content:', error);
    // Return default structure if fetch fails
    return {
      questions: [
  {
    id: '1',
    question: "What is Object-Oriented Programming?",
    answer: "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects, which contain data (attributes) and code (methods). The main principles of OOP are encapsulation, inheritance, polymorphism, and abstraction.",
    category: "Fundamentals",
    difficulty: "Basic"
  },
  {
    id: '2',
    question: "Explain the difference between a class and an object.",
    answer: "A class is a blueprint or template that defines the structure and behavior of objects. An object is an instance of a class that has actual values for the attributes defined in the class. For example, 'Car' is a class, while 'my red Toyota' is an object of the Car class.",
    category: "OOP Concepts",
    difficulty: "Basic"
  },
  {
    id: '3',
    question: "What is encapsulation and why is it important?",
    answer: "Encapsulation is the bundling of data and methods that operate on that data within a single unit (class). It restricts direct access to some of the object's components, which is a means of preventing accidental interference and misuse. It provides data hiding and increases security.",
    category: "OOP Concepts",
    difficulty: "Intermediate"
  },
  {
    id: '4',
    question: "Explain inheritance with an example.",
    answer: "Inheritance is a mechanism where a new class (child/derived class) inherits properties and methods from an existing class (parent/base class). For example, a 'Student' class can inherit from a 'Person' class, gaining access to name, age properties while adding student-specific properties like studentID, course.",
    category: "OOP Concepts",
    difficulty: "Intermediate"
  },
  {
    id: '5',
    question: "What is polymorphism? Give an example.",
    answer: "Polymorphism allows objects of different types to be treated as objects of a common base type. It enables a single interface to represent different underlying forms. For example, a 'draw()' method can behave differently for Circle, Rectangle, and Triangle objects, but all can be called using the same interface.",
    category: "OOP Concepts",
    difficulty: "Intermediate"
        }
      ],
      categories: ['Fundamentals', 'OOP Concepts', 'Advanced Concepts', 'Design Patterns', 'Memory Management', 'Error Handling']
    };
  }
}

// Helper function to get nested value from object
function getNestedValue(obj: any, path: string[]): any {
  return path.reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

export default async function VivaQuestionsPage({ params }: VivaQuestionsPageProps) {
  const { year, semester, branch, subjectName } = await params;

  // Get subject info from branch subjects data
  const { branches } = branchSubjectsData;
  const branchKey = year === 'FE' ? 'FE' : branch;
  const selectedBranchData = (branches as any)[branchKey];
  const semesterSubjects = selectedBranchData?.semesters[semester] || [];
  const subject = semesterSubjects.find((s: any) => s.id === subjectName) || {
    id: subjectName,
    name: subjectName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Study materials for ${subjectName}`,
    icon: '📚',
    code: 'N/A',
    credits: 3
  };

  // Fetch dynamic viva questions content based on URL parameters
  const vivaData = await fetchVivaQuestionsContent(year, semester, branch, subjectName);
  
  // Ensure proper data structure with defaults
  const safeVivaData = {
    questions: vivaData?.questions || [],
    categories: vivaData?.categories || ['Fundamentals', 'OOP Concepts', 'Advanced Concepts']
  };

  const backUrl = `/select/${year}/${semester}/${branch}/subjects/subject/${subjectName}`;

  return (
    <SecurityProtection 
      pageName={`Viva Questions - ${subject.name}`}
      pagePath={`/select/${year}/${semester}/${branch}/subjects/subject/${subjectName}/viva-questions`}
      strictMode={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 dark:from-black dark:to-gray-950">
        <PageTracker pageName={`Viva Questions - ${subject.name}`} />
        {/* Breadcrumb */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 bg-card dark:bg-[oklch(0.205_0_0)] border-b border-border">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/select" className="hover:text-foreground transition-colors font-medium">Academic Years</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link href={`/select/${year}/${semester}/${branch}/subjects`} className="hover:text-foreground transition-colors font-medium">Subjects</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link href={backUrl} className="hover:text-foreground transition-colors font-medium">
                {subject.name}
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-semibold">Viva Questions</span>
            </nav>
          </div>
        </div>

        <VivaQuestionsClient 
          subject={subject}
          vivaData={safeVivaData}
          subjectName={subjectName}
          year={year}
          semester={semester}
          branch={branch}
        />
      </div>
    </SecurityProtection>
  );
}
