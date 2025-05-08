document.addEventListener('DOMContentLoaded', () => {
    let difficulty = localStorage.getItem('gameDifficulty') || "Normal";
    document.getElementById('difficulty-output').textContent = `Difficulty: ${difficulty}`;

    const livesDisplay = document.getElementById('lives-display');
    const scoreDisplay = document.getElementById('score-display');
    const restartButton = document.getElementById('restart-button');
    let lives = 3;
    let score = 0;
    let correctAnswers = 0;
    let totalAttempts = 0;
    let startTime = 0;
    let endTime = 0;
    let nextExpected = 1;
    let gameOver = false;
    let clickable = false;
    let perfectScores = JSON.parse(localStorage.getItem('perfectScores')) || { Easy: false, Normal: false, Hard: false };
    let extremeButton = document.getElementById('extreme-button');

    const heartElement = livesDisplay.querySelector('.heart');
    let username = localStorage.getItem("lastUser") || "Unknown User";

    function updateDisplays() {
        if (lives === 3) {
            heartElement.className = "heart full";
        } else if (lives === 2) {
            heartElement.className = "heart half";
        } else {
            heartElement.className = "heart empty";
        }
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function checkAndShowExtremeButton() {
        if (perfectScores.Easy && perfectScores.Normal && perfectScores.Hard && extremeButton) {
            extremeButton.style.display = 'block';
            extremeButton.addEventListener('click', () => {
                localStorage.setItem('gameDifficulty', 'Extreme');
                localStorage.setItem('extremeButtonClicked', 'true');
                extremeButton.style.display = 'none';
                location.reload();
            });
        } else if (extremeButton) {
            extremeButton.style.display = 'none';
        }
    }

    if (localStorage.getItem('extremeButtonClicked') === 'true') {
        extremeButton.style.display = 'none';
    } else {
        checkAndShowExtremeButton(); 
    }

    updateDisplays();

    let displayTime = 3000; 
    if (difficulty === "Easy") displayTime = 5000;
    if (difficulty === "Hard") displayTime = 2000;
    if (difficulty === "Extreme") displayTime = 1000; 

    const grid = document.createElement('div');
    grid.id = "game-grid";
    document.body.appendChild(grid);

    const numbers = [...Array(9).keys()].map(i => i + 1);
    const shuffled = numbers.sort(() => Math.random() - 0.5);

    shuffled.forEach(num => {
        const cell = document.createElement('div');
        cell.className = "circle";
        cell.textContent = num;
        cell.dataset.number = num;
        grid.appendChild(cell);
    });

    setTimeout(() => {
        document.querySelectorAll('.circle').forEach(c => c.textContent = '');
        startTime = Date.now();
        clickable = true;
    }, displayTime);

    grid.addEventListener('click', e => {
        if (gameOver || !e.target.classList.contains('circle') || !clickable) return;

        const clickedNum = parseInt(e.target.dataset.number);
        totalAttempts++;

        if (clickedNum === nextExpected) {
            correctAnswers++;
            e.target.classList.add('correct');
            e.target.style.pointerEvents = 'none';
            nextExpected++;
            score = Math.round((correctAnswers / totalAttempts) * 100);
            updateDisplays();

            if (nextExpected > 9) {
                endTime = Date.now();
                let timeTaken = (endTime - startTime) / 1000;
                let timeBonus = Math.max(0, 10 - timeTaken) * 10;
                score = Math.min(Math.round((correctAnswers / totalAttempts) * 100 + timeBonus), 100);
                alert(`🎉 You win! Final Score: ${score}/100`);
                gameOver = true;
                saveHighscore(username, score, difficulty);
                displayHighscores(difficulty);
                restartButton.style.display = 'inline-block';

                if (score === 100) {
                    perfectScores[difficulty] = true;
                    localStorage.setItem('perfectScores', JSON.stringify(perfectScores));
                    checkAndShowExtremeButton();
                }
            }
        } else {
            lives--;
            score = Math.max(score - 25, 0);
            updateDisplays();
            e.target.classList.add('wrong');
            setTimeout(() => {
                e.target.classList.remove('wrong');
            }, 500);

            if (lives === 0) {
                alert(`💀 Game Over! Final Score: ${score}/100`);
                gameOver = true;
                grid.style.pointerEvents = "none";
                saveHighscore(username, score, difficulty);
                displayHighscores(difficulty);
                restartButton.style.display = 'inline-block';
            }
        }
    });

    function saveHighscore(user, finalScore, difficultyLevel) {
        let highscore = JSON.parse(localStorage.getItem(`highscores_${difficultyLevel}`)) || [];
        highscore.push({ name: user, score: finalScore });
        highscore.sort((a, b) => b.score - a.score);
        highscore = highscore.slice(0, 3);
        localStorage.setItem(`highscores_${difficultyLevel}`, JSON.stringify(highscore));
    }

    function displayHighscores(difficultyLevel) {
        const highscoreContainer = document.getElementById('top-scores-display');
        const highscores = JSON.parse(localStorage.getItem(`highscores_${difficultyLevel}`)) || [];

        highscoreContainer.innerHTML = `
            <h3>Top 3 High Scores</h3>
            <div id="highscore-1">
                <strong>1st:</strong> <span id="highscore-name-1">${highscores[0]?.name || 'N/A'}</span> - <span id="highscore-score-1">${highscores[0]?.score || 0}</span>
            </div>
            <div id="highscore-2">
                <strong>2nd:</strong> <span id="highscore-name-2">${highscores[1]?.name || 'N/A'}</span> - <span id="highscore-score-2">${highscores[1]?.score || 0}</span>
            </div>
            <div id="highscore-3">
                <strong>3rd:</strong> <span id="highscore-name-3">${highscores[2]?.name || 'N/A'}</span> - <span id="highscore-score-3">${highscores[2]?.score || 0}</span>
            </div>
        `;
    }

    displayHighscores(difficulty);
    if (localStorage.getItem('extremeButtonClicked') !== 'true') {
        checkAndShowExtremeButton();
    }
});