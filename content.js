// Content script to detect and fill forms with realistic data
(function() {
  'use strict';

  // Function to check if a field is a search field
  function isSearchField(field) {
    // Check if field type is search
    if (field.type === 'search') {
      return true;
    }

    // Check field attributes
    const name = (field.name || '').toLowerCase();
    const id = (field.id || '').toLowerCase();
    const placeholder = (field.placeholder || '').toLowerCase();
    const className = (field.className || '').toLowerCase();
    const role = (field.getAttribute('role') || '').toLowerCase();
    const ariaLabel = (field.getAttribute('aria-label') || '').toLowerCase();
    
    // Check if field itself indicates search
    if (role === 'search' || 
        name.includes('search') || 
        id.includes('search') || 
        placeholder.includes('search') ||
        className.includes('search') ||
        ariaLabel.includes('search')) {
      return true;
    }

    // Check if field is inside a search container
    let parent = field.parentElement;
    while (parent && parent.tagName !== 'BODY') {
      const parentId = (parent.id || '').toLowerCase();
      const parentClass = (parent.className || '').toLowerCase();
      const parentRole = (parent.getAttribute('role') || '').toLowerCase();
      const parentTag = parent.tagName.toLowerCase();
      
      // Check if parent is nav or contains search indicators
      if (parentTag === 'nav' || 
          parentRole === 'search' ||
          parentId.includes('search') ||
          parentClass.includes('search') ||
          parentClass.includes('navbar') ||
          parentClass.includes('navigation') ||
          parentId.includes('navbar') ||
          parentId.includes('navigation')) {
        // But only if it's actually a search input, not just any input in nav
        if (name.includes('search') || id.includes('search') || placeholder.includes('search') || parentRole === 'search') {
          return true;
        }
      }
      parent = parent.parentElement;
    }

    return false;
  }

  // Function to trigger input events (so forms detect the changes)
  function triggerInputEvents(element) {
    ['input', 'change', 'blur'].forEach(eventType => {
      const event = new Event(eventType, { bubbles: true });
      element.dispatchEvent(event);
    });
  }

  // Function to detect field type based on name, id, placeholder, type, etc.
  function detectFieldType(field) {
    const name = (field.name || '').toLowerCase();
    const id = (field.id || '').toLowerCase();
    const placeholder = (field.placeholder || '').toLowerCase();
    const label = getFieldLabel(field).toLowerCase();
    const type = (field.type || 'text').toLowerCase();
    const className = (field.className || '').toLowerCase();

    const combined = `${name} ${id} ${placeholder} ${label} ${className}`;

    // Email detection
    if (type === 'email' || combined.includes('email') || combined.includes('e-mail')) {
      return 'email';
    }

    // Phone detection
    if (type === 'tel' || combined.includes('phone') || combined.includes('tel') || combined.includes('mobile')) {
      return 'phone';
    }

    // Password detection
    if (type === 'password' || combined.includes('password') || combined.includes('pass')) {
      return 'password';
    }

    // Name detection
    if (combined.includes('firstname') || combined.includes('first-name') || combined.includes('fname')) {
      return 'firstname';
    }
    if (combined.includes('lastname') || combined.includes('last-name') || combined.includes('lname') || combined.includes('surname')) {
      return 'lastname';
    }
    if (combined.includes('fullname') || (combined.includes('name') && !combined.includes('user') && !combined.includes('company'))) {
      return 'fullname';
    }

    // Address detection
    if (combined.includes('address') || combined.includes('street') || combined.includes('addr')) {
      return 'address';
    }
    if (combined.includes('city')) {
      return 'city';
    }
    if (combined.includes('state') || combined.includes('province')) {
      return 'state';
    }
    if (combined.includes('zip') || combined.includes('postal') || combined.includes('postcode')) {
      return 'zip';
    }
    if (combined.includes('country')) {
      return 'country';
    }

    // Date detection
    if (type === 'date' || combined.includes('dob') || combined.includes('dateofbirth') || combined.includes('birth') || combined.includes('birthday')) {
      return 'date';
    }

    // Credit card detection
    if (combined.includes('card') || combined.includes('credit') || combined.includes('ccnumber') || combined.includes('cc_number')) {
      return 'creditcard';
    }
    if (combined.includes('cvv') || combined.includes('cvc') || combined.includes('security')) {
      return 'cvv';
    }
    if (combined.includes('expiry') || combined.includes('expiration') || combined.includes('expdate')) {
      return 'expiry';
    }

    // SSN detection
    if (combined.includes('ssn') || combined.includes('social') || combined.includes('social security')) {
      return 'ssn';
    }

    // Company detection
    if (combined.includes('company') || combined.includes('organization') || combined.includes('org')) {
      return 'company';
    }

    // Website URL detection
    if (type === 'url' || combined.includes('website') || combined.includes('url') || combined.includes('web')) {
      return 'website';
    }

    return 'unknown';
  }

  // Function to get field label
  function getFieldLabel(field) {
    // Try to find associated label
    if (field.id) {
      const label = document.querySelector(`label[for="${field.id}"]`);
      if (label) return label.textContent.trim();
    }

    // Try to find parent label
    let parent = field.parentElement;
    while (parent && parent.tagName !== 'BODY') {
      if (parent.tagName === 'LABEL') {
        return parent.textContent.trim();
      }
      parent = parent.parentElement;
    }

    return '';
  }

  // Function to generate a password
  function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  // Function to fill a single field
  function fillField(field, fieldType, passwordValue = null) {
    if (!window.dataGenerator) {
      console.error('Data generator not available');
      return false;
    }

    const generator = window.dataGenerator;
    let value = '';

    switch (fieldType) {
      case 'email':
        value = generator.generateEmail();
        break;
      case 'phone':
        value = generator.generatePhoneNumber();
        break;
      case 'firstname':
        value = generator.generateFirstName();
        break;
      case 'lastname':
        value = generator.generateLastName();
        break;
      case 'fullname':
        value = generator.generateFullName();
        break;
      case 'address':
        value = generator.generateStreetAddress();
        break;
      case 'city':
        value = generator.generateCity();
        break;
      case 'state':
        // Try to match select options
        if (field.tagName === 'SELECT') {
          const options = Array.from(field.options);
          const stateOption = options.find(opt => 
            opt.value && (opt.value.length === 2 || opt.text.includes('State'))
          );
          if (stateOption && stateOption.value.length === 2) {
            value = generator.generateState(true); // Use abbreviation
          } else {
            value = generator.generateState(false); // Use full name
          }
        } else {
          value = generator.generateState(false);
        }
        break;
      case 'zip':
        value = generator.generateZipCode();
        break;
      case 'country':
        value = 'United States';
        break;
      case 'date':
        value = generator.generateDateOfBirth();
        break;
      case 'creditcard':
        value = generator.generateCreditCard().number;
        break;
      case 'cvv':
        value = generator.generateCreditCard().cvv;
        break;
      case 'expiry':
        if (field.name && (field.name.includes('month') || field.name.includes('mon'))) {
          value = generator.generateCreditCard().expiryMonth;
        } else if (field.name && (field.name.includes('year') || field.name.includes('yr'))) {
          value = generator.generateCreditCard().expiryYear;
        } else {
          value = `${generator.generateCreditCard().expiryMonth}/${generator.generateCreditCard().expiryYear}`;
        }
        break;
      case 'ssn':
        value = generator.generateSSN();
        break;
      case 'company':
        value = generator.generateCompany();
        break;
      case 'website':
        value = generator.generateWebsite();
        break;
      case 'password':
        // Use provided password value or generate a new one
        if (passwordValue !== null && passwordValue !== undefined) {
          value = passwordValue;
          const fieldId = field.id || field.name || field.placeholder || 'unknown';
          console.log(`[Phil It In] Using provided password for field (${fieldId}): "${passwordValue}"`);
        } else {
          value = generatePassword();
          const fieldId = field.id || field.name || field.placeholder || 'unknown';
          console.log(`[Phil It In] Generating new password for field (${fieldId}): "${value}"`);
        }
        break;
      default:
        // For unknown fields, generate a generic text
        value = `Sample Text ${Math.floor(Math.random() * 1000)}`;
    }

    // Fill the field
    if (field.tagName === 'SELECT') {
      // For select dropdowns
      const options = Array.from(field.options);
      const matchingOption = options.find(opt => opt.value === value || opt.text.includes(value));
      if (matchingOption) {
        field.value = matchingOption.value;
      } else if (options.length > 1) {
        // Pick a random option (skip the first one which is often a placeholder)
        const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
        field.value = options[randomIndex].value;
      }
    } else if (field.type === 'checkbox') {
      // Randomly check/uncheck
      field.checked = Math.random() > 0.5;
    } else if (field.type === 'radio') {
      field.checked = true;
    } else {
      field.value = value;
    }

    triggerInputEvents(field);
    return true;
  }

  // Function to fill all forms on the page
  function fillAllForms() {
    const forms = document.querySelectorAll('form');
    let filledCount = 0;

    // Prevent form submission while filling
    const preventSubmitHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable all submit buttons temporarily
    // Note: buttons without type default to "submit" inside forms
    const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"]');
    const buttonsInForms = document.querySelectorAll('form button:not([type])');
    const allSubmitButtons = [...submitButtons, ...buttonsInForms];
    const originalDisabledStates = [];
    allSubmitButtons.forEach((btn, index) => {
      originalDisabledStates[index] = btn.disabled;
      btn.disabled = true;
    });

    // Add event listeners to prevent form submission
    forms.forEach(form => {
      form.addEventListener('submit', preventSubmitHandler, true);
    });

    forms.forEach(form => {
      const fields = form.querySelectorAll('input, select, textarea');
      
      // First, collect all password fields in this form
      const passwordFields = [];
      const otherFields = [];
      
      fields.forEach(field => {
        // Skip hidden fields and submit buttons
        if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') {
          return;
        }

        // Skip search fields
        if (isSearchField(field)) {
          return;
        }

        // Skip already filled fields (optional - can be changed)
        if (field.value && field.value.trim() !== '') {
          return;
        }

        // Check if it's a password field - check actual type first, then detectFieldType
        const isPasswordField = field.type === 'password' || detectFieldType(field) === 'password';
        
        if (isPasswordField) {
          passwordFields.push(field);
        } else {
          const fieldType = detectFieldType(field);
          otherFields.push({ field, fieldType });
        }
      });

      // Generate one password for all password fields in this form
      if (passwordFields.length > 0) {
        const password = generatePassword();
        console.log(`[Phil It In] Found ${passwordFields.length} password field(s) in form, generated password: "${password}"`);
        passwordFields.forEach((field, index) => {
          const fieldId = field.id || field.name || field.placeholder || `field-${index}`;
          console.log(`[Phil It In] Filling password field #${index + 1} (${fieldId}) with password: "${password}"`);
          fillField(field, 'password', password);
          console.log(`[Phil It In] Password field #${index + 1} value after fill: "${field.value}"`);
          filledCount++;
        });
        // Verify all passwords match
        const allMatch = passwordFields.every(field => field.value === password);
        const values = passwordFields.map(f => f.value);
        console.log(`[Phil It In] Password verification - All fields match: ${allMatch}, Values: [${values.map(v => `"${v}"`).join(', ')}]`);
      }

      // Fill other fields normally
      otherFields.forEach(({ field, fieldType }) => {
        if (fillField(field, fieldType)) {
          filledCount++;
        }
      });
    });

    // Also try to fill fields that might not be in forms
    const standaloneFields = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
    
    // Collect password fields and other fields separately
    const standalonePasswordFields = [];
    const standaloneOtherFields = [];
    
    standaloneFields.forEach(field => {
      // Skip search fields
      if (isSearchField(field)) {
        return;
      }
      
      if (field.value && field.value.trim() !== '') {
        return;
      }
      
      // Skip fields that are already inside forms (they were handled above)
      if (field.closest('form')) {
        return;
      }
      
      // Check if it's a password field - check actual type first, then detectFieldType
      const isPasswordField = field.type === 'password' || detectFieldType(field) === 'password';
      
      if (isPasswordField) {
        standalonePasswordFields.push(field);
      } else {
        const fieldType = detectFieldType(field);
        standaloneOtherFields.push({ field, fieldType });
      }
    });

    // Generate one password for all standalone password fields
    if (standalonePasswordFields.length > 0) {
      const password = generatePassword();
      console.log(`[Phil It In] Found ${standalonePasswordFields.length} standalone password field(s), generated password: "${password}"`);
      standalonePasswordFields.forEach((field, index) => {
        const fieldId = field.id || field.name || field.placeholder || `standalone-field-${index}`;
        console.log(`[Phil It In] Filling standalone password field #${index + 1} (${fieldId}) with password: "${password}"`);
        fillField(field, 'password', password);
        console.log(`[Phil It In] Standalone password field #${index + 1} value after fill: "${field.value}"`);
        filledCount++;
      });
      // Verify all passwords match
      const allMatch = standalonePasswordFields.every(field => field.value === password);
      const values = standalonePasswordFields.map(f => f.value);
      console.log(`[Phil It In] Standalone password verification - All fields match: ${allMatch}, Values: [${values.map(v => `"${v}"`).join(', ')}]`);
    }

    // Fill other standalone fields normally
    standaloneOtherFields.forEach(({ field, fieldType }) => {
      if (fillField(field, fieldType)) {
        filledCount++;
      }
    });

    // Re-enable submit buttons after a short delay
    setTimeout(() => {
      allSubmitButtons.forEach((btn, index) => {
        btn.disabled = originalDisabledStates[index];
      });
      
      // Remove form submission prevention
      forms.forEach(form => {
        form.removeEventListener('submit', preventSubmitHandler, true);
      });
    }, 100);

    return filledCount;
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillForms') {
      const filledCount = fillAllForms();
      sendResponse({ success: true, filledCount });
    }
    return true; // Keep the message channel open for async response
  });

  // Expose function for direct access
  window.formFiller = {
    fillAllForms,
    fillField,
    detectFieldType
  };
})();

