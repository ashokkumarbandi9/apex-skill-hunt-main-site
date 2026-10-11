const header=document.getElementById("header");window.addEventListener("scroll",()=>{if(header)header.classList.toggle("scrolled",scrollY>25)},{passive:true});
const menu=document.querySelector(".menu"),nav=document.querySelector(".nav nav");if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");if(open){nav.style.display="flex";nav.style.position="absolute";nav.style.top="70px";nav.style.left="0";nav.style.right="0";nav.style.padding="20px 5%";nav.style.background="#070707";nav.style.flexDirection="column";nav.style.alignItems="stretch";nav.style.borderBottom="1px solid #292822"}else nav.removeAttribute("style")})}
const items=document.querySelectorAll(".reveal,.pop");const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("revealed");io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -50px 0px"});items.forEach((el,i)=>{el.style.transitionDelay=`${(i%4)*70}ms`;io.observe(el)});

const form = document.getElementById("contactForm");
const success = document.getElementById("success");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    success.textContent = "";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        success.textContent =
          "Thank you! Your enquiry has been sent successfully. We will contact you soon.";
        form.reset();
      } else {
        success.textContent =
          "Sorry, we couldn't send your enquiry. Please try again or email info@apexskillhunt.in.";
      }
    } catch (error) {
      success.textContent =
        "Connection error. Please try again or email info@apexskillhunt.in.";
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Send Enquiry →";
      }
    }
  });
}



document.querySelectorAll('[data-link-pending="true"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "https://exams.apexskillhunt.in";
  });
});

