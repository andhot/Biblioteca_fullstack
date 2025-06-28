import React from 'react';

const sidebarStyle = {
  width: '240px',
  minHeight: 'calc(100vh - 60px)',
  background: 'linear-gradient(135deg, #6366f1 0%, #2563eb 100%)',
  color: '#fff',
  borderTopLeftRadius: 18,
  borderBottomLeftRadius: 18,
  padding: '2.5rem 1.5rem 2.5rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxShadow: '2px 0 16px #0001',
  marginRight: '2.5rem',
  marginTop: 0
};

const sidebarTitle = {
  fontWeight: 700,
  fontSize: 22,
  marginBottom: 8
};
const sidebarSubtitle = {
  fontWeight: 400,
  fontSize: 15,
  marginBottom: 32,
  opacity: 0.85
};
const sidebarLink = {
  width: '100%',
  background: 'rgba(255,255,255,0.08)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '0.9rem 1.2rem',
  fontWeight: 500,
  fontSize: 16,
  marginBottom: 12,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background 0.2s',
};
const sidebarLinkActive = {
  ...sidebarLink,
  background: 'rgba(255,255,255,0.18)',
  fontWeight: 700,
};

const Profile = () => (
  <div style={{display: 'flex', alignItems: 'flex-start', padding: '2rem'}}>
    {/* SIDEBAR */}
    <aside style={sidebarStyle}>
      <div style={sidebarTitle}>Profil</div>
      <div style={sidebarSubtitle}>Bun venit!</div>
      <button style={sidebarLinkActive}>Profil</button>
      <button style={sidebarLink}>Rezervările Mele</button>
      <button style={sidebarLink}>Favorite</button>
      <button style={sidebarLink}>Realizări</button>
      <button style={sidebarLink}>Setări</button>
    </aside>
    {/* DASHBOARD PROFIL */}
    <div style={{flex: 1}}>
      <h2>Profil utilizator</h2>
      <p>Aceasta este pagina de profil. Aici poți adăuga detalii despre utilizator.</p>
      <div style={{marginTop: '2.5rem'}}>
        {/* Carduri statistice */}
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{flex: 1, background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, textAlign: 'center'}}>
            <div style={{fontSize: 36, color: '#2563eb', marginBottom: 8}}>📚</div>
            <div style={{fontWeight: 700, fontSize: 18}}>0</div>
            <div style={{color: '#64748b'}}>Total Rezervări</div>
          </div>
          <div style={{flex: 1, background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, textAlign: 'center'}}>
            <div style={{fontSize: 36, color: '#f59e42', marginBottom: 8}}>⏳</div>
            <div style={{fontWeight: 700, fontSize: 18}}>0</div>
            <div style={{color: '#64748b'}}>Rezervări Active</div>
          </div>
          <div style={{flex: 1, background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, textAlign: 'center'}}>
            <div style={{fontSize: 36, color: '#ef4444', marginBottom: 8}}>❤️</div>
            <div style={{fontWeight: 700, fontSize: 18}}>0</div>
            <div style={{color: '#64748b'}}>Cărți Favorite</div>
          </div>
          <div style={{flex: 1, background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, textAlign: 'center'}}>
            <div style={{fontSize: 36, color: '#22c55e', marginBottom: 8}}>✔️</div>
            <div style={{fontWeight: 700, fontSize: 18}}>0</div>
            <div style={{color: '#64748b'}}>Cărți Citite</div>
          </div>
        </div>
        {/* Progres lectură */}
        <div style={{display: 'flex', gap: '2rem', marginBottom: '2rem'}}>
          <div style={{flex: 2, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24}}>
            <h3 style={{marginBottom: 16}}>Progresul de Lectură</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: 32}}>
              <div style={{width: 100, height: 100, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#2563eb'}}>0%</div>
              <div>
                <div style={{fontWeight: 600}}>0 / 12</div>
                <div style={{color: '#64748b'}}>Cărți citite anul acesta</div>
                <div style={{marginTop: 8, color: '#22c55e', fontWeight: 500, fontSize: 13}}>încă 12 cărți</div>
              </div>
            </div>
          </div>
          {/* Acțiuni rapide */}
          <div style={{flex: 3, display: 'flex', flexDirection: 'column', gap: 16}}>
            <h3 style={{marginBottom: 8}}>Acțiuni Rapide</h3>
            <div style={{display: 'flex', gap: 12}}>
              <button style={{flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer'}}>Caută Cărți</button>
              <button style={{flex: 1, background: '#f59e42', color: '#fff', border: 'none', borderRadius: 10, padding: '1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer'}}>Vezi Rezervări</button>
            </div>
            <div style={{display: 'flex', gap: 12}}>
              <button style={{flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer'}}>Favorite</button>
              <button style={{flex: 1, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, padding: '1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer'}}>Realizări</button>
            </div>
          </div>
        </div>
        {/* Activitate recentă */}
        <div style={{background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, marginBottom: '2rem'}}>
          <h3 style={{marginBottom: 16}}>Activitate Recentă</h3>
          <ul style={{margin: 0, padding: 0, listStyle: 'none'}}>
            <li style={{marginBottom: 10, color: '#2563eb', fontWeight: 500}}>Ai rezervat o carte nouă <span style={{color: '#64748b', fontWeight: 400, fontSize: 13}}>acum 2 ore</span></li>
            <li style={{marginBottom: 10, color: '#22c55e', fontWeight: 500}}>Ai finalizat o rezervare <span style={{color: '#64748b', fontWeight: 400, fontSize: 13}}>ieri</span></li>
          </ul>
        </div>
        {/* Recomandări */}
        <div style={{background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24}}>
          <h3 style={{marginBottom: 16}}>Recomandări</h3>
          <ul style={{margin: 0, padding: 0, listStyle: 'none', display: 'flex', gap: 24}}>
            <li style={{flex: 1, background: '#f1f5f9', borderRadius: 10, padding: 16, textAlign: 'center', color: '#f59e42', fontWeight: 600}}>Explorează genuri noi</li>
            <li style={{flex: 1, background: '#f1f5f9', borderRadius: 10, padding: 16, textAlign: 'center', color: '#2563eb', fontWeight: 600}}>Cărți populare</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default Profile; 