export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export const SET_ALERT = 'SET_ALERT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

export const SET_TAB = 'SET_TAB';
export const CLOSE_TAB = 'CLOSE_TAB';
export const ADD_TAB = 'ADD_TAB';
export const SET_TAB_NAME = 'SET_TAB_NAME';

export const SET_TABLES_SERVER = 'SET_TABLES_SERVER';

export const SET_QUERY = 'SET_QUERY';
export const SET_LIMIT = 'SET_LIMIT';
export const SET_COMPANY = 'SET_COMPANY';
export const SET_SERVER = 'SET_SERVER';

export const FETCH_TABLES = 'FETCH_TABLES';
export const FETCH_TABLE = 'FETCH_TABLE';
export const FETCH_QUERY = 'FETCH_QUERY';

export const API_TABLES = '/:server/api/sage-tables.php';
export const API_TABLE = '/:server/api/sage-tables.php\\?table=:table';
export const API_QUERY = '/node-sage/api/:company/query/:limit(\\d+)?/:offset(\\d+)?';

export const COMPANIES = ['CHI', 'TST', 'BCS', 'BCT'];
export const SERVERS = ['arches', 'bryce', ];
