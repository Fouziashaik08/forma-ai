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

// --------------------------------------------------
// Learn More
// --------------------------------------------------

document.querySelector('.secondary-btn').addEventListener('click', () => {
  document.querySelector('#features').scrollIntoView({
    behavior: 'smooth'
  })
})

// --------------------------------------------------
// Get Started
// --------------------------------------------------

document.querySelector('.login-btn').addEventListener('click', () => {
  alert('Welcome to Forma AI!')
})

// --------------------------------------------------
// Create a Form
// --------------------------------------------------

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

      <div id="resume-existing-section">

        <h3>Resume a Saved Form</h3>

        <input
          type="text"
          id="resume-form-id"
          placeholder="Enter saved Form ID"
        >

        <button
          id="resume-existing-btn"
          class="secondary-btn"
          type="button"
        >
          Resume Form
        </button>

      </div>

      <div id="form-result"></div>

    </div>
  `

  // ------------------------------------------------
  // Resume an existing saved form
  // ------------------------------------------------

  document
    .querySelector('#resume-existing-btn')
    .addEventListener('click', async () => {

      const formId = document
        .querySelector('#resume-form-id')
        .value
        .trim()

      if (!formId) {
        alert('Please enter a saved Form ID.')
        return
      }

      try {

        const response = await fetch(
          `http://localhost:5000/api/forms/${encodeURIComponent(formId)}`
        )

        const result = await response.json()

        if (!response.ok) {
          alert(result.message || 'Saved form not found.')
          return
        }

        const savedForm = result.data

        alert(
          `Saved form "${savedForm.formTitle}" was found.\n\n` +
          'Generate the same form type above, then your saved answers can be restored.'
        )

        console.log('Saved Form:', savedForm)

      } catch (error) {

        console.error('Resume error:', error)

        alert(
          'Could not connect to the backend.'
        )
      }
    })

  // ------------------------------------------------
  // Generate Form
  // ------------------------------------------------

  document
    .querySelector('#generate-btn')
    .addEventListener('click', async () => {

      const prompt = document
        .querySelector('#form-prompt')
        .value
        .trim()

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
          alert(
            aiForm.message ||
            'Failed to generate form.'
          )
          return
        }

        console.log('AI Form:', aiForm)

        // ------------------------------------------------
        // Create unique Form ID
        // ------------------------------------------------

        const formId =
          crypto.randomUUID
            ? crypto.randomUUID()
            : 'form-' + Date.now()

        // ------------------------------------------------
        // Create fields
        // ------------------------------------------------

        const fieldsHTML = aiForm.fields
          .map((field) => {

            const value = field.value ?? ''
            const required = field.required === true

            const showIfAttribute = field.showIf
              ? `
                data-show-if-field="${field.showIf.field}"
                data-show-if-value="${field.showIf.value}"
              `
              : ''

            // Textarea
            if (field.type === 'textarea') {

              return `
                <div
                  class="form-field dynamic-field"
                  ${showIfAttribute}
                >

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
                <div
                  class="form-field dynamic-field"
                  ${showIfAttribute}
                >

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

            // Normal input
            return `
              <div
                class="form-field dynamic-field"
                ${showIfAttribute}
              >

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
          })
          .join('')

        // ------------------------------------------------
        // Display generated form
        // ------------------------------------------------

        document.querySelector('#form-result').innerHTML = `

          <div class="generated-form">

            <p class="eyebrow">
              FORM ID: ${formId}
            </p>

            <h2>
              ${aiForm.formTitle || aiForm.title}
            </h2>

            <p class="form-description">
              ${aiForm.description || ''}
            </p>

            <p
              class="review-message"
              style="display: none;"
            >
              Please review the highlighted fields before submitting.
            </p>

            ${fieldsHTML}

            <div class="form-actions">

              <button
                id="save-form-btn"
                class="secondary-btn"
                type="button"
              >
                Save & Continue Later
              </button>

              <button
                id="submit-form-btn"
                class="primary-btn"
                type="button"
              >
                Submit Form
              </button>

            </div>

          </div>
        `

        // ------------------------------------------------
        // Conditional field logic
        // ------------------------------------------------

        const dynamicFields =
          document.querySelectorAll('.dynamic-field')

        dynamicFields.forEach((fieldElement) => {

          const showIfField =
            fieldElement.dataset.showIfField

          const showIfValue =
            fieldElement.dataset.showIfValue

          if (!showIfField) {
            return
          }

          const controller =
            document.querySelector(
              `[name="${showIfField}"]`
            )

          if (!controller) {
            return
          }

          const updateVisibility = () => {

            let currentValue

            if (controller.type === 'checkbox') {
              currentValue = controller.checked
            } else {
              currentValue = controller.value
            }

            const shouldShow =
              String(currentValue) ===
              String(showIfValue)

            fieldElement.style.display =
              shouldShow ? 'block' : 'none'

            const input =
              fieldElement.querySelector(
                'input, textarea, select'
              )

            if (input) {
              input.disabled = !shouldShow

              if (!shouldShow) {
                input.classList.remove(
                  'validation-error'
                )
              }
            }
          }

          controller.addEventListener(
            'change',
            updateVisibility
          )

          updateVisibility()
        })

        // ------------------------------------------------
        // Collect current form data
        // ------------------------------------------------

        const collectFormData = () => {

          const inputs =
            document.querySelectorAll(
              '.generated-form input, .generated-form textarea'
            )

          const formData = {}

          inputs.forEach((input) => {

            if (input.disabled) {
              return
            }

            if (input.type === 'checkbox') {

              formData[input.name] =
                input.checked

            } else {

              formData[input.name] =
                input.value
            }
          })

          return formData
        }

        // ------------------------------------------------
        // Calculate progress
        // ------------------------------------------------

        const calculateProgress = () => {

          const inputs =
            document.querySelectorAll(
              '.generated-form input, .generated-form textarea'
            )

          let totalFields = 0
          let completedFields = 0

          inputs.forEach((input) => {

            if (input.disabled) {
              return
            }

            totalFields++

            if (input.type === 'checkbox') {

              if (input.checked) {
                completedFields++
              }

            } else {

              if (input.value.trim() !== '') {
                completedFields++
              }
            }
          })

          if (totalFields === 0) {
            return 0
          }

          return Math.round(
            (completedFields / totalFields) * 100
          )
        }

        // ------------------------------------------------
        // Save & Continue Later
        // ------------------------------------------------

        document
          .querySelector('#save-form-btn')
          .addEventListener('click', async () => {

            const formData =
              collectFormData()

            const progress =
              calculateProgress()

            try {

              const saveResponse =
                await fetch(
                  'http://localhost:5000/api/forms/save',
                  {
                    method: 'POST',

                    headers: {
                      'Content-Type':
                        'application/json'
                    },

                    body: JSON.stringify({
                      formId: formId,

                      formTitle:
                        aiForm.formTitle ||
                        aiForm.title,

                      formData:
                        formData,

                      progress:
                        progress
                    })
                  }
                )

              const result =
                await saveResponse.json()

              if (!saveResponse.ok) {

                alert(
                  result.message ||
                  'Failed to save form.'
                )

                return
              }

              alert(
                `Form saved successfully!\n\n` +
                `Your Form ID is:\n${formId}\n\n` +
                `Progress: ${progress}%\n\n` +
                `Save this Form ID to resume later.`
              )

              console.log(
                'Saved Form:',
                result
              )

            } catch (error) {

              console.error(
                'Save form error:',
                error
              )

              alert(
                'Could not connect to the backend.'
              )
            }
          })

        // ------------------------------------------------
        // Resume saved data
        // ------------------------------------------------

        const restoreSavedData =
          (savedData) => {

            if (!savedData) {
              return
            }

            Object.entries(savedData)
              .forEach(([name, value]) => {

                const input =
                  document.querySelector(
                    `.generated-form [name="${name}"]`
                  )

                if (!input) {
                  return
                }

                if (input.type === 'checkbox') {

                  input.checked =
                    value === true ||
                    value === 'true'

                } else {

                  input.value =
                    value ?? ''
                }

                input.dispatchEvent(
                  new Event('change', {
                    bubbles: true
                  })
                )
              })

            alert(
              'Saved answers have been restored.'
            )
          }

        // ------------------------------------------------
        // Submit generated form
        // ------------------------------------------------

        document
          .querySelector('#submit-form-btn')
          .addEventListener(
            'click',
            async () => {

              const inputs =
                document.querySelectorAll(
                  '.generated-form input, .generated-form textarea'
                )

              let hasValidationError = false

              const formData = {}

              inputs.forEach((input) => {

                if (input.disabled) {
                  return
                }

                const errorMessage =
                  document.querySelector(
                    `[data-error-for="${input.name}"]`
                  )

                const fieldContainer =
                  input.closest('.form-field')

                // Required validation
                if (
                  input.dataset.required ===
                  'true'
                ) {

                  const isEmpty =
                    input.type === 'checkbox'
                      ? !input.checked
                      : input.value.trim() === ''

                  if (isEmpty) {

                    hasValidationError =
                      true

                    input.classList.add(
                      'validation-error'
                    )

                    if (fieldContainer) {

                      fieldContainer.classList.add(
                        'needs-review'
                      )
                    }

                    if (errorMessage) {

                      errorMessage.textContent =
                        'This required field needs review.'

                      errorMessage.style.display =
                        'block'
                    }

                    return
                  }
                }

                // Clear validation error
                input.classList.remove(
                  'validation-error'
                )

                if (fieldContainer) {

                  fieldContainer.classList.remove(
                    'needs-review'
                  )
                }

                if (errorMessage) {

                  errorMessage.style.display =
                    'none'
                }

                if (input.type === 'checkbox') {

                  formData[input.name] =
                    input.checked

                } else {

                  formData[input.name] =
                    input.value
                }

              })

              // Stop if validation failed
              if (hasValidationError) {

                const reviewMessage =
                  document.querySelector(
                    '.review-message'
                  )

                reviewMessage.textContent =
                  'Please review the highlighted fields before submitting.'

                reviewMessage.style.display =
                  'block'

                return
              }

              try {

                // Submit using Harshit's existing API
                const submitResponse =
                  await fetch(
                    'http://localhost:5000/api/forms',
                    {
                      method: 'POST',

                      headers: {
                        'Content-Type':
                          'application/json'
                      },

                      body: JSON.stringify({

                        formTitle:
                          aiForm.formTitle ||
                          aiForm.title,

                        fields:
                          aiForm.fields,

                        formData:
                          formData
                      })
                    }
                  )

                const result =
                  await submitResponse.json()

                if (submitResponse.ok) {

                  alert(
                    'Form submitted successfully!'
                  )

                  console.log(
                    'Submitted Form:',
                    result
                  )

                } else {

                  alert(
                    result.message ||
                    'Failed to submit form.'
                  )

                  console.error(result)
                }

              } catch (error) {

                alert(
                  'Could not connect to the backend.'
                )

                console.error(error)
              }

            }
          )

      } catch (error) {

        console.error(
          'AI generation error:',
          error
        )

        alert(
          'Could not connect to the AI backend.'
        )
      }

    })

})