// Popup script
document.addEventListener('DOMContentLoaded', () => {
  const fillBtn = document.getElementById('fillBtn');
  const status = document.getElementById('status');

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
      random(items) { return items[Math.floor(Math.random() * items.length)]; }
      randomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
      generateFirstName() { return this.random(['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary']); }
      generateLastName() { return this.random(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']); }
      generateFullName() { return `${this.generateFirstName()} ${this.generateLastName()}`; }
      generateEmail() { return `${this.generateFirstName().toLowerCase()}.${this.generateLastName().toLowerCase()}${this.randomNumber(100,999)}@example.com`; }
      generatePhoneNumber() { return `(${this.randomNumber(200,999)}) ${this.randomNumber(200,999)}-${this.randomNumber(1000,9999)}`; }
      generateStreetAddress() { return `${this.randomNumber(100,9999)} ${this.random(['Main', 'Oak', 'Park', 'Maple', 'Cedar'])} Street`; }
      generateCity() { return this.random(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio']); }
      generateState(abbr) { return abbr ? 'CA' : 'California'; }
      generateZipCode() { return this.randomNumber(10000, 99999).toString(); }
      generateDateOfBirth() { return `${this.randomNumber(1970,2000)}-${String(this.randomNumber(1,12)).padStart(2,'0')}-${String(this.randomNumber(1,28)).padStart(2,'0')}`; }
      generateWebsite() {
        const domains = ['example.com', 'demo.com', 'test.com', 'sample.org'];
        const protocol = this.random(['http://', 'https://']);
        const subdomain = this.random(['www.', '']);
        return `${protocol}${subdomain}${this.random(domains)}`;
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
    const combined = `${name} ${id} ${placeholder} ${label} ${className} ${type}`;
    
    if (type === 'email' || combined.includes('email')) return 'email';
    if (type === 'tel' || combined.includes('phone') || combined.includes('tel') || combined.includes('mobile')) return 'phone';
    if (type === 'password' || combined.includes('password')) return 'password';
    if (combined.includes('firstname') || combined.includes('first-name') || combined.includes('fname')) return 'firstname';
    if (combined.includes('lastname') || combined.includes('last-name') || combined.includes('lname') || combined.includes('surname')) return 'lastname';
    if (combined.includes('fullname') || (combined.includes('name') && !combined.includes('user') && !combined.includes('company'))) return 'fullname';
    if (combined.includes('address') || combined.includes('street') || combined.includes('addr')) return 'address';
    if (combined.includes('city')) return 'city';
    if (combined.includes('state') || combined.includes('province')) return 'state';
    if (combined.includes('zip') || combined.includes('postal') || combined.includes('postcode')) return 'zip';
    if (combined.includes('country')) return 'country';
    if (type === 'date' || combined.includes('dob') || combined.includes('dateofbirth') || combined.includes('birth')) return 'date';
    if (combined.includes('card') || combined.includes('credit') || combined.includes('ccnumber')) return 'creditcard';
    if (combined.includes('cvv') || combined.includes('cvc')) return 'cvv';
    if (combined.includes('company') || combined.includes('organization')) return 'company';
    if (type === 'url' || combined.includes('website') || combined.includes('url')) return 'website';
    return 'unknown';
  }

  // Fill a single field
  function fillField(field, fieldType) {
    if (!window.dataGenerator) return false;
    const gen = window.dataGenerator;
    let value = '';
    
    switch(fieldType) {
      case 'email': value = gen.generateEmail(); break;
      case 'phone': value = gen.generatePhoneNumber(); break;
      case 'firstname': value = gen.generateFirstName(); break;
      case 'lastname': value = gen.generateLastName(); break;
      case 'fullname': value = gen.generateFullName(); break;
      case 'address': value = gen.generateStreetAddress(); break;
      case 'city': value = gen.generateCity(); break;
      case 'state': 
        if (field.tagName === 'SELECT') {
          const options = Array.from(field.options);
          if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
            field.value = options[randomIndex].value;
            triggerInputEvents(field);
            return true;
          }
        }
        value = gen.generateState(false); 
        break;
      case 'zip': value = gen.generateZipCode(); break;
      case 'country': value = 'United States'; break;
      case 'date': value = gen.generateDateOfBirth(); break;
      case 'website': value = gen.generateWebsite(); break;
      case 'password': 
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        value = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        break;
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
      field.checked = true;
    } else {
      field.value = value;
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
  const allFields = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
  
  allFields.forEach(field => {
    // Skip search fields
    if (isSearchField(field)) {
      return;
    }
    
    // Skip if already has a value
    if (field.value && field.value.trim() !== '') return;
    
    const fieldType = detectFieldType(field);
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

  return { success: true, filledCount };
}

