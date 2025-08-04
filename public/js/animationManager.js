class AnimationManager {
  transitionScreen(currentScreen, nextScreen) {
    if (typeof gsap === "undefined") {
      // Fallback si GSAP no está disponible
      if (currentScreen) currentScreen.style.display = "none";
      if (nextScreen) nextScreen.style.display = "flex";
      return;
    }

    const tl = gsap.timeline();
    tl.to(currentScreen, {
      autoAlpha: 0,
      y: -50,
      duration: 0.3,
      ease: "power2.in",
    })
      .set(currentScreen, { display: "none" })
      .set(nextScreen, { display: "flex", autoAlpha: 0, y: 50 })
      .to(nextScreen, {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
  }

  animateButtonClick(button) {
    if (typeof gsap === "undefined") {
      // Fallback básico
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 100);
      return;
    }

    gsap.fromTo(
      button,
      { scale: 1 },
      { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
    );
  }

  animateChapterGrid(grid) {
    if (typeof gsap === "undefined") return;

    gsap.from(grid.children, {
      duration: 0.5,
      scale: 0.5,
      opacity: 0,
      delay: 0.2,
      stagger: 0.05,
      ease: "elastic.out(1, 0.5)",
    });
  }

  animateGamePiecesIn(pieces) {
    if (typeof gsap === "undefined") return;

    gsap.from(pieces, {
      duration: 0.5,
      y: 100,
      opacity: 0,
      stagger: 0.1,
      ease: "back.out(1.7)",
    });
  }

  showFeedback(text, color) {
    const feedbackText = document.getElementById("feedback-text");
    const feedbackOverlay = document.getElementById("feedback-overlay");

    if (!feedbackText || !feedbackOverlay) return;

    feedbackText.textContent = text;
    feedbackText.style.color = color;

    if (typeof gsap === "undefined") {
      // Fallback básico
      feedbackOverlay.style.display = "flex";
      feedbackText.style.opacity = "1";
      return;
    }

    gsap.set(feedbackOverlay, { display: "flex" });
    gsap.fromTo(
      feedbackText,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
    );
  }

  hideFeedback() {
    const feedbackOverlay = document.getElementById("feedback-overlay");
    if (!feedbackOverlay) return;

    if (typeof gsap === "undefined") {
      // Fallback básico
      feedbackOverlay.style.display = "none";
      return;
    }

    gsap.to(feedbackOverlay, {
      autoAlpha: 0,
      onComplete: () => gsap.set(feedbackOverlay, { display: "none" }),
    });
  }

  shakeElement(element) {
    if (!element) return;

    if (typeof gsap === "undefined") {
      // Fallback básico
      element.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        element.style.animation = "";
      }, 500);
      return;
    }

    gsap.fromTo(
      element,
      { x: 0 },
      {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        clearProps: "x",
      }
    );
  }

  highlightElement(element) {
    if (!element || typeof gsap === "undefined") return;

    gsap.fromTo(
      element,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 3,
        ease: "power2.inOut",
      }
    );
  }
}
