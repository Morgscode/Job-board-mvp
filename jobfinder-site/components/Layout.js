import Header from "./Header";

export default function Layout({children}) {
    return (
    <div className="min-h-screen dark:bg-slate-900">
        <header>
            <Header />
        </header>
        <main className="container mx-auto">
        {children}
        </main>
    </div>
    );
}
