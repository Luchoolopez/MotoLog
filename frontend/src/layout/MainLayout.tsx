import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export const MainLayout:React.FC = () => {
    return(
        <div className="d-flex flex-column min-vh-100">
            <Header/>
            <main className="flex-grow-1">
                <Outlet/>
            </main>
        </div>
    )
}