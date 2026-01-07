import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { ToastProvider } from "../context/ToastContext";

export const MainLayout: React.FC = () => {
    return (
        <ToastProvider>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1 d-flex flex-column">
                    <Outlet />
                </main>
            </div>
        </ToastProvider>
    )
}