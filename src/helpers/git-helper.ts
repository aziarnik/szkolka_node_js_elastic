import { exec } from 'child_process';

export const execAsync = function (command: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }

      resolve(stdout.trim());
    });
  });
};
