// Realistic data generator for form filling
// Prevent re-declaration if already loaded
if (!window.dataGenerator) {
  class RealisticDataGenerator {
  constructor() {
    this.firstNames = [
      'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
      'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
      'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
      'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
      'Steven', 'Kimberly', 'Andrew', 'Emily', 'Paul', 'Donna', 'Joshua', 'Michelle',
      'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
      'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Jason', 'Rebecca', 'Edward', 'Sharon',
      'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
      'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Brenda',
      'Larry', 'Pamela', 'Justin', 'Emma', 'Scott', 'Nicole', 'Brandon', 'Helen',
      'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Gregory', 'Christine', 'Alexander', 'Debra'
    ];

    this.lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
      'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez',
      'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
      'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
      'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
      'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards',
      'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers',
      'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly',
      'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
      'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
      'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross'
    ];

    this.streetNames = [
      'Main', 'Park', 'Oak', 'Maple', 'Cedar', 'Elm', 'Washington', 'Lincoln',
      'Jefferson', 'Madison', 'Jackson', 'Church', 'High', 'Broad', 'Market',
      'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Lake', 'River',
      'Hill', 'Green', 'Spring', 'Summer', 'Sunset', 'Sunrise', 'Valley', 'Creek',
      'Forest', 'Garden', 'Meadow', 'Ridge', 'Willow', 'Dogwood', 'Birch', 'Pine'
    ];

    this.streetSuffixes = ['Street', 'Avenue', 'Road', 'Drive', 'Lane', 'Circle', 'Court', 'Place', 'Way'];

    // City-to-state mapping for geographically coherent addresses
    this.cityStateMap = [
      { city: 'New York', state: 'New York', abbr: 'NY', zipPrefix: '100' },
      { city: 'Los Angeles', state: 'California', abbr: 'CA', zipPrefix: '900' },
      { city: 'Chicago', state: 'Illinois', abbr: 'IL', zipPrefix: '606' },
      { city: 'Houston', state: 'Texas', abbr: 'TX', zipPrefix: '770' },
      { city: 'Phoenix', state: 'Arizona', abbr: 'AZ', zipPrefix: '850' },
      { city: 'Philadelphia', state: 'Pennsylvania', abbr: 'PA', zipPrefix: '191' },
      { city: 'San Antonio', state: 'Texas', abbr: 'TX', zipPrefix: '782' },
      { city: 'San Diego', state: 'California', abbr: 'CA', zipPrefix: '921' },
      { city: 'Dallas', state: 'Texas', abbr: 'TX', zipPrefix: '752' },
      { city: 'San Jose', state: 'California', abbr: 'CA', zipPrefix: '951' },
      { city: 'Austin', state: 'Texas', abbr: 'TX', zipPrefix: '787' },
      { city: 'Jacksonville', state: 'Florida', abbr: 'FL', zipPrefix: '322' },
      { city: 'Fort Worth', state: 'Texas', abbr: 'TX', zipPrefix: '761' },
      { city: 'Columbus', state: 'Ohio', abbr: 'OH', zipPrefix: '432' },
      { city: 'Charlotte', state: 'North Carolina', abbr: 'NC', zipPrefix: '282' },
      { city: 'San Francisco', state: 'California', abbr: 'CA', zipPrefix: '941' },
      { city: 'Indianapolis', state: 'Indiana', abbr: 'IN', zipPrefix: '462' },
      { city: 'Seattle', state: 'Washington', abbr: 'WA', zipPrefix: '981' },
      { city: 'Denver', state: 'Colorado', abbr: 'CO', zipPrefix: '802' },
      { city: 'Washington', state: 'District of Columbia', abbr: 'DC', zipPrefix: '200' },
      { city: 'Boston', state: 'Massachusetts', abbr: 'MA', zipPrefix: '021' },
      { city: 'El Paso', state: 'Texas', abbr: 'TX', zipPrefix: '799' },
      { city: 'Detroit', state: 'Michigan', abbr: 'MI', zipPrefix: '482' },
      { city: 'Nashville', state: 'Tennessee', abbr: 'TN', zipPrefix: '372' },
      { city: 'Portland', state: 'Oregon', abbr: 'OR', zipPrefix: '972' },
      { city: 'Oklahoma City', state: 'Oklahoma', abbr: 'OK', zipPrefix: '731' },
      { city: 'Las Vegas', state: 'Nevada', abbr: 'NV', zipPrefix: '891' },
      { city: 'Memphis', state: 'Tennessee', abbr: 'TN', zipPrefix: '381' },
      { city: 'Louisville', state: 'Kentucky', abbr: 'KY', zipPrefix: '402' },
      { city: 'Baltimore', state: 'Maryland', abbr: 'MD', zipPrefix: '212' },
      { city: 'Milwaukee', state: 'Wisconsin', abbr: 'WI', zipPrefix: '532' },
      { city: 'Albuquerque', state: 'New Mexico', abbr: 'NM', zipPrefix: '871' },
      { city: 'Tucson', state: 'Arizona', abbr: 'AZ', zipPrefix: '857' },
      { city: 'Fresno', state: 'California', abbr: 'CA', zipPrefix: '937' },
      { city: 'Sacramento', state: 'California', abbr: 'CA', zipPrefix: '958' },
      { city: 'Kansas City', state: 'Missouri', abbr: 'MO', zipPrefix: '641' },
      { city: 'Mesa', state: 'Arizona', abbr: 'AZ', zipPrefix: '852' },
      { city: 'Atlanta', state: 'Georgia', abbr: 'GA', zipPrefix: '303' },
      { city: 'Omaha', state: 'Nebraska', abbr: 'NE', zipPrefix: '681' },
      { city: 'Colorado Springs', state: 'Colorado', abbr: 'CO', zipPrefix: '809' },
      { city: 'Raleigh', state: 'North Carolina', abbr: 'NC', zipPrefix: '276' },
      { city: 'Virginia Beach', state: 'Virginia', abbr: 'VA', zipPrefix: '234' },
      { city: 'Miami', state: 'Florida', abbr: 'FL', zipPrefix: '331' },
      { city: 'Oakland', state: 'California', abbr: 'CA', zipPrefix: '946' },
      { city: 'Minneapolis', state: 'Minnesota', abbr: 'MN', zipPrefix: '554' },
      { city: 'Tulsa', state: 'Oklahoma', abbr: 'OK', zipPrefix: '741' },
      { city: 'Cleveland', state: 'Ohio', abbr: 'OH', zipPrefix: '441' },
      { city: 'Wichita', state: 'Kansas', abbr: 'KS', zipPrefix: '672' },
      { city: 'Arlington', state: 'Texas', abbr: 'TX', zipPrefix: '760' }
    ];

    this.states = [
      { name: 'Alabama', abbr: 'AL' }, { name: 'Alaska', abbr: 'AK' },
      { name: 'Arizona', abbr: 'AZ' }, { name: 'Arkansas', abbr: 'AR' },
      { name: 'California', abbr: 'CA' }, { name: 'Colorado', abbr: 'CO' },
      { name: 'Connecticut', abbr: 'CT' }, { name: 'Delaware', abbr: 'DE' },
      { name: 'Florida', abbr: 'FL' }, { name: 'Georgia', abbr: 'GA' },
      { name: 'Hawaii', abbr: 'HI' }, { name: 'Idaho', abbr: 'ID' },
      { name: 'Illinois', abbr: 'IL' }, { name: 'Indiana', abbr: 'IN' },
      { name: 'Iowa', abbr: 'IA' }, { name: 'Kansas', abbr: 'KS' },
      { name: 'Kentucky', abbr: 'KY' }, { name: 'Louisiana', abbr: 'LA' },
      { name: 'Maine', abbr: 'ME' }, { name: 'Maryland', abbr: 'MD' },
      { name: 'Massachusetts', abbr: 'MA' }, { name: 'Michigan', abbr: 'MI' },
      { name: 'Minnesota', abbr: 'MN' }, { name: 'Mississippi', abbr: 'MS' },
      { name: 'Missouri', abbr: 'MO' }, { name: 'Montana', abbr: 'MT' },
      { name: 'Nebraska', abbr: 'NE' }, { name: 'Nevada', abbr: 'NV' },
      { name: 'New Hampshire', abbr: 'NH' }, { name: 'New Jersey', abbr: 'NJ' },
      { name: 'New Mexico', abbr: 'NM' }, { name: 'New York', abbr: 'NY' },
      { name: 'North Carolina', abbr: 'NC' }, { name: 'North Dakota', abbr: 'ND' },
      { name: 'Ohio', abbr: 'OH' }, { name: 'Oklahoma', abbr: 'OK' },
      { name: 'Oregon', abbr: 'OR' }, { name: 'Pennsylvania', abbr: 'PA' },
      { name: 'Rhode Island', abbr: 'RI' }, { name: 'South Carolina', abbr: 'SC' },
      { name: 'South Dakota', abbr: 'SD' }, { name: 'Tennessee', abbr: 'TN' },
      { name: 'Texas', abbr: 'TX' }, { name: 'Utah', abbr: 'UT' },
      { name: 'Vermont', abbr: 'VT' }, { name: 'Virginia', abbr: 'VA' },
      { name: 'Washington', abbr: 'WA' }, { name: 'West Virginia', abbr: 'WV' },
      { name: 'Wisconsin', abbr: 'WI' }, { name: 'Wyoming', abbr: 'WY' }
    ];

    this.emailDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
      'aol.com', 'protonmail.com', 'mail.com', 'msn.com', 'live.com'
    ];

    this.companySuffixes = ['Inc', 'LLC', 'Corp', 'Ltd', 'Co', 'Group', 'Solutions', 'Services'];
    this.companyNames = [
      'Tech', 'Global', 'Digital', 'Advanced', 'Smart', 'Future', 'Modern',
      'Innovative', 'Creative', 'Dynamic', 'Prime', 'Elite', 'Premium', 'Pro'
    ];
  }

  random(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateFirstName() {
    return this.random(this.firstNames);
  }

  generateLastName() {
    return this.random(this.lastNames);
  }

  generateFullName() {
    return `${this.generateFirstName()} ${this.generateLastName()}`;
  }

  generateEmail(firstName = null, lastName = null) {
    const first = (firstName || this.generateFirstName()).toLowerCase();
    const last = (lastName || this.generateLastName()).toLowerCase();
    const numbers = this.randomNumber(100, 9999);
    const domain = this.random(this.emailDomains);
    return `${first}.${last}${numbers}@${domain}`;
  }

  generateUsername(firstName = null, lastName = null) {
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

  generatePhoneNumber() {
    const areaCode = this.randomNumber(200, 999);
    const exchange = this.randomNumber(200, 999);
    const number = this.randomNumber(1000, 9999);
    return `(${areaCode}) ${exchange}-${number}`;
  }

  generateStreetAddress() {
    const number = this.randomNumber(100, 9999);
    const street = this.random(this.streetNames);
    const suffix = this.random(this.streetSuffixes);
    return `${number} ${street} ${suffix}`;
  }

  generateCity() {
    return this.random(this.cityStateMap).city;
  }

  generateState(abbr = false) {
    const state = this.random(this.states);
    return abbr ? state.abbr : state.name;
  }

  generateZipCode() {
    return this.randomNumber(10000, 99999).toString();
  }

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

  generateAddress() {
    return this.generateCoherentAddress();
  }

  generateDateOfBirth() {
    const year = this.randomNumber(1970, 2005);
    const month = String(this.randomNumber(1, 12)).padStart(2, '0');
    const day = String(this.randomNumber(1, 28)).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  generateCompany() {
    const prefix = this.random(this.companyNames);
    const suffix = this.random(this.companySuffixes);
    return `${prefix} ${suffix}`;
  }

  generateCreditCard() {
    // Generate a valid-looking but fake credit card number (Luhn algorithm pattern)
    const cardTypes = [
      { prefix: '4', length: 16, name: 'Visa' },
      { prefix: '5', length: 16, name: 'Mastercard' }
    ];
    const type = this.random(cardTypes);
    let number = type.prefix;
    for (let i = 1; i < type.length - 1; i++) {
      number += this.randomNumber(0, 9);
    }
    // Simple Luhn check digit
    number += this.randomNumber(0, 9);

    const currentYear = new Date().getFullYear();
    return {
      number: number,
      type: type.name,
      cvv: this.randomNumber(100, 999).toString(),
      expiryMonth: String(this.randomNumber(1, 12)).padStart(2, '0'),
      expiryYear: String(this.randomNumber(currentYear + 1, currentYear + 5))
    };
  }

  generateSSN() {
    // Format: XXX-XX-XXXX (but don't use real ones!)
    const part1 = this.randomNumber(100, 999);
    const part2 = this.randomNumber(10, 99);
    const part3 = this.randomNumber(1000, 9999);
    return `${part1}-${part2}-${part3}`;
  }

  generateWebsite() {
    const domains = ['example.com', 'demo.com', 'test.com', 'sample.org'];
    const protocol = this.random(['http://', 'https://']);
    const subdomain = this.random(['www.', '']);
    return `${protocol}${subdomain}${this.random(domains)}`;
  }

  generatePersona() {
    const firstName = this.generateFirstName();
    const lastName = this.generateLastName();
    const address = this.generateCoherentAddress();
    const card = this.generateCreditCard();
    return {
      firstName,
      lastName,
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

  // Make it available globally
  window.dataGenerator = new RealisticDataGenerator();
}
