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

          <h2>
            Everything you need to build better forms.
          </h2>
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
`

// Learn More button
document.querySelector('.secondary-btn').addEventListener('click', () => {
  document.querySelector('#features').scrollIntoView({
    behavior: 'smooth'
  })
})

// Get Started button
document.querySelector('.login-btn').addEventListener('click', () => {
  alert('Welcome to Forma AI!')
})

// Create a Form button
document.querySelector('.primary-btn').addEventListener('click', () => {

  document.querySelector('#home').innerHTML = `
    <div class="builder">

      <p class="eyebrow">FORMA AI BUILDER</p>

      <h1>Create your form with AI.</h1>

      <p class="hero-text">
        Describe the form you want to create.
      </p>

      <textarea
        id="form-prompt"
        placeholder="Example: Create a feedback form for college students"
      ></textarea>

      <br><br>

      <button id="generate-btn" class="primary-btn">
        Generate Form
      </button>

      <div id="form-result"></div>

    </div>
  `

  // Generate Form button
  document.querySelector('#generate-btn').addEventListener('click', () => {

    const prompt = document.querySelector('#form-prompt').value.trim()

    if (!prompt) {
      alert('Please describe the form you want to create.')
      return
    }
    document.querySelector('#form-result').innerHTML = `
      <div class="generated-form">

        <h2>Generated Form</h2>

        <p class="form-description">
          Based on: "${prompt}"
        </p>

        <label>
          Your Name
          <input
            type="text"
            placeholder="Enter your name"
          >
        </label>

        <br><br>

        <label>
          Email Address
          <input
            type="email"
            placeholder="Enter your email"
          >
        </label>

        <br><br>

        <label>
          Your Feedback
          <textarea
            placeholder="Write your response"
          ></textarea>
        </label>

        <br><br>

        <button id="submit-form-btn" class="primary-btn" type="button">
          Submit Form
        </button>

      </div>
    `

    document.querySelector('#submit-form-btn').addEventListener('click', async () => {
  const name = document.querySelector('.generated-form input[type="text"]').value
  const email = document.querySelector('.generated-form input[type="email"]').value
  const feedback = document.querySelector('.generated-form textarea').value

  try {
    const response = await fetch('http://localhost:5000/api/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        feedback
      })
    })

    const result = await response.json()

    if (response.ok) {
      alert('Form submitted successfully!')
      console.log(result)
    } else {
      alert('Failed to submit form.')
      console.error(result)
    }
  } catch (error) {
    alert('Could not connect to the backend.')
    console.error(error)
  }
})
  })
})