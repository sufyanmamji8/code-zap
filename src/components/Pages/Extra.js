return (
  <>
    {collapseOpen && (
      <div 
        style={{ ...styles.mobileOverlay, display: collapseOpen ? 'block' : 'none' }} 
        onClick={closeCollapse}
      />
    )}
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
      style={{
        ...styles.navbar,
        left: collapseOpen ? '0' : '-280px',
      }}
    >
      {/* Rest of your existing Navbar content */}
    </Navbar>
  </>
);