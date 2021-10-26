import fs from 'fs';
import express, {NextFunction, Response} from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
const router = express.Router();
const app = express();
const port = 8080; // default port to listen

app.use(session({ secret: 'test_secret', saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let userSession: any;

/**
 * login rest api
 */
router.post('/login', (req: any, res) => {
    userSession = req.session;
    userSession.email = req.body.email;
    res.status(200).json({result: 0});
});


/**
 * authenticate middleware
 * use to check whether the user is login
 * @param req
 * @param res
 * @param next
 */
function authenticateUser(req: any, res: Response, next: NextFunction) {
    if (req.session.email !== undefined) {
        next();
    } else {
        res.status(200).json({result: -1});
    }
}

/**
 *  demonstrate how authenticateUser middleware apply to /api/proxy
 */
router.get('/api/proxy/*', authenticateUser, (req, res, next) => {
    res.status(200).json({result: 0});
    next();
});

/**
 *  demonstrate how authenticateUser middleware apply to /pub/proxy
 */
router.get('/pub/proxy/*', authenticateUser, (req, res, next) => {
    res.status(200).json({result: 0});
    next();
});


/**
 * writes contents of request body that is JSON to file named id.json
 */
router.post('/save/:id',  (req, res) => {
    if (!fs.existsSync(`${__dirname}/data`)) {
        fs.mkdirSync(`${__dirname}/data`);
    }
    fs.writeFile(`${__dirname}/data/${req.params.id}.json`, JSON.stringify(req.body), (err: Error) => {
        if (err) throw err;
        res.status(201).json({result: 0,
            msg: 'The file has been saved!'});
    });
});

/**
 * return content from file named id.json as JSON
 */
router.get('/save/:id', (req, res) => {
    const data = fs.readFileSync(`${__dirname}/data/${req.params.id}.json`, 'utf-8');
    res.status(200).json(JSON.parse(data));
});


app.use('/', router);

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
