// Toggle Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu').querySelector('ul');
hamburger.addEventListener('click', function(e) {
  e.stopPropagation();
  navMenu.classList.toggle('active');
});
// Close hamburger if clicking outside
document.addEventListener('click', function(e) {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    navMenu.classList.remove('active');
  }
});

// Close modal when clicking outside modal content
window.addEventListener('click', function(e) {
  const modal = document.getElementById('resultModal');
  if (e.target === modal) {
    closeModal();
  }
});

// Keyboard navigation: Cycle through inputs on Enter press
const inputs = document.querySelectorAll('#marksForm input[type="number"]');
inputs.forEach((input, index) => {
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else {
        document.getElementById('marksForm').dispatchEvent(new Event('submit'));
      }
    }
  });
});

// Remove error highlighting when user types
inputs.forEach(input => {
  input.addEventListener('input', function() {
    input.classList.remove('error-field');
  });
});

// Error message display
function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.innerText = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 3000);
}

// Form submission handler
document.getElementById('marksForm').addEventListener('submit', function(e) {
  e.preventDefault();
  calculatePercentage();
});

function calculatePercentage() {
  try {
    // Clear error styles
    inputs.forEach(input => input.classList.remove('error-field'));

    // Helper: Retrieve and validate mark (max 100)
    const getMark = id => {
      const inputElem = document.getElementById(id);
      const value = parseFloat(inputElem.value);
      if (isNaN(value)) {
        inputElem.classList.add('error-field');
        throw new Error("All marks are compulsory.");
      }
      if (value > 100) {
        inputElem.classList.add('error-field');
        throw new Error("Marks cannot exceed 100.");
      }
      return value;
    };

    // English: average of English Language and Literature
    const engLang = getMark('engLang');
    const engLit = getMark('engLit');
    const english = (engLang + engLit) / 2;

    // Science: average of Physics, Chemistry, and Biology
    const physics = getMark('physics');
    const chemistry = getMark('chemistry');
    const biology = getMark('biology');
    const science = (physics + chemistry + biology) / 3;

    // Social Science: average of History & Civics and Geography
    const history = getMark('history');
    const geography = getMark('geography');
    const social = (history + geography) / 2;

    // Single-input subjects
    const math = getMark('math');
    const optional = getMark('optional');
    const secondLang = getMark('secondLang');

    // Apply new rule: Between Math and Science, consider only the higher value
    const mathOrScience = (math > science ? math : science);
    const mathOrScienceLabel = (math > science ? "Mathematics" : "Science");

    // Build overall subject results (5 subjects)
    const subjectResults = [
      { name: "English", percentage: english },
      { name: mathOrScienceLabel, percentage: mathOrScience },
      { name: "Social Science", percentage: social },
      { name: "Optional Subject", percentage: optional },
      { name: "Second Language", percentage: secondLang }
    ];

    // Overall percentage = average of these 5 subjects
    const overallPercentage = subjectResults.reduce((sum, s) => sum + s.percentage, 0) / subjectResults.length;

    // Friendly Grade mapping
    function getGrade(mark) {
      if (mark >= 91) return "Excellent";
      else if (mark >= 81) return "Attractive";
      else if (mark >= 71) return "Unique";
      else if (mark >= 61) return "Good";
      else if (mark >= 51) return "Average";
      else if (mark >= 41) return "Mediocre";
      else if (mark >= 33) return "Poor";
      else return "Very Poor";
    }

    // Build results table rows
    let resultBodyHTML = "";
    subjectResults.forEach(s => {
      resultBodyHTML += `<tr>
          <td>${s.name}</td>
          <td>${s.percentage.toFixed(2)}%</td>
          <td>${getGrade(s.percentage)}</td>
        </tr>`;
    });
    document.getElementById('resultBody').innerHTML = resultBodyHTML;
    document.getElementById('overallResult').innerText =
      `Overall Percentage: ${overallPercentage.toFixed(2)}% - Grade: ${getGrade(overallPercentage)}`;
    
    openModal();
  } catch (error) {
    showError(error.message);
  }
}

// Modal functionality
function openModal() {
  document.getElementById('resultModal').style.display = 'block';
}
function closeModal() {
  document.getElementById('resultModal').style.display = 'none';
}
document.getElementById('closeModal').addEventListener('click', closeModal);
