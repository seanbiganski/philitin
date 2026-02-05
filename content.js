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

  // Helper to set values in a way that works with React/Vue/Angular
  function setNativeValue(element, value) {
    const prototype = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    if (descriptor && descriptor.set) {
      descriptor.set.call(element, value);
    } else {
      element.value = value;
    }
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

    // Username/login detection (before name detection to avoid false positive on "name")
    if (combined.includes('username') || combined.includes('user-name') || combined.includes('user_name') || combined.includes('login') || combined.includes('userid') || combined.includes('user_id')) {
      return 'username';
    }

    // Name detection
    if (combined.includes('firstname') || combined.includes('first-name') || combined.includes('fname') || combined.includes('first_name')) {
      return 'firstname';
    }
    if (combined.includes('lastname') || combined.includes('last-name') || combined.includes('lname') || combined.includes('surname') || combined.includes('last_name')) {
      return 'lastname';
    }
    if (combined.includes('fullname') || combined.includes('full_name') || (combined.includes('name') && !combined.includes('user') && !combined.includes('company'))) {
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

    // Number/range detection
    if (type === 'number' || type === 'range') {
      return 'number';
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

  // Function to fill a single field using persona data
  function fillField(field, fieldType, persona, passwordValue = null) {
    if (!persona) {
      console.error('Persona not available');
      return false;
    }

    let value = '';

    switch (fieldType) {
      case 'email':
        value = persona.email;
        break;
      case 'phone':
        value = persona.phone;
        break;
      case 'firstname':
        value = persona.firstName;
        break;
      case 'lastname':
        value = persona.lastName;
        break;
      case 'fullname':
        value = persona.fullName;
        break;
      case 'username':
        value = persona.username;
        break;
      case 'address':
        value = persona.address;
        break;
      case 'city':
        value = persona.city;
        break;
      case 'state':
        // Try to match select options
        if (field.tagName === 'SELECT') {
          const options = Array.from(field.options);
          // Try matching abbreviation first
          const abbrMatch = options.find(opt => opt.value === persona.stateAbbr || opt.text.trim() === persona.stateAbbr);
          if (abbrMatch) {
            field.value = abbrMatch.value;
            triggerInputEvents(field);
            return true;
          }
          // Try matching full state name
          const nameMatch = options.find(opt => opt.value === persona.state || opt.text.trim() === persona.state);
          if (nameMatch) {
            field.value = nameMatch.value;
            triggerInputEvents(field);
            return true;
          }
          // Fallback: pick a random non-placeholder option
          if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
            field.value = options[randomIndex].value;
            triggerInputEvents(field);
            return true;
          }
        }
        value = persona.state;
        break;
      case 'zip':
        value = persona.zip;
        break;
      case 'country':
        if (field.tagName === 'SELECT') {
          const options = Array.from(field.options);
          const countryTerms = ['United States', 'US', 'USA', 'United States of America'];
          const match = options.find(opt =>
            countryTerms.some(term => opt.value === term || opt.text.trim() === term)
          );
          if (match) {
            field.value = match.value;
            triggerInputEvents(field);
            return true;
          }
          // Fallback: pick a random non-placeholder option
          if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
            field.value = options[randomIndex].value;
            triggerInputEvents(field);
            return true;
          }
        }
        value = persona.country;
        break;
      case 'date':
        value = persona.dob;
        break;
      case 'creditcard':
        value = persona.creditCard;
        break;
      case 'cvv':
        value = persona.cvv;
        break;
      case 'expiry':
        if (field.name && (field.name.includes('month') || field.name.includes('mon'))) {
          value = persona.expiryMonth;
        } else if (field.name && (field.name.includes('year') || field.name.includes('yr'))) {
          value = persona.expiryYear;
        } else {
          value = `${persona.expiryMonth}/${persona.expiryYear}`;
        }
        break;
      case 'ssn':
        value = persona.ssn;
        break;
      case 'company':
        value = persona.company;
        break;
      case 'website':
        value = persona.website;
        break;
      case 'password':
        // Use provided password value or generate a new one
        if (passwordValue !== null && passwordValue !== undefined) {
          value = passwordValue;
        } else {
          value = generatePassword();
        }
        break;
      case 'number': {
        const min = parseFloat(field.min) || 0;
        const max = parseFloat(field.max) || 100;
        const step = parseFloat(field.step) || 1;
        const range = max - min;
        const steps = Math.floor(range / step);
        value = String(min + Math.floor(Math.random() * (steps + 1)) * step);
        break;
      }
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
      // Radio buttons are handled at the form level — skip individual handling here
      return true;
    } else {
      setNativeValue(field, value);
    }

    triggerInputEvents(field);
    return true;
  }

  // Pick one random radio button per group name
  function fillRadioGroups(container) {
    const radios = container.querySelectorAll('input[type="radio"]');
    const groups = {};
    radios.forEach(radio => {
      const groupName = radio.name;
      if (!groupName) return;
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(radio);
    });
    let count = 0;
    Object.values(groups).forEach(group => {
      // Skip groups that already have a selection
      if (group.some(r => r.checked)) return;
      const pick = group[Math.floor(Math.random() * group.length)];
      pick.checked = true;
      triggerInputEvents(pick);
      count++;
    });
    return count;
  }

  // Function to fill all forms on the page
  function fillAllForms() {
    const forms = document.querySelectorAll('form');
    let filledCount = 0;

    if (!window.dataGenerator) {
      console.error('[Phil It In] Data generator not available');
      return 0;
    }

    const generator = window.dataGenerator;

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
      // Generate one persona per form for coherent data
      const persona = generator.generatePersona();
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

        // Skip radio buttons — handled separately per group
        if (field.type === 'radio') {
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
        passwordFields.forEach(field => {
          fillField(field, 'password', persona, password);
          filledCount++;
        });
      }

      // Fill other fields normally
      otherFields.forEach(({ field, fieldType }) => {
        if (fillField(field, fieldType, persona)) {
          filledCount++;
        }
      });

      // Handle radio button groups within this form
      filledCount += fillRadioGroups(form);
    });

    // Also try to fill fields that might not be in forms
    const persona = generator.generatePersona();
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

      // Skip radio buttons — handled separately
      if (field.type === 'radio') {
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
      standalonePasswordFields.forEach(field => {
        fillField(field, 'password', persona, password);
        filledCount++;
      });
    }

    // Fill other standalone fields normally
    standaloneOtherFields.forEach(({ field, fieldType }) => {
      if (fillField(field, fieldType, persona)) {
        filledCount++;
      }
    });

    // Handle standalone radio button groups (not in forms)
    const body = document.body;
    const standaloneRadios = body.querySelectorAll('input[type="radio"]');
    const standaloneGroups = {};
    standaloneRadios.forEach(radio => {
      if (radio.closest('form')) return; // already handled
      const groupName = radio.name;
      if (!groupName) return;
      if (!standaloneGroups[groupName]) standaloneGroups[groupName] = [];
      standaloneGroups[groupName].push(radio);
    });
    Object.values(standaloneGroups).forEach(group => {
      if (group.some(r => r.checked)) return;
      const pick = group[Math.floor(Math.random() * group.length)];
      pick.checked = true;
      triggerInputEvents(pick);
      filledCount++;
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
