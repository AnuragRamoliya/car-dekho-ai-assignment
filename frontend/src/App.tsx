import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BrowsePage } from './pages/BrowsePage';
import { CarDetailPage } from './pages/CarDetailPage';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ShortlistPage } from './pages/ShortlistPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'recommendations', element: <RecommendationsPage /> },
      { path: 'browse', element: <BrowsePage /> },
      { path: 'cars/:id', element: <CarDetailPage /> },
      { path: 'shortlist', element: <ShortlistPage /> }
    ]
  }
]);

export const App = () => <RouterProvider router={router} />;
