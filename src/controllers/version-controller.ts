import { Request, Response } from 'express';
import { ProjectBasicInfo } from '../contracts/project-basic-info';
import { exec } from 'child_process';

export const GetBasicProjectInfo = async (
  req: Request,
  res: Response<ProjectBasicInfo>
) => {
  const lastCommitHashCode = await execAsync('git rev-parse HEAD');
  const projectVersion = process.env.npm_package_version ?? 'none';

  res.send({
    LastCommitHashCode: lastCommitHashCode,
    ProjectVersion: projectVersion
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
