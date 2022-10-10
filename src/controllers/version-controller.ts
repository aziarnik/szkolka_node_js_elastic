import { Request, Response } from 'express';
import { ProjectBasicInfo } from '../contracts/project-basic-info';
import { execAsync } from '../helpers/git-helper';

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
