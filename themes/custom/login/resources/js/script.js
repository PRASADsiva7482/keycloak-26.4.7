document.addEventListener("DOMContentLoaded", function () {
  function setupPremiumPasswordFields() {
    const passwordFields = document.querySelectorAll('input[type="password"].premium-input');
    
    passwordFields.forEach(function(field) {
      // Only proceed if the field doesn't already have a toggle button as a sibling
      if (!field.nextElementSibling?.classList.contains('premium-password-toggle')) {
        // Create wrapper if it doesn't exist
        let wrapper = field.parentElement;
        if (!wrapper.style.position) {
          wrapper.style.position = 'relative';
        }
        
        // Create and add toggle button
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'premium-password-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle password visibility');
        toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        
        // Insert after the input field
        field.parentNode.insertBefore(toggleButton, field.nextSibling);
        
        // Add click handler with improved event handling
        function handleClick(e) {
          e.preventDefault();
          e.stopPropagation();
          const input = this.previousElementSibling;
          if (input.type === 'password') {
            input.type = 'text';
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
          } else {
            input.type = 'password';
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
          }
        }

        toggleButton.addEventListener('click', handleClick);
        // Also add touch event for mobile devices
        toggleButton.addEventListener('touchend', handleClick);
      }
    });
  }

  function setupInputFields() {
    // Set up premium password fields first
    setupPremiumPasswordFields();
    
    // Then handle other input fields
    const inputFields = document.querySelectorAll('input[type="text"], input[type="password"]:not(.premium-input), input[name="username"]');
    
    inputFields.forEach(function(field) {
        if (!field.parentElement.matches('.input-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-wrapper';
            field.parentNode.insertBefore(wrapper, field);
            wrapper.appendChild(field);

        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "password-toggle";
        toggleButton.setAttribute("aria-label", "Toggle password visibility");
        toggleButton.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        container.appendChild(toggleButton);

        toggleButton.addEventListener("click", function (e) {
          e.preventDefault();
          const input = this.parentElement.querySelector("input");
          if (input.type === "password") {
            input.type = "text";
            this.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
          } else {
            input.type = "password";
            this.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
          }
        });
      }
    });
  }

  // Initial setup
  setupInputFields();

  // Monitor for dynamic changes
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        setupPremiumPasswordFields();
        setupInputFields();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
