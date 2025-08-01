import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import api from '../../axios';
import Lama from '../assets/lama.png';
import Arushi from '../assets/creator.png';
import Guide from '../assets/guide.jpg'

function LandingPage() {
  localStorage.clear();
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const names = ['Jane', 'Mary', 'Joe', 'Sita', 'Mike', 'Ravi', 'Ana','Aiko', 'Mateo', 'Zara', 'Omar', 'Lina', 'Igor', 'Fatima', 'Jasper', 'Noura', 'Kai', 'Sofia', 'Hiroshi', 'Leila', 'Thiago', 'Amara', 'Elias', 'Yuna', 'Kofi', 'Ines', 'Ravi'];
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [typedName, setTypedName] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentName = names[currentNameIndex];
    let typingSpeed = 150;

    if (!deleting && typedName.length < currentName.length) {
      const timeout = setTimeout(() => {
        setTypedName(currentName.slice(0, typedName.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (deleting && typedName.length > 0) {
      const timeout = setTimeout(() => {
        setTypedName(currentName.slice(0, typedName.length - 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else if (!deleting && typedName === currentName) {
      const timeout = setTimeout(() => setDeleting(true), 1000);
      return () => clearTimeout(timeout);
    } else if (deleting && typedName === '') {
      setDeleting(false);
      setCurrentNameIndex((prev) => (prev + 1) % names.length);
    }
  }, [typedName, deleting]);

  useEffect(() => {
    const reveal = () => {
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (top < windowHeight * 0.85) {
          section.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', reveal);
    reveal(); 

    return () => window.removeEventListener('scroll', reveal);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('https://tlax7s6a437jghb6k5rrkasxbq0jfgsr.lambda-url.ap-southeast-2.on.aws/movies/trending');
        setMovies(res.data);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      }
    };
    fetchMovies();
  }, []);

  const Login = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <section className="hero-section section">
        <h1 className="cursive-text">Meet The</h1>
        <h1 className="bold-text">DRAMALAMA</h1>
        <h4 className="dynamic-user">Our top user is {typedName}</h4>
        <img src={Lama} alt="Dramalama" className="lama-img" />
        <button onClick={Login}>GET STARTED</button>
        <p className="caption">this lama is too tired to care about you</p>
      </section>
      <section className="trending-section section">
        <h1 className="section-title">TRENDING</h1>
        {movies.length > 0 && (
          <div className="carousel-wrapper">
            <div className="carousel-container">
              {movies.map((movie, index) => (
                <div
                  key={index}
                  className="carousel-item"
                  style={{
                    transform: `rotateY(${(360 / movies.length) * index}deg) translateZ(350px)`
                  }}
                >
                  <div className="trend-card">
                    <img src={movie.poster_url} alt={movie.movie_name} />
                    <h3>{movie.movie_name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <section className="section creator-section">
        <h1 className="cursive-text">The Creator</h1>
        <h1 className="bold-text">ARUSHI</h1>
        <p className="creator-bio">BIOGRED <br /> SOFTWARE DEVELOPER</p>
        <p className="creator-caption">Why can't a ticketing platform be aesthetic? <br /> for all my girlies out there</p>
        <img src={Arushi} alt="Arushi" className="creator-img" />
      </section>

      <section className="section booking-section">
        <h1 className="section-title">HOW TO BOOK</h1>
        <div className="booking-role">
          <h2 className="cursive-text">Pipeline For Users</h2>
          <img src={Guide}></img>
        </div>
      </section>

      <section className="section offers-section">
        <h1 className="section-title">OFFERS & COUPONS</h1>
        <div className="offers-grid">
          <div className="offer-card">🎁 <strong>POPCORN300</strong>: Get free popcorn combo!</div>
          <div className="offer-card">🔥 <strong>NEW10</strong>: 10% off on first booking</div>
          <div className="offer-card">🏙️ <strong>BLR50</strong>: ₹50 off for Bangalore users</div>
        </div>
      </section>

      <section className="section why-section">
        <h1 className="section-title">WHY DRAMALAMA?</h1>
        <div className="why-grid">
          <div className="why-point">🎨 Aesthetic and intuitive UI</div>
          <div className="why-point">⚡ Fast and reliable booking experience</div>
          <div className="why-point">🎥 Focused on small and large cinemas alike</div>
          <div className="why-point">💖 Built with love (and popcorn) for all movie lovers</div>
          <div className="why-point">📱 Responsive for mobile & desktop</div>
          <div className="why-point">🛠️ Simple for cinemas to manage shows and cash</div>
        </div>
      </section>

      <footer className="section footer-section">
        <h1 className="section-title">CONTACT</h1>
        <p className="footer-contact">📞 +91 97989 26945</p>
        <p className="footer-contact">📧 arushiojha100@gmail.com</p>
        <p className="footer-caption">Made with ❤️ by Arushi</p>
      </footer>

      <section className="section thanks-section">
        <h1 className="cursive-text">Thanks for</h1>
        <h1 className="bold-text">WATCHING</h1>
      </section>
    </div>
  );
}

export default LandingPage;
