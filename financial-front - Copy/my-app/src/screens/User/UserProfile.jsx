import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../Redux/UserSlice';

const styles = {
  profileContainer: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    background: '#f0f2f5',
  },
  profileCard: {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '800px',
    overflow: 'hidden',
    animation: 'slideUp 0.6s ease',
  },
  profileHeader: {
    background: 'linear-gradient(135deg,#c5fcea,#7adebc)',
    padding: '2rem',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    overflow: 'hidden',
    border: '4px solid white',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarInitials: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#4f46e5',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: '2rem',
    margin: '0.5rem 0',
    fontWeight: 600,
  },
  profileUsername: {
    opacity: 0.9,
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
  },
  editButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 500,
  },
  profileDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    padding: '2rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    background: '#f8f9fa',
    borderRadius: '12px',
    transition: 'transform 0.3s ease',
  },
  detailIcon: {
    fontSize: '1.5rem',
    marginRight: '1.5rem',
    color: '#7adebc',
  },
  detailLabel: {
    display: 'block',
    color: '#7adebc',
    fontSize: '0.9rem',
    marginBottom: '0.3rem',
  },
  detailValue: {
    margin: 0,
    fontWeight: 500,
    color: '#1f2937',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e5e7eb',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    padding: '2rem',
    textAlign: 'center',
    color: '#dc2626',
    background: '#fee2e2',
    margin: '2rem',
    borderRadius: '12px',
  },
  noData: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
  },
};

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, isLoading, error } = useSelector((state) => state.userSlice);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.profileCard}>
        {isLoading ? (
          <div style={styles.loadingSpinner}>
            <div style={styles.spinner}></div>
          </div>
        ) : error ? (
          <div style={styles.errorMessage}>
            ⚠️ {error}
          </div>
        ) : currentUser ? (
          <>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Profile" style={styles.avatarImg} />
                ) : (
                  <div style={styles.avatarInitials}>
                    {getInitials(currentUser.name)}
                  </div>
                )}
              </div>
              <h1 style={styles.profileName}>{currentUser.name}</h1>
              <p style={styles.profileUsername}>@{currentUser.username}</p>
              <button style={styles.editButton}>
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            </div>

            <div style={styles.profileDetails}>
              <div style={styles.detailItem}>
                <i className="fas fa-envelope" style={styles.detailIcon}></i>
                <div>
                  <label style={styles.detailLabel}>Email</label>
                  <p style={styles.detailValue}>{currentUser.email}</p>
                </div>
              </div>

              <div style={styles.detailItem}>
                <i className="fas fa-user" style={styles.detailIcon}></i>
                <div>
                  <label style={styles.detailLabel}>Full Name</label>
                  <p style={styles.detailValue}>{currentUser.fullName}</p>
                </div>
              </div>

              <div style={styles.detailItem}>
                <i className="fas fa-calendar-alt" style={styles.detailIcon}></i>
                <div>
                  <label style={styles.detailLabel}>Member Since</label>
                  <p style={styles.detailValue}>{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div style={styles.detailItem}>
                <i className="fas fa-id-card" style={styles.detailIcon}></i>
                <div>
                  <label style={styles.detailLabel}>User ID</label>
                  <p style={styles.detailValue}>{currentUser.id}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.noData}>
            <i className="fas fa-user-slash"></i>
            <p>No user data found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
