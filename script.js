// -------------------------
// Theme Toggle
// -------------------------

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

updateThemeIcon();

themeToggle?.addEventListener("click", () => {

  const currentTheme =
    document.documentElement.getAttribute("data-theme");

  const newTheme =
    currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute(
    "data-theme",
    newTheme
  );

  localStorage.setItem("theme", newTheme);

  updateThemeIcon();

});

function updateThemeIcon() {

  const currentTheme =
    document.documentElement.getAttribute("data-theme");

  if (themeToggle) {
    themeToggle.textContent =
      currentTheme === "dark" ? "☀️" : "🌙";
  }

}

// -------------------------
// Study Schedule
// -------------------------

const studyForm = document.getElementById("studyForm");

studyForm?.addEventListener("submit", function (e) {

  e.preventDefault();

  const subject =
    document.getElementById("subject").value;

  const hours =
    document.getElementById("hours").value;

  const day =
    document.getElementById("day").value;

  const li = document.createElement("li");

  li.innerHTML = `
    <strong>${subject}</strong>
    <p>${hours} hour(s)</p>
  `;

  document.getElementById(day).appendChild(li);

  li.animate(
    [
      {
        opacity: 0,
        transform: "translateY(10px)"
      },
      {
        opacity: 1,
        transform: "translateY(0)"
      }
    ],
    {
      duration: 300,
      easing: "ease-out"
    }
  );

  studyForm.reset();

});

// -------------------------
// Save Summaries
// -------------------------

function saveSummary() {

  const title =
    document.getElementById("subjectTitle").value;

  const summary =
    document.getElementById("summaryText").value;

  const file =
    document.getElementById("pptFile").files[0];

  if (!title || !summary) {
    alert("Please fill all fields.");
    return;
  }

  const container =
    document.getElementById("summaryContainer");

  const card = document.createElement("div");

  card.classList.add("summary-card");

  card.innerHTML = `
    <h3>${title}</h3>
    <p><strong>File:</strong> ${
      file ? file.name : "No file uploaded"
    }</p>
    <p>${summary}</p>
  `;

  container.appendChild(card);

  card.animate(
    [
      {
        opacity: 0,
        transform: "translateY(10px)"
      },
      {
        opacity: 1,
        transform: "translateY(0)"
      }
    ],
    {
      duration: 350,
      easing: "ease-out"
    }
  );

  document.getElementById("subjectTitle").value = "";
  document.getElementById("summaryText").value = "";
  document.getElementById("pptFile").value = "";

}
// =========================
// PYTHON LAB
// =========================

let pyodide;

let editor;

// Initialize Editor

const editorElement =
  document.getElementById("codeEditor");

if (editorElement) {

  editor = CodeMirror.fromTextArea(editorElement, {

    mode: "python",

    theme:
      document.documentElement.getAttribute("data-theme")
      === "dark"
      ? "material-darker"
      : "default",

    lineNumbers: true,

    indentUnit: 4,

    tabSize: 4,

    autoCloseBrackets: true,

    lineWrapping: true

  });

}

// Load Pyodide

async function loadPyodideAndPackages() {

  pyodide = await loadPyodide();

  const output =
    document.getElementById("output");

  if (output) {
    output.textContent =
      "Python environment ready.";
  }

}

if (editorElement) {
  loadPyodideAndPackages();
}

// Run Code

const runButton =
  document.getElementById("runCode");

runButton?.addEventListener(
  "click",
  async () => {

    const output =
      document.getElementById("output");

    output.innerHTML =
      "Running code...";

    try {

      let code =
        editor.getValue();

      pyodide.setStdout({

        batched: (text) => {

          output.innerHTML =
            `<span class="success-text">${text}</span>`;

        }

      });

      pyodide.setStderr({

        batched: (text) => {

          output.innerHTML =
            `<span class="error-text">${text}</span>`;

        }

      });

      await pyodide.runPythonAsync(code);

    }

    catch (err) {

      output.innerHTML =
        `<span class="error-text">${err}</span>`;

    }

  }
);

// Clear Code

const clearButton =
  document.getElementById("clearCode");

clearButton?.addEventListener(
  "click",
  () => {

    editor.setValue("");

    document.getElementById("output")
      .textContent = "Editor cleared.";

  }
);

// Update Theme For CodeMirror

function updateEditorTheme() {

  if (!editor) return;

  const currentTheme =
    document.documentElement.getAttribute(
      "data-theme"
    );

  editor.setOption(
    "theme",
    currentTheme === "dark"
      ? "material-darker"
      : "default"
  );

}

themeToggle?.addEventListener(
  "click",
  updateEditorTheme
);