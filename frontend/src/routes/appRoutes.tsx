import { Routes, Route } from 'react-router-dom';
import { GaragePage } from '../pages/GaragePage';
import { MainLayout } from '../layout/MainLayout';
import { MotoDashboard } from '../pages/MotoDashboard';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import WarehousePage from '../pages/WarehousePage';
import { ManagementPage } from '../pages/ManagementPage';
import PatentePage from '../pages/PatentePage';
import SeguroPage from '../pages/SeguroPage';
import VTVPage from '../pages/VTVPage';
import FinesPage from '../pages/FinesPage';


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
                <Route path='/management' element={
                    <ProtectedRoute>
                        <ManagementPage />
                    </ProtectedRoute>
                } />
                <Route path='/management/patentes' element={
                    <ProtectedRoute>
                        <PatentePage />
                    </ProtectedRoute>
                } />
                <Route path='/management/seguros' element={
                    <ProtectedRoute>
                        <SeguroPage />
                    </ProtectedRoute>
                } />
                <Route path='/management/vtv' element={
                    <ProtectedRoute>
                        <VTVPage />
                    </ProtectedRoute>
                } />
                <Route path='/management/fines' element={
                    <ProtectedRoute>
                        <FinesPage />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    )
}
