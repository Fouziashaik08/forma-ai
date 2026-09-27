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
  document.querySelector('#generate-btn').addEventListener('click', async () => {

    const prompt = document.querySelector('#form-prompt').value.trim()

    if (!prompt) {
      alert('Please describe the form you want to create.')
      return
    }

    try {

      const response = await fetch(
        'http://localhost:5000/api/generate-form',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt })
        }
      )

      const aiForm = await response.json()

      if (!response.ok) {
        alert(aiForm.message || 'Failed to generate form.')
        return
      }

      console.log('AI Form:', aiForm)

      // Create form fields using AI-generated values
      const fieldsHTML = aiForm.fields.map((field) => {

        const value = field.value ?? ''
        const required = field.required === true

        // Textarea
        if (field.type === 'textarea') {
          return `
            <div class="form-field">
              <label>
                ${field.label}

                <textarea
                  name="${field.name}"
                  placeholder="${field.label}"
                  ${required ? 'data-required="true"' : ''}
                >${value}</textarea>
              </label>

              <p
                class="validation-message"
                data-error-for="${field.name}"
                style="display: none;"
              >
                This field needs review.
              </p>
            </div>

            <br>
          `
        }

        // Checkbox
        if (field.type === 'checkbox') {

          const checked =
            value === true ||
            value === 'true' ||
            value === 'yes' ||
            value === 'Yes'

          return `
            <div class="form-field">
              <label>
                <input
                  type="checkbox"
                  name="${field.name}"
                  ${checked ? 'checked' : ''}
                  ${required ? 'data-required="true"' : ''}
                >
                ${field.label}
              </label>

              <p
                class="validation-message"
                data-error-for="${field.name}"
                style="display: none;"
              >
                This field needs review.
              </p>
            </div>

            <br>
          `
        }

        // Normal input fields
        return `
          <div class="form-field">
            <label>
              ${field.label}

              <input
                type="${field.type}"
                name="${field.name}"
                placeholder="${field.label}"
                value="${value}"
                ${required ? 'data-required="true"' : ''}
              >
            </label>

            <p
              class="validation-message"
              data-error-for="${field.name}"
              style="display: none;"
            >
              This field needs review.
            </p>
          </div>

          <br>
        `
      }).join('')

      document.querySelector('#form-result').innerHTML = `
        <div class="generated-form">

          <h2>${aiForm.formTitle || aiForm.title}</h2>

          <p class="form-description">
            ${aiForm.description}
          </p>

          <p class="review-message" style="display: none;">
            Please review the highlighted fields before submitting.
          </p>

          ${fieldsHTML}

          <button
            id="submit-form-btn"
            class="primary-btn"
            type="button"
          >
            Submit Form
          </button>

        </div>
      `

      // Submit generated form
      document
        .querySelector('#submit-form-btn')
        .addEventListener('click', async () => {

          const inputs = document.querySelectorAll(
            '.generated-form input, .generated-form textarea'
          )

          let hasValidationError = false

          const formData = {}

          inputs.forEach((input) => {

            const errorMessage = document.querySelector(
              `[data-error-for="${input.name}"]`
            )

            const fieldContainer = input.closest('.form-field')

            // Validate required fields
            if (input.dataset.required === 'true') {

              const isEmpty =
                input.type === 'checkbox'
                  ? !input.checked
                  : input.value.trim() === ''

              if (isEmpty) {

                hasValidationError = true

                input.classList.add('validation-error')

                if (fieldContainer) {
                  fieldContainer.classList.add('needs-review')
                }

                if (errorMessage) {
                  errorMessage.textContent =
                    'This required field needs review.'
                  errorMessage.style.display = 'block'
                }

                return
              }
            }

            // Clear validation error when field is valid
            input.classList.remove('validation-error')

            if (fieldContainer) {
              fieldContainer.classList.remove('needs-review')
            }

            if (errorMessage) {
              errorMessage.style.display = 'none'
            }

            if (input.type === 'checkbox') {
              formData[input.name] = input.checked
            } else {
              formData[input.name] = input.value
            }
          })

          // Stop submission if validation failed
          if (hasValidationError) {

            const reviewMessage = document.querySelector(
              '.review-message'
            )

            reviewMessage.textContent =
              'Please review the highlighted fields before submitting.'

            reviewMessage.style.display = 'block'

            return
          }

          try {

            const submitResponse = await fetch(
              'http://localhost:5000/api/submissions',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  formTitle: aiForm.formTitle || aiForm.title,
                  formData: formData
                })
              }
            )

            const result = await submitResponse.json()

            if (submitResponse.ok) {
              alert('Form submitted successfully!')
              console.log(result)
            } else {
              alert(result.message || 'Failed to submit form.')
              console.error(result)
            }

          } catch (error) {
            alert('Could not connect to the backend.')
            console.error(error)
          }

        })

    } catch (error) {

      console.error('AI generation error:', error)

      alert('Could not connect to the AI backend.')
    }

  })

})