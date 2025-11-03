// Realistic data generator for form filling
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
      'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Park', 'Lake', 'River',
      'Hill', 'Green', 'Spring', 'Summer', 'Sunset', 'Sunrise', 'Valley', 'Creek',
      'Forest', 'Garden', 'Meadow', 'Ridge', 'Boulevard', 'Drive', 'Avenue', 'Street',
      'Road', 'Lane', 'Circle', 'Court', 'Place', 'Way', 'Terrace', 'Trail'
    ];

    this.cities = [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
      'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
      'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis',
      'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Detroit', 'Nashville',
      'Portland', 'Oklahoma City', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore',
      'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Kansas City',
      'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs', 'Raleigh', 'Virginia Beach',
      'Miami', 'Oakland', 'Minneapolis', 'Tulsa', 'Cleveland', 'Wichita', 'Arlington'
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
    const first = firstName || this.generateFirstName().toLowerCase();
    const last = lastName || this.generateLastName().toLowerCase();
    const numbers = this.randomNumber(100, 9999);
    const domain = this.random(this.emailDomains);
    return `${first}.${last}${numbers}@${domain}`;
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
    const suffix = this.random(['Street', 'Avenue', 'Road', 'Drive', 'Lane', 'Circle', 'Court', 'Place', 'Way']);
    return `${number} ${street} ${suffix}`;
  }

  generateCity() {
    return this.random(this.cities);
  }

  generateState(abbr = false) {
    const state = this.random(this.states);
    return abbr ? state.abbr : state.name;
  }

  generateZipCode() {
    return this.randomNumber(10000, 99999).toString();
  }

  generateAddress() {
    return {
      street: this.generateStreetAddress(),
      city: this.generateCity(),
      state: this.generateState(),
      stateAbbr: this.generateState(true),
      zip: this.generateZipCode()
    };
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
    return {
      number: number,
      type: type.name,
      cvv: this.randomNumber(100, 999).toString(),
      expiryMonth: String(this.randomNumber(1, 12)).padStart(2, '0'),
      expiryYear: String(this.randomNumber(2025, 2030))
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
}

// Make it available globally
window.dataGenerator = new RealisticDataGenerator();

