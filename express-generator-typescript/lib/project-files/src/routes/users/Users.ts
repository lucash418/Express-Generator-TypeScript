import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { logger } from '@shared';
import { IUserDao, UserDao, UserDaoMock } from '@daos';


// Init router and path
const router = Router();
const path = '/users';


export let userDao: IUserDao;
if (process.env.NODE_ENV === 'development') {
    userDao = new UserDaoMock();
} else {
    userDao = new UserDao();
}


/******************************************************************************
 *                                Get All Users
 ******************************************************************************/

// Constants
export const getUsersPath = '/all';

/**
 * Return user using name and email.
 * Full Path: "GET /api/users/all"
 */
router.get(getUsersPath, async (req: Request, res: Response) => {
    try {
        const users = await userDao.getAll();
        return res.status(OK).json({users});
    } catch (err) {
        logger.error('', err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                                Add One
 ******************************************************************************/

// Constants
export const addUserPath = '/add';
export const userMissingErr = 'User property was not present for adding user route.';

/**
 * Add one user.
 * Full Path: "POST /api/users/add"
 */
router.post(addUserPath, async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: userMissingErr,
            });
        }
        await userDao.add(user);
        return res.status(CREATED).end();
    } catch (err) {
        logger.error('', err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                                      Update
 ******************************************************************************/

// Constants
export const updateUserPath = '/update';
export const userUpdateMissingErr = 'User property was not present for updating user route.';

/**
 * Update one user.
 * Full Path: "PUT /api/users/update"
 */
router.put(updateUserPath, async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: userUpdateMissingErr,
            });
        }
        await userDao.update(user);
        return res.status(OK).end();
    } catch (err) {
        logger.error('', err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                                      Delete
 ******************************************************************************/

// Constants
export const deleteUserPath = '/delete/:id';
export const userDeleteMissingErr = 'Id property was not present for delete user route.';

/**
 * Add one user.
 * Full Path: "DELETE /api/users/delete/:id"
 */
router.delete(deleteUserPath, async (req: Request, res: Response) => {
    try {
        await userDao.delete(req.params.id);
        return res.status(OK).end();
    } catch (err) {
        logger.error('', err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default { router, path };
