import { Routes, Route } from 'react-router-dom';
import { GaragePage } from '../pages/GaragePage';
import { MainLayout } from '../layout/MainLayout';

export function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path='/' element={<GaragePage />} />
            </Route>
        </Routes>
    )
}