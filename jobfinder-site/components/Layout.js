import Header from "./Header";

export default function Layout({children}) {
    return (
    <div className="dark:bg-slate-900 min-h-screen">
        <header>
            <Header />
        </header>
        <main className="container mx-auto">
        {children}
        </main>
    </div>
    );
}
