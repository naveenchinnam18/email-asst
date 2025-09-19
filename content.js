// function getSelectedText() {
//     try {
//         const selection = window.getSelection();
//         if (selection && selection.toString().trim() !== "") {
//             return selection.toString().trim();
//         }
//     } catch (e) {
//         console.warn("Could not get selected text:", e);
//     }
//     return null;
// }

// function getEmailContent() {
//     const selected = getSelectedText();
//     console.log("🔍 Selected text:", selected);

//     if (selected) {
//         console.log("✅ Using selected text as email content.");
//         return selected;
//     }

//     const el = document.querySelector('.a3s.aiL');
//     if (el) {
//         const fullText = el.innerText.trim();
//         console.log("✅ Using full email body content.");
//         console.log(fullText);
//         return fullText;
//     }

//     console.warn("❌ Could not find any email content.");
//     return null;
// }

// function insertReplyIntoComposeBox(replyText) {
//     const composeBox = document.querySelector('[aria-label="Message Body"]');
//     if (composeBox) {
//         console.log("✅ Detected Gmail compose window.");
//         composeBox.focus();
//         document.execCommand('insertText', false, replyText);
//         console.log("✅ Reply inserted into compose box.");
//     } else {
//         console.warn("❌ Compose box not found.");
//     }
// }

// async function handleAIReplyClick(tone) {
//     const emailContent = getEmailContent();
//     if (!emailContent) {
//         alert("Could not extract email content.");
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:8080/api/email/generate", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 mailContent: emailContent,
//                 tone: tone
//             })
//         });

//         const replyText = await response.text();
//         insertReplyIntoComposeBox(replyText);
//     } catch (error) {
//         console.error("❌ Error calling backend:", error);
//     }
// }

// function addAIReplyButton() {
//     const toolbar = document.querySelector('[aria-label="Formatting options"]');
//     if (!toolbar || document.querySelector("#ai-reply-button") || document.querySelector("#tone-dropdown")) return;

//     // 🔽 Tone Dropdown
//     const toneDropdown = document.createElement("select");
//     toneDropdown.id = "tone-dropdown";

//     Object.assign(toneDropdown.style, {
//         marginRight: "8px",
//         padding: "6px 10px",
//         borderRadius: "6px",
//         border: "1px solid #d2e3fc",
//         backgroundColor: "#f1f3f4",
//         fontSize: "14px",
//         color: "#202124",
//         cursor: "pointer",
//         boxShadow: "0 1px 2px rgba(60,64,67,.1)",
//         outline: "none",
//         appearance: "none"
//     });

//     const tones = ["professional", "friendly", "confident", "casual"];
//     tones.forEach(t => {
//         const opt = document.createElement("option");
//         opt.value = t;
//         opt.textContent = t[0].toUpperCase() + t.slice(1);
//         toneDropdown.appendChild(opt);
//     });

//     // 🧠 AI Reply Button
//     const button = document.createElement("button");
//     button.textContent = "AI Reply";
//     button.id = "ai-reply-button";

//     Object.assign(button.style, {
//         backgroundColor: "#1a73e8",
//         color: "#fff",
//         border: "none",
//         borderRadius: "6px",
//         padding: "6px 12px",
//         fontSize: "14px",
//         cursor: "pointer"
//     });

//     button.onclick = () => {
//         const tone = document.querySelector("#tone-dropdown")?.value || "professional";
//         handleAIReplyClick(tone);
//     };

//     // ✅ Append dropdown + button to toolbar
//     toolbar.appendChild(toneDropdown);
//     toolbar.appendChild(button);
// }

// // 👀 Watch for Gmail editor opening and inject UI
// const observer = new MutationObserver(() => addAIReplyButton());
// observer.observe(document.body, { childList: true, subtree: true });


console.log("📩 Email Writer Extension - Content Script Loaded");

function getSelectedText() {
  try {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const selected = selection.toString().trim();
      if (selected.length > 0) {
        console.log("✅ Selected Text Detected:");
        console.log(selected);
        return selected;
      } else {
        console.warn("⚠️ No text selected in main document.");
      }
    } else {
      console.warn("⚠️ No selection object available.");
    }
  } catch (e) {
    console.warn("⚠️ Could not get selected text:", e);
  }
  return null;
}

function getEmailContent() {
  const selected = getSelectedText();
  console.log("🔍 Selected text:", selected);

  if (selected) {
    console.log("✅ Using selected text as email content.");
    return selected;
  }

  const el = document.querySelector('.a3s.aiL');
  if (el) {
    const fullText = el.innerText.trim();
    if (fullText.length > 0) {
      console.log("✅ Using full email body content.");
      return fullText;
    }
  }

  console.warn("❌ Could not find any email content.");
  return null;
}

function createToneDropdown() {
  const select = document.createElement('select');
  select.className = 'ai-tone-dropdown';

  Object.assign(select.style, {
    marginRight: '8px',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #d2e3fc',
    backgroundColor: '#f1f3f4',
    fontSize: '14px',
    color: '#202124',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(60,64,67,.1)',
    outline: 'none',
    appearance: 'auto',
    WebkitAppearance: 'menulist',
    MozAppearance: 'menulist',
  });

  const tones = ['Professional', 'Friendly', 'Confident', 'Casual'];
  tones.forEach(tone => {
    const option = document.createElement('option');
    option.value = tone.toLowerCase();
    option.text = tone;
    select.appendChild(option);
  });

  return select;
}

function createAIButton() {
  const button = document.createElement('div');
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
  button.style.marginRight = '8px';
  button.innerHTML = 'AI Reply';
  button.setAttribute('role', 'button');
  button.setAttribute('data-tooltip', 'Generate AI Reply');
  return button;
}

function findComposeToolbar() {
  const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) return toolbar;
  }
  return null;
}

function injectButton() {
  // Clean up existing
  document.querySelector('.ai-reply-button')?.remove();
  document.querySelector('.ai-tone-dropdown')?.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("❌ Toolbar not found");
    return;
  }

  const toneDropdown = createToneDropdown();
  const button = createAIButton();

  button.addEventListener('click', async () => {
    const emailContent = getEmailContent();
    if (!emailContent) {
      alert("⚠️ Could not extract email content.");
      return;
    }

    const selectedTone = toneDropdown.value;

    try {
      button.innerHTML = 'Generating...';
      button.setAttribute("disabled", true);

      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: selectedTone
        })
      });

      if (!response.ok) {
        throw new Error('API Request Failed');
      }

      const reply = await response.text();
      const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

      if (composeBox) {
        composeBox.focus();
        document.execCommand('insertText', false, reply);
        console.log("✅ AI reply inserted.");
      } else {
        console.log('❌ Compose box not found');
      }
    } catch (err) {
      console.error("❌ Error generating reply:", err);
      alert("Failed to generate reply");
    } finally {
      button.innerHTML = 'AI Reply';
      button.removeAttribute("disabled");
    }
  });

  toolbar.insertBefore(toneDropdown, toolbar.firstChild);
  toolbar.insertBefore(button, toolbar.children[1]);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(node =>
      node.nodeType === Node.ELEMENT_NODE &&
      (
        node.matches?.('.aDh, .btC, [role="dialog"]') ||
        node.querySelector?.('.aDh, .btC, [role="dialog"]')
      )
    );

    if (hasComposeElements) {
      console.log("🆕 Compose window detected.");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
