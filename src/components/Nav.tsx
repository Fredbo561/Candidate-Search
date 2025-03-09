const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  return (
      <nav className="nav-bar-personal">
        <ul className="nav-links-personal">
          <li className="nav-link-personal">
            <a href="/">Home</a>
          </li>
          <li className="nav-link-personal">
            <a href="/SavedCandidates">Potential Candidate</a>
          </li>
        </ul>
      </nav>
  )
};

export default Nav;