function validateEmail() {
    const emailField = document.getElementById('mce-EMAIL');
    
    // Simple email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailField.value || !emailRegex.test(emailField.value)) {
      // Alert user if email is invalid or empty
      alert("Please enter a valid email address.");
      return false; // Prevent form submission
    }
    
    return true; // Allow form submission
  }
