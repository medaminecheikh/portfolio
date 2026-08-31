

    (function() {
      const header = document.getElementById("cyberNavHeader");
      let prevScroll = false;
      
      function onScroll() {
        const s = window.scrollY > 14;
        if (s !== prevScroll) {
          prevScroll = s;
          header.classList.toggle("cyber-nav-scrolled", s);
        }
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    
      const burger = document.getElementById("cyberBurger");
      const drawer = document.getElementById("cyberMobile");
      if (burger && drawer) {
        burger.addEventListener("click", () => {
          const open = drawer.classList.toggle("cyber-nav-is-open");
          burger.classList.toggle("cyber-nav-is-open", open);
          burger.setAttribute("aria-expanded", String(open));
        });
        document.querySelectorAll(".cyber-nav-mobile-nav a, #cyberMobile .cyber-nav-cta").forEach(a => {
          a.addEventListener("click", () => {
            drawer.classList.remove("cyber-nav-is-open");
            burger.classList.remove("cyber-nav-is-open");
            burger.setAttribute("aria-expanded", "false");
          });
        });
      }
    
      const copyBtn = document.getElementById("cyberCopyEmail");
      if (copyBtn) {
        copyBtn.addEventListener("click", e => {
          e.preventDefault();
          const email = copyBtn.dataset.email;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => {
              const tip = copyBtn.querySelector(".cyber-nav-tip");
              if (tip) tip.textContent = "copied!";
              copyBtn.classList.add("cyber-nav-copied");
              setTimeout(() => {
                copyBtn.classList.remove("cyber-nav-copied");
                if (tip) tip.textContent = "copy email";
              }, 2200);
            });
          }
        });
      }
    
      const NAV_SECTIONS = ["home", "services", "experience", "portfolio", "assistant", "contact", "skills"];
    
      function setActive(id) {
        document.querySelectorAll("#cyberDesktopNav li, #cyberMobileNav li").forEach(li => {
          li.classList.remove("cyber-nav-active");
        });
        if (!id) return;
        document.querySelectorAll(`a[href="#${id}"]`).forEach(a => {
          const li = a.closest("li");
          if (li) li.classList.add("cyber-nav-active");
        });
      }
    
      function getActiveSection() {
        const scrollY = window.scrollY;
        const navH = header ? header.offsetHeight : 0;
        const trigger = scrollY + navH + 50;
        let active = null;
    
        for (let i = 0; i < NAV_SECTIONS.length; i++) {
          const id = NAV_SECTIONS[i];
          const el = document.getElementById(id);
          if (!el) continue;
          
          const top = el.getBoundingClientRect().top + scrollY;
          if (top <= trigger) {
            active = id;
          }
        }
        return active;
      }
    
      let ticking = false;
      let lastActive = null;
    
      function onNavScroll() {
        if (!ticking) {
          requestAnimationFrame(() => {
            const current = getActiveSection();
            if (current !== lastActive) {
              lastActive = current;
              setActive(current);
            }
            ticking = false;
          });
          ticking = true;
        }
      }
    
      window.addEventListener("scroll", onNavScroll, { passive: true });
    
      setTimeout(() => {
        const current = getActiveSection();
        lastActive = current;
        setActive(current);
      }, 100);
    
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
          const href = this.getAttribute("href");
          if (!href || href === "#") return;
          
          const targetEl = document.getElementById(href.substring(1));
          if (!targetEl) return;
          
          e.preventDefault();
          const navH = header ? header.offsetHeight : 0;
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - navH - 10;
          
          window.scrollTo({ top, behavior: "smooth" });
          history.pushState(null, null, href);
        });
      });
    
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            const navH = header ? header.offsetHeight : 0;
            const top = el.getBoundingClientRect().top + window.pageYOffset - navH - 10;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }, 200);
      }
    })();
