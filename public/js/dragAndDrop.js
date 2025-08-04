class DragAndDrop {
  constructor(callbacks) {
    this.callbacks = callbacks; // { onCorrect, onIncorrect, onDragStart, onDrop }
    this.draggableInstances = [];
    this.solution = "";
    this.currentWord = "";
  }

  create(draggableSelector, droppableSelector, solution) {
    this.solution = solution.toLowerCase();
    this.currentWord = "";
    const droppable = document.querySelector(droppableSelector);
    const draggables = document.querySelectorAll(draggableSelector);

    this.createNativeDragDrop(draggables, droppable);
  }

  createNativeDragDrop(draggables, droppable) {
    draggables.forEach((draggable) => {
      draggable.draggable = true;
      draggable.style.cursor = "grab";

      draggable.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", draggable.textContent);
        draggable.style.opacity = "0.5";
        draggable.style.cursor = "grabbing";
        if (this.callbacks && this.callbacks.onDragStart) {
          this.callbacks.onDragStart();
        }
      });

      draggable.addEventListener("dragend", (e) => {
        draggable.style.opacity = "1";
        draggable.style.cursor = "grab";
      });
    });

    droppable.addEventListener("dragover", (e) => {
      e.preventDefault();
      droppable.classList.add("drag-over");
    });

    droppable.addEventListener("dragleave", (e) => {
      droppable.classList.remove("drag-over");
    });

    droppable.addEventListener("drop", (e) => {
      e.preventDefault();
      droppable.classList.remove("drag-over");

      const draggedText = e.dataTransfer.getData("text/plain");
      const draggedElement = Array.from(draggables).find(
        (el) => el.textContent === draggedText
      );

      if (draggedElement) {
        // Agregar el texto al área de construcción
        this.currentWord += draggedText.toLowerCase();

        // Actualizar el display
        this.updateDisplay(droppable);

        if (this.callbacks && this.callbacks.onDrop) {
          this.callbacks.onDrop(draggedElement);
        }

        // Ocultar la pieza usada
        draggedElement.style.display = "none";

        // Verificar la solución
        this.checkSolution();
      }
    });
  }

  updateDisplay(droppable) {
    if (this.currentWord.length > 0) {
      droppable.textContent = this.currentWord.toUpperCase();
    } else {
      droppable.innerHTML =
        '<span class="placeholder-text">ARRASTRE AQUÍ</span>';
    }
  }

  checkSolution() {
    if (this.currentWord === this.solution) {
      if (this.callbacks && this.callbacks.onCorrect) {
        this.callbacks.onCorrect();
      }
    } else if (this.currentWord.length >= this.solution.length) {
      if (this.callbacks && this.callbacks.onIncorrect) {
        this.callbacks.onIncorrect();
      }
    }
    // Si aún no está completa, no hacer nada
  }

  reset() {
    this.currentWord = "";
    const droppable = document.querySelector("#drop-target");
    if (droppable) {
      this.updateDisplay(droppable);
    }

    // Mostrar todas las piezas de nuevo
    const draggables = document.querySelectorAll(".draggable-piece");
    draggables.forEach((piece) => {
      piece.style.display = "flex";
    });
  }

  destroy() {
    if (this.draggableInstances && this.draggableInstances.length > 0) {
      this.draggableInstances.forEach((d) => d.kill && d.kill());
      this.draggableInstances = [];
    }
  }
}
