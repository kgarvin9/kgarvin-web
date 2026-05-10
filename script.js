/* ── Scroll reveal ── */
const revealNodes = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealNodes.forEach((node) => revealObserver.observe(node));

/* ── Active nav link ── */
const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "index.html" && href === "index.html")) {
    link.classList.add("active");
  }
});

/* ── Visitor counter (landing page) ── */
const counterEl = document.getElementById("visitor-count");
if (counterEl) {
  counterEl.innerHTML = '<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fkgarvin.com&count_bg=%231a2d4d&title_bg=%2337538C&icon=&icon_color=%23E7E7E7&title=visits&edge_flat=true" alt="visitor count" style="height: 18px; vertical-align: middle; opacity: 0.7;" />';
}

/* ── Lesson inquiry form (Formspree) ── */
const FORMSPREE_ID = "xrejoegn";

const form = document.getElementById("inquiry-form");
const note = document.getElementById("form-note");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!FORMSPREE_ID) {
      if (note) note.textContent = "Form not configured yet — please set up Formspree.";
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        if (note) note.textContent = "Inquiry sent! Kristen will be in touch soon.";
      } else {
        const err = await res.json();
        if (note) note.textContent = err?.errors?.map(e => e.message).join(", ") || "Something went wrong — please try again.";
      }
    } catch {
      if (note) note.textContent = "Network error — please check your connection and try again.";
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send Inquiry"; }
    }
  });
}
