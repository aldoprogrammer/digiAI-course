import React from 'react';

import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import CourseManagement from '@/components/features/ContentManagement/CourseManagement';

const CreatorStudioPage = () => {
  return (
    <LayoutDashboard title="Create Course" className="w-full">
      <CourseManagement />
    </LayoutDashboard>
  );
};

export default CreatorStudioPage;
