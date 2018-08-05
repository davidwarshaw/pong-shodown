class HighScore {

  static update(playState) {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();

    const newHighScore = {
      name: playState.storyMode.playerCharacterName,
      date: `${mm}.${dd}.${yyyy}`,
      score: playState.storyMode.score
    };

    playState.highScores.push(Object.assign({}, newHighScore));
    playState.highScores.sort((l, r) => r.score - l.score);

    // Truncate high scores to 10
    if (playState.highScores.length > 10) {
      playState.highScores.length = 10;
    }

    // Clear the story mode progress
    playState.storyMode.playerCharacterName = null;

    // Save the play state
    localStorage.setItem('playState', JSON.stringify(playState));
  }

}

export default HighScore;
