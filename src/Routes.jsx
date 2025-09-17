import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DataManagement from './pages/data-management';
import LoginPage from './pages/login';
import TimetableGeneration from './pages/timetable-generation';
import FacultyManagement from './pages/faculty-management';
import TimetableView from './pages/timetable-view';
import CurriculumManagement from './pages/curriculum-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CurriculumManagement />} />
        <Route path="/data-management" element={<DataManagement />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/timetable-generation" element={<TimetableGeneration />} />
        <Route path="/faculty-management" element={<FacultyManagement />} />
        <Route path="/timetable-view" element={<TimetableView />} />
        <Route path="/curriculum-management" element={<CurriculumManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
