import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="app">
    <header class="navbar">
      <div class="logo">Forma AI</div>

      <nav>
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
      </nav>

      <button class="login-btn">Get Started</button>
    </header>

    <main>
      <section id="home" class="hero-section">
        <div class="hero-content">
          <p class="eyebrow">AI-POWERED FORMS</p>

          <h1>
            Create smarter forms
            <span>with AI.</span>
          </h1>

          <p class="hero-text">
            Build beautiful, intelligent forms faster with Forma AI.
            Let AI handle the complexity while you focus on what matters.
          </p>

          <div class="hero-buttons">
            <button class="primary-btn">Create a Form</button>
            <button class="secondary-btn">Learn More</button>
          </div>
        </div>
      </section>

      <section id="features" class="features">
        <div class="section-heading">
          <p class="eyebrow">FEATURES</p>
          <h2>Everything you need to build better forms.</h2>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <h3>AI Generation</h3>
            <p>
              Describe the form you need and let AI generate it for you.
            </p>
          </div>

          <div class="feature-card">
            <h3>Smart Logic</h3>
            <p>
              Create dynamic forms that adapt to every user's response.
            </p>
          </div>

          <div class="feature-card">
            <h3>Simple Analytics</h3>
            <p>
              Understand your responses with clear and useful insights.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

document.querySelector('.primary-btn').addEventListener('click', () => {
  alert('Form builder coming soon!');
});
document.querySelector('.secondary-btn').addEventListener('click', () => {
  document.querySelector('#features').scrollIntoView({
    behavior: 'smooth'
  })
})
document.querySelector('.login-btn').addEventListener('click', () => {
  alert('Welcome to Forma AI!');
})