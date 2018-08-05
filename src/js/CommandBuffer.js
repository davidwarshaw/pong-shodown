class CommandBuffer {

  constructor(game) {
    this.game = game;
    this.frameMs = 65;
    this.numFrames = 10;

    this.buffer = new Array(this.numFrames);
    this.msCounter = 0;
    this.currentFrame = 0;

    this.currentMoveName = '  ';

    this.buttonPress = 'button';
  }

  update() {
    // Add the elapsed time to the counter
    this.msCounter += this.game.time.elapsed;

    // If we've counter a full frame, roll the counter over
    // and increment the current frame
    if (this.msCounter >= this.frameMs) {
      this.msCounter = 0;
      this.currentFrame += 1;

      // Wrap the current frame around to 0
      if (this.currentFrame >= this.numFrames) {
        this.currentFrame = 0;
      }

      // Clear the new frame
      this.buffer[this.currentFrame] = { command: '', executed: false };
    }

    const executedInBuffer = this.buffer
      .filter(command => command.executed).length;
    if (executedInBuffer === 0) {
      this.currentMoveName = '  ';
    }
  }

  pushCommand(command) {
    // Don't overwrite the button command with an arrow
    if (this.buffer[this.currentFrame].command !== this.buttonPress) {
      this.buffer[this.currentFrame] = { command, executed: false };
    }
  }

  search(moves) {

    // If there is a button press in the candidates, shift the array
    // until the button press is the last item
    const buttonPressed = this.buffer
      .filter(e => e.command === this.buttonPress);

    // Add index of candidate and keep only candidates with commands
    const moveCandidates = this.buffer
      .map((candidate, index) => Object.assign({}, candidate, { index }))
      .filter(candidate => candidate.command);

    const lastIndex = moveCandidates.length - 1;
    if (buttonPressed) {
      while (moveCandidates[lastIndex].command !== this.buttonPress) {
        const shiftedItem = moveCandidates.shift();
        moveCandidates.push(shiftedItem);
      }
    }

    // Compress adjacent commands that are the same
    const compressedCandidates = [];
    const moveCandidateCommands = moveCandidates.map(e => e.command);
    for (let i = 0; i < moveCandidateCommands.length; ++i) {
      if (moveCandidateCommands[i] === moveCandidateCommands[i + 1]) {
        continue;
      }
      const candidate = {
        command: moveCandidateCommands[i],
        index: i
      };
      compressedCandidates.push(candidate);
    }

    // Transform to string to do substring search (it's easier!)
    const joinChar = ':';
    const moveCandidateString = compressedCandidates
      .map(e => e.command)
      .join(joinChar);

    // For each move
    for (const move of moves) {

      // Do substring search for the move in the buffer
      const moveString = move.commands.join(joinChar);
      const moveCharIndex = moveCandidateString.indexOf(moveString);

      // We found a move
      if (moveCharIndex > -1) {

        // If a command index is in the found move indexes, mark it executed
        const moveIndexes = moveCandidates.map(candidate => candidate.index);
        this.buffer.forEach((command, i) => {
          if (moveIndexes.indexOf(i) > 0) {
            command.executed = true;
          }
        });

        this.currentMoveName = move.name;
        return move;
      }
    }
    return null;
  }
}

export default CommandBuffer;
