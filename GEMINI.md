I am building a React-based image analyzing tool that already has the basic functionality to analyze uploaded images and provide UI/UX feedback. Now I want to add another functionality:

There should be a toggle button labeled “Website” (with an icon next to it).

When the user clicks this button, it should highlight (to show it is selected).

When this button is selected, instead of the usual file input for choosing an image, the input field should change to a URL input field where the user can paste a website link.

When a user pastes a valid website URL, the code should:

Access the website.

Take a full-page screenshot of the website.

Display/preview that screenshot inside a new <div> or section, right below the URL input.

After that, when the user clicks on the “Evaluate” button, the main functionality (that already analyzes images) should trigger.

This time, it should analyze the screenshot of the website instead of an uploaded image.

The results (design analysis/feedback) should be displayed below the preview, just like it currently works for uploaded images.

Requirements for the code:

The code should be written entirely in React JSX.

It should be clean, modular, and easy to read.

Make sure to handle cases where the URL is invalid or the screenshot fails.

Use modern React practices (hooks, functional components).

The screenshot capturing can be done using any library/API (for example: html2canvas, puppeteer with a backend API, or a free screenshot API). Just integrate it in a way that works in React JSX.

So in summary:
👉 If the user selects “Upload Image” → normal flow (already implemented).
👉 If the user selects “Website” → show URL input → fetch & preview full-page screenshot → pass screenshot to evaluation system.

Generate the full React JSX code for this functionality.