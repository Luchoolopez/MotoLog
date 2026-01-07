import { Routes, Route } from 'react-router-dom';
import { GaragePage } from '../pages/GaragePage';
import { MainLayout } from '../layout/MainLayout';
import { MotoDashboard } from '../pages/MotoDashboard';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import WarehousePage from '../pages/WarehousePage';

export function AppRouter() {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route element={<MainLayout />}>
                <Route path='/' element={
                    <ProtectedRoute>
                        <GaragePage />
                    </ProtectedRoute>
                } />
                <Route path='/motos/:id' element={
                    <ProtectedRoute>
                        <MotoDashboard />
                    </ProtectedRoute>
                } />
                <Route path='/warehouse' element={
                    <ProtectedRoute>
                        <WarehousePage />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    )
}