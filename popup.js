// Popup script
document.addEventListener('DOMContentLoaded', () => {
  const fillBtn = document.getElementById('fillBtn');
  const status = document.getElementById('status');

  // Set version number from manifest
  try {
    const manifest = chrome.runtime.getManifest();
    const versionElement = document.getElementById('version');
    if (versionElement && manifest && manifest.version) {
      versionElement.textContent = manifest.version;
    }
  } catch (e) {
    // Fallback if manifest can't be loaded
    const versionElement = document.getElementById('version');
    if (versionElement) {
      versionElement.textContent = '1.1.0';
    }
  }

  fillBtn.addEventListener('click', async () => {
    fillBtn.disabled = true;
    fillBtn.textContent = 'Filling...';
    status.className = 'status';
    status.style.display = 'none';

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Check if we can inject into this page
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
        showStatus('Cannot fill forms on this page type', 'error');
        fillBtn.disabled = false;
        fillBtn.textContent = 'Fill All Forms';
        return;
      }

      // Try using scripting API first (Manifest V3)
      if (chrome.scripting && chrome.scripting.executeScript) {
        try {
          // First inject the data generator
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['data-generator.js']
          });

          // Then execute the fill function directly
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: fillFormsDirectly
          });

          if (results && results[0] && results[0].result) {
            const result = results[0].result;
            if (result.success) {
              showStatus(`Successfully filled ${result.filledCount} field(s)!`, 'success');
            } else {
              showStatus(result.error || 'Forms filled!', result.error ? 'error' : 'success');
            }
          } else {
            showStatus('Forms filled!', 'success');
          }
          // Reset button after successful scripting API path
          fillBtn.disabled = false;
          fillBtn.textContent = 'Fill All Forms';
        } catch (scriptError) {
          console.error('Scripting API error:', scriptError);
          // Fall through to content script messaging (which will reset the button)
          await fillViaContentScript(tab.id);
        }
      } else {
        // Fallback: use content script messaging (which will reset the button)
        await fillViaContentScript(tab.id);
      }
    } catch (error) {
      console.error('Fill error:', error);
      showStatus('Error: ' + error.message, 'error');
      fillBtn.disabled = false;
      fillBtn.textContent = 'Fill All Forms';
    }
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }

  async function fillViaContentScript(tabId) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, { action: 'fillForms' }, (response) => {
        if (chrome.runtime.lastError) {
          showStatus('Error: Content script not loaded. Please reload the page and try again.', 'error');
        } else if (response && response.success) {
          showStatus(`Successfully filled ${response.filledCount} field(s)!`, 'success');
        } else {
          showStatus('Forms filled!', 'success');
        }
        fillBtn.disabled = false;
        fillBtn.textContent = 'Fill All Forms';
        resolve();
      });
    });
  }
});

// Function to inject directly into the page context
function fillFormsDirectly() {
  // Initialize data generator if not available
  if (!window.dataGenerator) {
    class SimpleDataGenerator {
      constructor() {
        this.firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary'];
        this.lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
        this.streetNames = ['Main', 'Oak', 'Park', 'Maple', 'Cedar', 'Elm', 'Washington', 'Lincoln'];
        this.streetSuffixes = ['Street', 'Avenue', 'Road', 'Drive', 'Lane', 'Court', 'Place', 'Way'];
        this.emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        this.companySuffixes = ['Inc', 'LLC', 'Corp', 'Ltd', 'Co', 'Group', 'Solutions', 'Services'];
        this.companyNames = ['Tech', 'Global', 'Digital', 'Advanced', 'Smart', 'Future', 'Modern', 'Pro'];
        this.cityStateMap = [
          { city: 'New York', state: 'New York', abbr: 'NY', zipPrefix: '100' },
          { city: 'Los Angeles', state: 'California', abbr: 'CA', zipPrefix: '900' },
          { city: 'Chicago', state: 'Illinois', abbr: 'IL', zipPrefix: '606' },
          { city: 'Houston', state: 'Texas', abbr: 'TX', zipPrefix: '770' },
          { city: 'Phoenix', state: 'Arizona', abbr: 'AZ', zipPrefix: '850' },
          { city: 'Philadelphia', state: 'Pennsylvania', abbr: 'PA', zipPrefix: '191' },
          { city: 'San Antonio', state: 'Texas', abbr: 'TX', zipPrefix: '782' },
          { city: 'San Francisco', state: 'California', abbr: 'CA', zipPrefix: '941' },
          { city: 'Seattle', state: 'Washington', abbr: 'WA', zipPrefix: '981' },
          { city: 'Denver', state: 'Colorado', abbr: 'CO', zipPrefix: '802' },
          { city: 'Miami', state: 'Florida', abbr: 'FL', zipPrefix: '331' },
          { city: 'Atlanta', state: 'Georgia', abbr: 'GA', zipPrefix: '303' }
        ];
      }

      random(items) { return items[Math.floor(Math.random() * items.length)]; }
      randomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
      generateFirstName() { return this.random(this.firstNames); }
      generateLastName() { return this.random(this.lastNames); }
      generateFullName() { return `${this.generateFirstName()} ${this.generateLastName()}`; }
      generateEmail(firstName, lastName) {
        const first = (firstName || this.generateFirstName()).toLowerCase();
        const last = (lastName || this.generateLastName()).toLowerCase();
        return `${first}.${last}${this.randomNumber(100,999)}@${this.random(this.emailDomains)}`;
      }
      generateUsername(firstName, lastName) {
        const first = (firstName || this.generateFirstName()).toLowerCase();
        const last = (lastName || this.generateLastName()).toLowerCase();
        const styles = [
          () => `${first}${last}${this.randomNumber(1, 999)}`,
          () => `${first}_${last}`,
          () => `${first}.${last}${this.randomNumber(10, 99)}`,
          () => `${first[0]}${last}${this.randomNumber(1, 99)}`,
        ];
        return this.random(styles)();
      }
      generatePhoneNumber() { return `(${this.randomNumber(200,999)}) ${this.randomNumber(200,999)}-${this.randomNumber(1000,9999)}`; }
      generateStreetAddress() { return `${this.randomNumber(100,9999)} ${this.random(this.streetNames)} ${this.random(this.streetSuffixes)}`; }
      generateCity() { return this.random(this.cityStateMap).city; }
      generateState(abbr) {
        const loc = this.random(this.cityStateMap);
        return abbr ? loc.abbr : loc.state;
      }
      generateZipCode() { return this.randomNumber(10000, 99999).toString(); }
      generateCoherentAddress() {
        const location = this.random(this.cityStateMap);
        const zipSuffix = String(this.randomNumber(10, 99));
        return {
          street: this.generateStreetAddress(),
          city: location.city,
          state: location.state,
          stateAbbr: location.abbr,
          zip: location.zipPrefix + zipSuffix
        };
      }
      generateDateOfBirth() { return `${this.randomNumber(1970,2000)}-${String(this.randomNumber(1,12)).padStart(2,'0')}-${String(this.randomNumber(1,28)).padStart(2,'0')}`; }
      generateCompany() { return `${this.random(this.companyNames)} ${this.random(this.companySuffixes)}`; }
      generateWebsite() {
        const domains = ['example.com', 'demo.com', 'test.com', 'sample.org'];
        const protocol = this.random(['http://', 'https://']);
        const subdomain = this.random(['www.', '']);
        return `${protocol}${subdomain}${this.random(domains)}`;
      }
      generateCreditCard() {
        const cardTypes = [
          { prefix: '4', length: 16, name: 'Visa' },
          { prefix: '5', length: 16, name: 'Mastercard' }
        ];
        const type = this.random(cardTypes);
        let number = type.prefix;
        for (let i = 1; i < type.length - 1; i++) { number += this.randomNumber(0, 9); }
        number += this.randomNumber(0, 9);
        const currentYear = new Date().getFullYear();
        return {
          number, type: type.name,
          cvv: this.randomNumber(100, 999).toString(),
          expiryMonth: String(this.randomNumber(1, 12)).padStart(2, '0'),
          expiryYear: String(this.randomNumber(currentYear + 1, currentYear + 5))
        };
      }
      generateSSN() { return `${this.randomNumber(100,999)}-${this.randomNumber(10,99)}-${this.randomNumber(1000,9999)}`; }
      generatePersona() {
        const firstName = this.generateFirstName();
        const lastName = this.generateLastName();
        const address = this.generateCoherentAddress();
        const card = this.generateCreditCard();
        return {
          firstName, lastName,
          fullName: `${firstName} ${lastName}`,
          username: this.generateUsername(firstName, lastName),
          email: this.generateEmail(firstName, lastName),
          phone: this.generatePhoneNumber(),
          address: address.street,
          city: address.city,
          state: address.state,
          stateAbbr: address.stateAbbr,
          zip: address.zip,
          country: 'United States',
          company: this.generateCompany(),
          website: this.generateWebsite(),
          dob: this.generateDateOfBirth(),
          ssn: this.generateSSN(),
          creditCard: card.number,
          creditCardType: card.type,
          cvv: card.cvv,
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
        };
      }
    }
    window.dataGenerator = new SimpleDataGenerator();
  }

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

  // Get field label helper
  function getFieldLabel(field) {
    if (field.id) {
      const label = document.querySelector(`label[for="${field.id}"]`);
      if (label) return label.textContent.trim();
    }
    let parent = field.parentElement;
    while (parent && parent.tagName !== 'BODY') {
      if (parent.tagName === 'LABEL') {
        return parent.textContent.trim();
      }
      parent = parent.parentElement;
    }
    return '';
  }

  // Detect field type
  function detectFieldType(field) {
    const name = (field.name || '').toLowerCase();
    const id = (field.id || '').toLowerCase();
    const placeholder = (field.placeholder || '').toLowerCase();
    const label = getFieldLabel(field).toLowerCase();
    const type = (field.type || 'text').toLowerCase();
    const className = (field.className || '').toLowerCase();
    const combined = `${name} ${id} ${placeholder} ${label} ${className}`;

    if (type === 'email' || combined.includes('email')) return 'email';
    if (type === 'tel' || combined.includes('phone') || combined.includes('tel') || combined.includes('mobile')) return 'phone';
    if (type === 'password' || combined.includes('password')) return 'password';
    if (combined.includes('username') || combined.includes('user-name') || combined.includes('user_name') || combined.includes('login') || combined.includes('userid') || combined.includes('user_id')) return 'username';
    if (combined.includes('firstname') || combined.includes('first-name') || combined.includes('fname') || combined.includes('first_name')) return 'firstname';
    if (combined.includes('lastname') || combined.includes('last-name') || combined.includes('lname') || combined.includes('surname') || combined.includes('last_name')) return 'lastname';
    if (combined.includes('fullname') || combined.includes('full_name') || (combined.includes('name') && !combined.includes('user') && !combined.includes('company'))) return 'fullname';
    if (combined.includes('address') || combined.includes('street') || combined.includes('addr')) return 'address';
    if (combined.includes('city')) return 'city';
    if (combined.includes('state') || combined.includes('province')) return 'state';
    if (combined.includes('zip') || combined.includes('postal') || combined.includes('postcode')) return 'zip';
    if (combined.includes('country')) return 'country';
    if (type === 'date' || combined.includes('dob') || combined.includes('dateofbirth') || combined.includes('birth')) return 'date';
    if (combined.includes('card') || combined.includes('credit') || combined.includes('ccnumber')) return 'creditcard';
    if (combined.includes('cvv') || combined.includes('cvc') || combined.includes('security')) return 'cvv';
    if (combined.includes('expiry') || combined.includes('expiration') || combined.includes('expdate')) return 'expiry';
    if (combined.includes('ssn') || combined.includes('social')) return 'ssn';
    if (combined.includes('company') || combined.includes('organization')) return 'company';
    if (type === 'url' || combined.includes('website') || combined.includes('url')) return 'website';
    if (type === 'number' || type === 'range') return 'number';
    return 'unknown';
  }

  // Generate a password
  function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
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

  // Fill a single field using persona data
  function fillField(field, fieldType, persona, passwordValue = null) {
    if (!persona) return false;
    let value = '';

    switch(fieldType) {
      case 'email': value = persona.email; break;
      case 'phone': value = persona.phone; break;
      case 'firstname': value = persona.firstName; break;
      case 'lastname': value = persona.lastName; break;
      case 'fullname': value = persona.fullName; break;
      case 'username': value = persona.username; break;
      case 'address': value = persona.address; break;
      case 'city': value = persona.city; break;
      case 'state':
        if (field.tagName === 'SELECT') {
          const options = Array.from(field.options);
          const abbrMatch = options.find(opt => opt.value === persona.stateAbbr || opt.text.trim() === persona.stateAbbr);
          if (abbrMatch) { field.value = abbrMatch.value; triggerInputEvents(field); return true; }
          const nameMatch = options.find(opt => opt.value === persona.state || opt.text.trim() === persona.state);
          if (nameMatch) { field.value = nameMatch.value; triggerInputEvents(field); return true; }
          if (options.length > 1) {
            field.value = options[Math.floor(Math.random() * (options.length - 1)) + 1].value;
            triggerInputEvents(field);
            return true;
          }
        }
        value = persona.state;
        break;
      case 'zip': value = persona.zip; break;
      case 'country':
        if (field.tagName === 'SELECT') {
          const options = Array.from(field.options);
          const countryTerms = ['United States', 'US', 'USA', 'United States of America'];
          const match = options.find(opt => countryTerms.some(term => opt.value === term || opt.text.trim() === term));
          if (match) { field.value = match.value; triggerInputEvents(field); return true; }
          if (options.length > 1) {
            field.value = options[Math.floor(Math.random() * (options.length - 1)) + 1].value;
            triggerInputEvents(field);
            return true;
          }
        }
        value = persona.country;
        break;
      case 'date': value = persona.dob; break;
      case 'creditcard': value = persona.creditCard; break;
      case 'cvv': value = persona.cvv; break;
      case 'expiry':
        if (field.name && (field.name.includes('month') || field.name.includes('mon'))) {
          value = persona.expiryMonth;
        } else if (field.name && (field.name.includes('year') || field.name.includes('yr'))) {
          value = persona.expiryYear;
        } else {
          value = `${persona.expiryMonth}/${persona.expiryYear}`;
        }
        break;
      case 'ssn': value = persona.ssn; break;
      case 'company': value = persona.company; break;
      case 'website': value = persona.website; break;
      case 'password':
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
      default: value = `Sample Text ${Math.floor(Math.random() * 1000)}`;
    }

    if (field.tagName === 'SELECT') {
      const options = Array.from(field.options);
      const matchingOption = options.find(opt => opt.value === value || opt.text.includes(value));
      if (matchingOption) {
        field.value = matchingOption.value;
      } else if (options.length > 1) {
        const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
        field.value = options[randomIndex].value;
      }
    } else if (field.type === 'checkbox') {
      field.checked = Math.random() > 0.5;
    } else if (field.type === 'radio') {
      // Radio buttons handled at form level
      return true;
    } else {
      setNativeValue(field, value);
    }

    triggerInputEvents(field);
    return true;
  }

  // Trigger input events
  function triggerInputEvents(element) {
    ['input', 'change', 'blur'].forEach(eventType => {
      const event = new Event(eventType, { bubbles: true });
      element.dispatchEvent(event);
    });
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
      if (group.some(r => r.checked)) return;
      const pick = group[Math.floor(Math.random() * group.length)];
      pick.checked = true;
      triggerInputEvents(pick);
      count++;
    });
    return count;
  }

  const generator = window.dataGenerator;

  // Prevent form submission while filling
  const preventSubmitHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Temporarily disable all submit buttons
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
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', preventSubmitHandler, true);
  });

  // Fill all forms
  let filledCount = 0;

  forms.forEach(form => {
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

      // Skip already filled fields
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
  const standaloneRadios = document.body.querySelectorAll('input[type="radio"]');
  const standaloneGroups = {};
  standaloneRadios.forEach(radio => {
    if (radio.closest('form')) return;
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

  return { success: true, filledCount };
}
