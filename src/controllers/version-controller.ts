import { Request, Response } from 'express';
import { ProjectBasicInfo } from '../contracts/project-basic-info.js';
import { exec } from 'child_process';

export const GetBasicProjectInfo = async (
  req: Request,
  res: Response<ProjectBasicInfo>
) => {
  const lastCommitHashCode = await execAsync('git rev-parse HEAD');
  const projectVersion = process.env.npm_package_version;

  res.send({
    LastCommitHashCode: lastCommitHashCode,
    ProjectVersion: projectVersion as string
  });
};

function execAsync(command: string): Promise<string> {
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
}
