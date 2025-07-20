document.getElementById("toggle-auth").addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.getElementById("auth-form");
    const toggle = document.getElementById("toggle-auth");
  
    if (toggle.textContent === "Sign up") {
      toggle.textContent = "Log in";
      form.querySelector("button").textContent = "Sign Up";
      document.getElementById("switch").innerHTML = `Already have an account? <a href="#" id="toggle-auth">Log in</a>`;
    } else {
      toggle.textContent = "Sign up";
      form.querySelector("button").textContent = "Continue";
      document.getElementById("switch").innerHTML = `Don't have an account? <a href="#" id="toggle-auth">Sign up</a>`;
    }
  });
  