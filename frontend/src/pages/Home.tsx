import { PlanList } from "../components/PlanList"

export const Home: React.FC = () => {
    return (
        <div>
            <nav className="navbar navbar-dark bg-dark mb-4">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">MotoLog 🏍️</span>
                </div>
            </nav>

            <PlanList />
        </div>
    )
}