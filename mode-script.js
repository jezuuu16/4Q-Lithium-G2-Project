const modesHeaderText = document.getElementById("modes-header-text");

      modesHeaderText.addEventListener("mouseenter", function() {
        modesHeaderText.textContent = "<--MAIN MENU";
      });

      modesHeaderText.addEventListener("mouseleave", function() {
        modesHeaderText.textContent = "MODES";
      });

      modesHeaderText.addEventListener("click", function() {
        window.location.href = "index.html"; 
      });

      document.getElementById('easy-button').addEventListener('click', function() {
        localStorage.setItem('gameDifficulty', 'Easy');
        window.location.href = 'game.html'; 
      });

      document.getElementById('normal-button').addEventListener('click', function() {
        localStorage.setItem('gameDifficulty', 'Normal');
        window.location.href = 'game.html'; 
      });

      document.getElementById('hard-button').addEventListener('click', function() {
        localStorage.setItem('gameDifficulty', 'Hard');
        window.location.href = 'game.html'; 
      });