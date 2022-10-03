import { Router } from 'express';
import { GetBasicProjectInfo } from '../controllers/version-controller.js';

export const versionRoute = Router();

versionRoute.get('/version', GetBasicProjectInfo);
