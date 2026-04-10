// ===============================
// FORM VALIDATION + UX
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    const input = document.querySelector("input[name='restaurant']");
    const button = document.querySelector(".btn");

    if (form) {
        form.addEventListener("submit", function (e) {

            let value = input.value.trim();

            // ❌ Empty input
            if (value === "") {
                alert("Please enter a restaurant name");
                e.preventDefault();
                return;
            }

            // ❌ Too short input
            if (value.length < 2) {
                alert("Enter at least 2 characters");
                e.preventDefault();
                return;
            }

            // ✅ Show loading state
            if (button) {
                button.innerText = "Loading...";
                button.disabled = true;
            }

        });
    }

});