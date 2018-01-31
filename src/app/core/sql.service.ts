import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";

const DB_NAME: string = '_hackday';
const win: any = window;

@Injectable()
export class SqlService {
    private _dbPromise: Promise<any>;

    constructor(public platform: Platform) {

        this._dbPromise = new Promise((resolve, reject) => {
            try {
                let _db: any;
                this.platform.ready().then(() => {
                    if (this.platform.is('cordova') && win.sqlitePlugin) {
                        _db = win.sqlitePlugin.openDatabase({
                            name: DB_NAME,
                            location: 'default'
                        });
                    } else {
                        console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
                        _db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
                    }
                    resolve(_db);
                });
            } catch (err) {
                reject({ err: err });
            }
        });
    }

    // Initialize the DB with our required tables 
    // include any migrations here also
    public createTables() {

        this.queryAll([

            // Create statements and alter statements here
            new Query('CREATE TABLE IF NOT EXISTS tbl_User (id, name)'),

        ]).catch((err) => console.log(err));
    }

    /**
     * Perform an arbitrary SQL operation on the database. Use this method
     * to have full control over the underlying database through SQL operations
     * like SELECT, INSERT, and UPDATE.
     *
     * @param {string} query the query to run
     * @param {array} params the additional params to use for query placeholders
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    query(query: string | Query, params: any[] = []): Promise<any> {
        if (query instanceof Query) {
            params = query.params;
            query = query.query;
        }

        return new Promise((resolve, reject) => {
            try {
                this._dbPromise.then(db => {
                    db.transaction((tx: any) => {
                        tx.executeSql(query, params,
                            (tx: any, res: any) => resolve({ tx: tx, rows: res.rows, rowsAffected: res.rowsAffected }),
                            (tx: any, err: any) => {
                                console.log(err);
                                reject({ tx: tx, err: err })
                            });
                    },
                        (err: any) => {
                            console.log(err);
                            reject({ err: err })
                        });
                }, err => {
                    alert(err);
                    reject({ err: err });
                });
            } catch (err) {
                console.log(err);
                reject({ err: err });
            }
        });
    }

    /**
     * Performs multiple queries within a single transaction.
       Much faster method if you need to insert/update multiple records at once
     * @param queries
     */
    queryAll(queries: Query[]): Promise<any> {
        return new Promise((resolve, reject) => {

            var promises: Promise<any>[] = [];

            try {
                this._dbPromise.then(db => {
                    db.transaction((tx: any) => {
                        for (let query of queries)
                            promises.push(
                                query.executeAsPromise(tx)
                            );

                        return Promise.all(promises)
                            .then(function (success) {
                                resolve(success)
                            })
                            .catch(function (err) {
                                reject(err);
                            });
                    });
                })
            } catch (err) {
                reject({ err: err });
            }
        });
    }

    /**
     * 
     * @param queries 
     * @param itemsPerBatch 
     */
    async queryInChunks(queries: Query[], itemsPerBatch = 1000) {
        while (queries.length > 0) {
            // Get the next batch
            var batch = queries.splice(0, itemsPerBatch);
            // Execite the batch and wait for it to finished
            // before doing the next
            await this.queryAll(batch);
        }
    }
}

export class Query {
    public query: string;
    public params: any[];

    constructor(query: string, params: any[] = []) {
        this.query = query;
        this.params = params;
    }

    public executeAsPromise(tx) {
        return new Promise((resolve, reject) => {
            tx.executeSql(this.query, this.params,
                (tx: any, res: any) => resolve({ tx: tx, rows: res.rows, rowsAffected: res.rowsAffected }),
                (tx: any, err: any) => {
                    console.log(err);
                    reject({ tx: tx, err: err, query: this.query });
                });
        }).catch((err) =>  console.log(err));
    }
}