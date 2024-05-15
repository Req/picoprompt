import { openSync, readSync, closeSync } from 'fs'
import stripAnsi from 'strip-ansi'

const term = 13; // carriage return

// ANSI escape codes reference https://en.wikipedia.org/wiki/ANSI_escape_code

/**
 * prompt -- Blocking / sync function for reading user input from stdin
 * @param {String} ask opening question/statement to prompt for
 *
 * @returns {String} Returns the string input or terminates with a ^C or ^D
 */
function prompt(ask) {
  var insert = 0
  ask = ask || ''

  /// fd is the file descriptor for stdin
  var fd = (process.platform === 'win32') ? process.stdin.fd : openSync('/dev/tty', 'rs');

  var wasRaw = process.stdin.isRaw;
  if (!wasRaw) { process.stdin.setRawMode && process.stdin.setRawMode(true); }

  var buf = Buffer.alloc(3) // holds the input bytes
  var str = '', character, read;

  process.stdout.write(ask);

  while (true) {
    read = readSync(fd, buf, 0, 3);
    if (read > 1) { // received a control sequence
      switch(buf.toString()) {
        case '\u001b[D': // left arrow
          var before = insert;
          insert = (--insert < 0) ? 0 : insert;
          if (before - insert)
            process.stdout.write('\u001b[1D');
          break;
        case '\u001b[C': // right arrow
          insert = (++insert > str.length) ? str.length : insert;
          process.stdout.write('\u001b[' + (insert+ask.length+1) + 'G');
          break;
        default:
          if (buf.toString()) {
            str = str + buf.toString();
            str = str.replace(/\0/g, '');
            insert = str.length;
            promptPrint(ask, str, insert);
            process.stdout.write('\u001b[' + (insert+ask.length+1) + 'G');
            buf = Buffer.alloc(3);
          }
      }
      continue; // any other 3 character sequence is ignored
    }

    // handle a control character seq, assume only one character is read
    character = buf[read-1];

    // handle ^C and kill the process
    if (character == 3){
      process.stdout.write('^C\n');
      closeSync(fd);

      process.exit(130);
    }

    // handle ^D and kill the process
    if (character == 4) {
      if (str.length == 0) {
        process.stdout.write('exit\n');
        process.exit(0);
      }
    }

    // handle the terminating character
    if (character == term) {
      closeSync(fd);
      break;
    }

    // handle backspace
    if (character == 127 || (process.platform == 'win32' && character == 8)) {
      if (!insert) continue;
      str = str.slice(0, insert-1) + str.slice(insert);
      insert--;
      process.stdout.write('\u001b[2D');
    } else {
      // handle regular ascii character
      if ((character < 32 ) || (character > 126))
          continue;
      str = str.slice(0, insert) + String.fromCharCode(character) + str.slice(insert);
      insert++;
    }

    promptPrint(ask, str, insert);
  }

  process.stdout.write('\n')
  process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);

  return str || '';
}

function promptPrint(ask, str, insert) {
    process.stdout.write('\u001b[s');
    if (insert == str.length) {
        process.stdout.write('\u001b[2K\u001b[0G'+ ask + str);
    } else {
      if (ask) {
        process.stdout.write('\u001b[2K\u001b[0G'+ ask + str);
      } else {
        process.stdout.write('\u001b[2K\u001b[0G'+ str + '\u001b[' + (str.length - insert) + 'D');
      }
    }

    // Reposition the cursor to the right of the insertion point
    var askLength = stripAnsi(ask).length;
    process.stdout.write(`\u001b[${askLength+1+insert}G`);
}

export default prompt
