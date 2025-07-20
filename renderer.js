
// Working code 1.

// let originalPost = "";
// const chatBox = document.getElementById("chat");

// function appendMessage(text, sender = "bot") {
//   const msg = document.createElement("div");
//   msg.className = `message ${sender}`;
//   msg.innerText = text;
//   chatBox.appendChild(msg);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

// async function sendMessage() {
//   const input = document.getElementById("followup");
//   const message = input.value.trim();
//   if (!message) return;

//   appendMessage(message, "user");

//   if (!originalPost) originalPost = message;

//   input.value = "";

//   appendMessage("💬 Cooking.....", "bot");

//   try {
//     const res = await fetch("http://localhost:3001/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         original: originalPost,
//         query: message
//       })
//     });

//     const data = await res.json();
//     // Remove "Thinking..." and replace with real response
//     chatBox.removeChild(chatBox.lastChild);
//     appendMessage(data.reply || "⚠️ No reply found.", "bot");
//   } catch (err) {
//     chatBox.removeChild(chatBox.lastChild);
//     appendMessage("❌ Failed to connect to backend.", "bot");
//   }
// }

// async function handleAuth(mode) {
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();

//   if (!email || !password) return alert("Please fill both fields.");

//   try {
//     const res = await fetch(`http://localhost:3001/${mode}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });

//     const data = await res.json();
//     if (data.success) {
//       document.getElementById("auth-screen").style.display = "none";
//       document.getElementById("chat-screen").style.display = "flex";
//     } else {
//       alert(data.message || "Auth failed");
//     }
//   } catch (err) {
//     alert("Server error: " + err.message);
//   }
// }


// Working code 2.

let originalPost = "";
const chatBox = document.getElementById("chat");

// function appendMessage(text, sender = "bot") {
//   const msg = document.createElement("div");
//   msg.className = `message ${sender}`;

//   if (sender === "bot") {
//     const lines = text.split("\n").filter(line => line.trim() !== "");
//     lines.forEach((line, idx) => {
//       const part = document.createElement("div");
//       if (line.startsWith("**") && line.endsWith("**")) {
//         part.innerHTML = `<strong>${line.replace(/\*\*/g, "")}</strong>`;
//       } else {
//         part.innerHTML = `• ${line}`;
//       }
//       msg.appendChild(part);
//     });
//   } else {
//     msg.innerText = text;
//   }

//   chatBox.appendChild(msg);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

function appendMessage(text, sender = "bot") {
  const lines = text.split("\n").filter(line => line.trim() !== "");
  const msgWrapper = document.createElement("div");
  msgWrapper.className = `message ${sender}`;

  if (sender === "bot") {
    

    // lines.forEach((line, idx) => {
    //   setTimeout(() => {
    //     const lineEl = document.createElement("div");
    //     lineEl.style.marginBottom = "0.5rem"; // spacing between lines

    //     // if (line.startsWith("**") && line.endsWith("**")) {
    //     //   lineEl.innerHTML = `<strong style="font-size: 1rem;">${line.replace(/\*\*/g, "")}</strong>`;
    //     // } else {
    //     //   lineEl.innerHTML = `• ${line}`;
    //     // }

    //     if (/^\*\*.+:\*\*$/.test(line.trim())) {
    //       // Section heading
    //       const headingText = line.replace(/\*\*/g, "").replace(/:$/, "");
    //       lineEl.innerHTML = `<strong style="color: #00ffff; font-size: 1.05rem;">${headingText}</strong>`;
    //       lineEl.style.marginBottom = "0.6rem";
    //     } else {
    //       // Bullet point
    //       lineEl.innerHTML = `• ${line}`;
    //     }
        

    //     msgWrapper.appendChild(lineEl);
    //     chatBox.scrollTop = chatBox.scrollHeight;
    //   }, delay);

    //   delay += 300; // ⏱ 300ms delay between each line
    // });

    let delay = 0;
    lines.forEach(line => {
      const lineEl = document.createElement("div");
      lineEl.style.marginBottom = "0.6rem";
    
      // Check if it's a heading (like: **Why it works:**)
      if (/^\*\*.+:\*\*$/.test(line.trim())) {
        const headingText = line.replace(/\*\*/g, "").replace(/:$/, "");
        lineEl.innerHTML = `<strong style="color: #00ffff; font-size: 1.05rem;">${headingText}</strong>`;
      } 
      // Check if it's a bullet line with ** inside it
      else if (/^\s*[\-*•]?\s*\*{0,1}\s*\*{2}(.+?)\*{2}/.test(line.trim())) {
        // Remove *, ** and leading bullet if any
        const cleanText = line
          .replace(/^[\s\-•*]*\*?\s*\*\*(.+?)\*\*/, '$1')  // extract the bolded part
          .replace(/^\s*[\-*•]?\s*/, '')                  // remove starting bullet again if needed
          .trim();
    
        lineEl.innerHTML = `🧠 <span style="color: #e0e0e0;">${cleanText}</span>`;
      } 
      else {
        // Normal bullet or plain line
        lineEl.innerHTML = `• ${line}`;
      }
    
      chatBox.appendChild(lineEl);
    });
    
  } else {
    msgWrapper.textContent = text;
  }

  chatBox.appendChild(msgWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}


async function sendMessage() {
  const input = document.getElementById("followup");
  const message = input.value.trim();
  if (!message) return;

  appendMessage(message, "user");

  if (!originalPost) originalPost = message;

  input.value = "";

  // show loading
  const thinking = document.createElement("div");
  thinking.className = "message bot thinking";
  thinking.innerText = "💬 Cooking...";
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original: originalPost,
        query: message
      })
    });

    const data = await res.json();

    chatBox.removeChild(thinking);
    appendMessage(data.reply || "⚠️ No reply found.", "bot");
  } catch (err) {
    chatBox.removeChild(thinking);
    appendMessage("❌ Failed to connect to backend.", "bot");
  }
}

async function handleAuth(mode) {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("Please fill both fields.");

  try {
    const res = await fetch(`http://localhost:3001/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById("auth-screen").style.display = "none";
      document.getElementById("chat-screen").style.display = "flex";
    } else {
      alert(data.message || "Auth failed");
    }
  } catch (err) {
    alert("Server error: " + err.message);
  }
}
