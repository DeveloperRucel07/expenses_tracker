

const Header = () => {
  return (
    <header className="flex flex-row justify-between items-center h-[60px] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.15)] px-2 py-4">
        <h3 className="text-info text-extrabold text-3xl">Expense Track</h3>
        <nav className="">
            <ul className="flex flex-row gap-2">
            <ul className="flex flex-row gap-2">
                <li className="text-xl p-4 text-hover-primary">Home</li>
                <li className="text-xl p-4 cursor-pointer text-accent">Login</li>
            </ul>
                    
               
            </ul>
        </nav>
    </header>
  )
}

export default Header