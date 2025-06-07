document.querySelectorAll('.win95-window').forEach(win => {
  const bar = win.querySelector('.win95-titlebar');
  if (!bar) return;
  let isDragging = false, offsetX = 0, offsetY = 0;
  let originalMargin = win.style.margin;

  bar.addEventListener('mousedown', e => {
    isDragging = true;
    // Si la fenêtre n'est pas déjà en position fixed, on la positionne à l'endroit actuel
    if (getComputedStyle(win).position !== 'fixed') {
      const rect = win.getBoundingClientRect();
      win.style.position = 'fixed';
      win.style.left = rect.left + 'px';
      win.style.top = rect.top + 'px';
      // Supprime le margin pour éviter le saut
      originalMargin = win.style.margin;
      win.style.margin = '0';
    }
    win.style.zIndex = 9999;
    // Calcul du décalage par rapport à la position actuelle
    offsetX = e.clientX - win.getBoundingClientRect().left;
    offsetY = e.clientY - win.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    win.style.left = (e.clientX - offsetX) + 'px';
    win.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      // Optionnel : tu peux restaurer le margin ici si tu veux
      // win.style.margin = originalMargin;
    }
    isDragging = false;
  });
});
